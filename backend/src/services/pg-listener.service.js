const { pool, fetchAllTablesData } = require("./db.service");

async function setupTriggers(client) {
  // Create single trigger function for all notifications
  await client.query(`
        CREATE OR REPLACE FUNCTION notify_data_change()
        RETURNS trigger AS $$
        BEGIN
            PERFORM pg_notify('data_changes', 'data_updated');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

  // Create triggers for all tables with a single function
  const tables = ['"User"', '"Stall"', "user_stall_interactions"];

  for (const table of tables) {
    await client.query(`
            DROP TRIGGER IF EXISTS ${table.replace(
              /"/g,
              ""
            )}_change_trigger ON ${table};
            CREATE TRIGGER ${table.replace(/"/g, "")}_change_trigger
            AFTER INSERT OR UPDATE OR DELETE ON ${table}
            FOR EACH STATEMENT EXECUTE FUNCTION notify_data_change();
        `);
  }
}

async function setupNotificationListener(client, io) {
  // Listen for notifications
  await client.query("LISTEN data_changes");

  // Single notification handler that broadcasts all data
  client.on("notification", async () => {
    try {
      const allData = await fetchAllTablesData();
      io.emit("all_data_update", allData);
    } catch (error) {
      console.error("Error sending data update:", error);
    }
  });
}

async function setupPgListener(io) {
  const client = await pool.connect();
  try {
    await setupTriggers(client);
    await setupNotificationListener(client, io);
    console.log("PostgreSQL notification listener set up successfully");
  } catch (error) {
    console.error("Error setting up PostgreSQL listener:", error);
    client.release();
    setTimeout(() => setupPgListener(io), 5000);
  }
}

module.exports = { setupPgListener };
