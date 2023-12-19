const db = require('../db.js');
const cn = require('../config/database.js');

const tbName = `Subscribed_Restaurants`;
module.exports = class Subscribed {
    static async fetchAll(conditions) {
        let con = null;
        try {
            con = await cn.connection.connect();
            const restaurants = await con.any(`SELECT * FROM "${tbName}" WHERE ("User_id" = $1) AND ("Restaurant_id" = $2)`, conditions);
            return restaurants;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }

    static async fetchAllWithUserID(id) {
        let con = null;
        try {
            con = await cn.connection.connect();
            const restaurants = await con.any(`SELECT * FROM "Users" JOIN "${tbName}" ON "Users".id = "${tbName}"."User_id" JOIN "Restaurants" ON "${tbName}"."Restaurant_id" = "Restaurants".id WHERE ("User_id" = $1)`, [id]);
            return restaurants;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }
    
    static async fetchAllWithRestaurantID(conditions) {
        let con = null;
        try {
            con = await cn.connection.connect();
            const restaurants = await con.any(`SELECT "${tbName}".id AS comment_id, * FROM ("${tbName}" JOIN "Users" ON "${tbName}"."User_id" = "Users".id) WHERE ("Restaurant_id" = $1)`, conditions);
            return restaurants;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }

    static async add(comments) {
        try {
            const rt = await db.add(tbName, comments);
            return rt;
        } catch (error) {
            throw error;
        }
    }

    static async delete(user_id, restaurant_id) {
        try {
            await con.query(`DELETE FROM "${tbName}" WHERE "User_id" = $1 AND "Restaurant_id" = $2`, [ id ]);
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