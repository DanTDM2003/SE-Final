const cn = require('../config/database.js');

module.exports = async () => {
    let checkTableQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Categories')";
    
    await cn.connection.oneOrNone(checkTableQuery)
        .then((result) => { 
            const exists = result.exists;
            if (!exists) {
                const createTableQuery = `CREATE TABLE "Categories" (
                    id SERIAL PRIMARY KEY NOT NULL,
                    "Name" TEXT
                );
                
                INSERT INTO "Categories"("Name")
                VALUES  ('Trà Sữa'),
                        ('Pizza'),
                        ('Gà rán'),
                        ('Kem')
                `;

                return cn.connection.query(createTableQuery)
                    .then(() => {
                        console.log('Categories table created successfully.');
                    });
            } else {
                console.log('Categories table already exists.');
            }
        })
        .catch((error) => {
            console.error('Error occurred during table check: ', error);
        });
}