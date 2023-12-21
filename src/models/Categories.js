const db = require('../db.js');
const cn = require('../config/database.js');


const tbName = `Categories`;

module.exports = class Restaurant {
    static async fetchAll(attributes='*') {
        let con = null;
        try {
            con = await cn.connection.connect();
            const user = await con.any(`SELECT $1:name FROM "${tbName}"`, [attributes]);
            return user;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }
    
    static async fetchWithName(name, attributes='*') {
        let con = null;
        try {
            con = await cn.connection.connect();
            const users = await con.oneOrNone(`SELECT $1:name FROM "${tbName}" WHERE "Name" LIKE $2`, [attributes, name]);
            return users;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }
    
    static async fetch(id, attributes='*') {
        let con = null;
        try {
            con = await cn.connection.connect();
            const users = await con.oneOrNone(`SELECT $1:name FROM "${tbName}" WHERE id = $2`, [attributes, id]);
            return users;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }

    static async add(category) {
        try {
            const rt = await db.add(tbName, category);
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
