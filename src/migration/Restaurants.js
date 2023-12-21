const cn = require('../config/database.js');

module.exports = async () => {
    let checkTableQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Restaurants')";
    
    await cn.connection.oneOrNone(checkTableQuery)
        .then((result) => { 
            const exists = result.exists;
            if (!exists) {
                const createTableQuery = `CREATE TABLE "Restaurants" (
                    id SERIAL PRIMARY KEY NOT NULL,
                    "Owner_id" INT,
                    "Name" TEXT,
                    "Category_id" INT,
                    "Tel" TEXT,
                    "Address" TEXT,
                    "Description" TEXT,
                    "Thumbnail" TEXT,
                    "Menu" TEXT,

                    FOREIGN KEY ("Owner_id") REFERENCES "Users"(id) ON DELETE CASCADE,
                    FOREIGN KEY ("Category_id") REFERENCES "Categories"(id) ON DELETE SET NULL
                );
                
                INSERT INTO "Restaurants"("Owner_id","Name","Category_id","Tel","Address","Thumbnail","Menu")
                VALUES  (3,'Hanuri',1,'0901306830','Nguyễn Tri Phương',null,null)
                `;

                return cn.connection.query(createTableQuery)
                    .then(() => {
                        console.log('Restaurants table created successfully.');
                    });
            } else {
                console.log('Restaurants table already exists.');
            }
        })
        .catch((error) => {
            console.error('Error occurred during table check: ', error);
        });
}