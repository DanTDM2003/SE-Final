const db = require('../db.js');
const cn = require('../config/database.js');


const tbName = 'Users';

module.exports = class User {
    constructor(user) {
        this.Fullname = user.Fullname;
        this.Username = user.Username;
        this.Password = user.Password;
        this.Email = user.Email;
    }

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
    
    static async fetch(user, attributes='*') {
        let con = null;
        try {
            con = await cn.connection.connect();
            const users = await con.oneOrNone(`SELECT $1:name FROM "${tbName}" WHERE "Email" = $2`, [attributes, user.Email]);
            return users;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }

    static async add(user) {
        try {
            const rt = await db.add(tbName, user);
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
