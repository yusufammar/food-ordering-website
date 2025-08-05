const user = require('./models/user');
const pool = require('./config/db.js')

async function setupDB() {
    try {
        await user.createUsersTable();
            console.log("User Table Created"); // Runs after createUsersTable() due to await making things run sequentially
        await user.clearUsersTable();
            console.log("User Table Cleared");
        await user.insertAdmin();
            console.log("Admin Inserted");

        //----------------------------------
        // Terminal stays open because the database connection pool is still active, keeping Node.js running until closed
        await pool.end();
            console.log("DB Connection Pool Closed");
        //---------------------------------------------
            console.log("Setup Complete");
    }
    catch (err) {
        console.error(err)
    }
}

setupDB();


