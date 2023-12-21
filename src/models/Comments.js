const db = require('../db.js');
const cn = require('../config/database.js');

const tbName = `Comments`;
module.exports = class Comments {
    static async fetchAllWithUserID(conditions) {
        let con = null;
        try {
            con = await cn.connection.connect();
            const restaurants = await con.any(`SELECT "${tbName}".id AS comment_id, * FROM ("${tbName}" JOIN "Users" ON "${tbName}"."User_id" = "Users".id) JOIN "Restaurants" ON "${tbName}"."Restaurant_id" = "Restaurants".id WHERE ("User_id" = $1)`, conditions);
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
    
    static async fetch(id) {
        let con = null;
        try {
            con = await cn.connection.connect();
            const restaurant = await con.oneOrNone(`SELECT "${tbName}".id AS comment_id, * FROM ("${tbName}" JOIN "Users" ON "${tbName}"."User_id" = "Users".id)`, [id]);
            return restaurant;
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