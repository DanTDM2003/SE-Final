const cn = require('../config/database.js');

module.exports = async () => {
    let checkTableQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Subscribed_Restaurants')";
    
    await cn.connection.oneOrNone(checkTableQuery)
        .then((result) => { 
            const exists = result.exists;
            if (!exists) {
                const createTableQuery = `CREATE TABLE "Subscribed_Restaurants" (
                    "Restaurant_id" INT NOT NULL,
                    "User_id" INT NOT NULL,

                    PRIMARY KEY ("Restaurant_id", "User_id"),
                    FOREIGN KEY ("User_id") REFERENCES "Users"(id) ON DELETE CASCADE,
                    FOREIGN KEY ("Restaurant_id") REFERENCES "Restaurants"(id) ON DELETE CASCADE
                );
                `;

                return cn.connection.query(createTableQuery)
                    .then(() => {
                        console.log('Subscribed_Restaurants table created successfully.');
                    });
            } else {
                console.log('Subscribed_Restaurants table already exists.');
            }
        })
        .catch((error) => {
            console.error('Error occurred during table check: ', error);
        });
}