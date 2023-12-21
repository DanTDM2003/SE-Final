const cn = require('../config/database.js');

module.exports = async () => {
    let checkTableQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Comments')";
    
    await cn.connection.oneOrNone(checkTableQuery)
        .then((result) => { 
            const exists = result.exists;
            if (!exists) {
                const createTableQuery = `CREATE TABLE "Comments" (
                    id SERIAL PRIMARY KEY NOT NULL,
                    "Restaurant_id" INT,
                    "User_id" INT,
                    "Rating" FLOAT,
                    "Review" TEXT,

                    FOREIGN KEY ("User_id") REFERENCES "Users"(id) ON DELETE CASCADE,
                    FOREIGN KEY ("Restaurant_id") REFERENCES "Restaurants"(id) ON DELETE CASCADE
                );
                `;

                return cn.connection.query(createTableQuery)
                    .then(() => {
                        console.log('Comments table created successfully.');
                    });
            } else {
                console.log('Comments table already exists.');
            }
        })
        .catch((error) => {
            console.error('Error occurred during table check: ', error);
        });
}