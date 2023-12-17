const cn = require('../config/database.js');

module.exports = async () => {
    let checkTableQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Users')";
    
    await cn.connection.oneOrNone(checkTableQuery)
        .then((result) => { 
            const exists = result.exists;
            if (!exists) {
                const createTableQuery = `CREATE TABLE "Users" (
                    id SERIAL PRIMARY KEY NOT NULL,
                    "Fullname" TEXT,
                    "Username" TEXT,
                    "Mobile" TEXT,
                    "Password" TEXT,
                    "Email" TEXT,
                    "Role" TEXT
                );
                
                INSERT INTO "Users"("Fullname","Username","Password","Email","Role")
                VALUES  ('Hưng','DanTDM2003','$2b$10$NGuiSA8WTiiHsP6hHx/aKO4c2Gjks2Rs/eufkXtYC.gpNwFvjZEhS','hung@gmail.com','Admin'),
                        ('Hưng','Hưng đẹp trai','$2b$10$NGuiSA8WTiiHsP6hHx/aKO4c2Gjks2Rs/eufkXtYC.gpNwFvjZEhS','hung1@gmail.com','Restaurant')
                `;

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