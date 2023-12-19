const db = require('../db.js');
const cn = require('../config/database.js');


const tbName = `Restaurants`;

module.exports = class Restaurant {
    static async fetchAll(conditions=[ '', '' ]) {
        let con = null;
        try {
            con = await cn.connection.connect();
            const user = await con.any(`SELECT "Users"."Fullname", "Users"."Username", "Users"."Email", "Users"."Mobile" AS "Owner_Mobile", "Restaurants"."Name" AS restaurant_name, "Restaurants".*, "Categories"."Name" FROM ("Users" JOIN "${tbName}" ON "${tbName}"."Owner_id" = "Users".id) JOIN "Categories" ON "Restaurants"."Category_id" = "Categories".id WHERE ("Restaurants"."Name" ILIKE '%' || $1 || '%') AND ("Categories"."Name" ILIKE '%' || $2 || '%')`, conditions);
            return user;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }
    
    static async fetch(restaurant) {
        let con = null;
        try {
            con = await cn.connection.connect();
            const restaurants = await con.oneOrNone(`SELECT "Users"."Fullname", "Users"."Username", "Users"."Email", "Users"."Mobile" AS "Owner_Mobile", "Restaurants"."Name", "Restaurants".*, "Categories"."Name" AS category_name FROM ("Users" JOIN "${tbName}" ON "Users".id = "${tbName}"."Owner_id") JOIN "Categories" ON "Restaurants"."Category_id" = "Categories".id WHERE "Owner_id" = $1`, [restaurant.Owner_id]);
            return restaurants;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }

    static async add(restaurant) {
        try {
            const rt = await db.add(tbName, restaurant);
            return rt;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            await db.delete(tbName, id);
        } catch (error) {
            throw error;
        }
    }
    
    static async update(newInfo) {
        try {
            await db.update(tbName, newInfo);
        } catch (error) {
            throw error;
        }
    }
}
