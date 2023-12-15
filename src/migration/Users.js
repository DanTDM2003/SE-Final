const cn = require('../config/database.js');

module.exports = async () => {
    let checkTableQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Users')";
    
    await cn.connection.oneOrNone(checkTableQuery)
        .then((result) => { 
            const exists = result.exists;
            if (!exists) {
                const createTableQuery = `CREATE TABLE "Users" (
                    id SERIAL PRIMARY KEY NOT NULL,
                    "Fullname" VARCHAR,
                    "Username" VARCHAR,
                    "Mobile" VARCHAR,
                    "Password" VARCHAR,
                    "Email" VARCHAR,
                    "Role" VARCHAR
                );`;

                return cn.connection.query(createTableQuery)
                    .then(() => {
                        console.log('Users table created successfully.');
                    });
            } else {
                console.log('Users table already exists.');
            }
        })
        .catch((error) => {
            console.error('Error occurred during table check:', error);
        });
}