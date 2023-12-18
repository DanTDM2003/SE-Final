const cn = require('./config/database.js');

module.exports = {
    all: async (tbName) => {
        let con = null;
        try {
            con = await cn.connection.connect();
            const rs = await con.any(`SELECT * FROM "${tbName}"`);
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },

    get: async (tbName, obj) => {
        let con = null;
        try {
            con = await cn.connection.connect();
            const rs = await con.any(`SELECT * FROM "${tbName}" WHERE ("Email" LIKE $1) AND ("Password" LIKE $2)`);
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },

    add: async (tbName, obj) => {
        let con = null;
        try {
            con = await cn.connection.connect();
            let sql = cn.pgp.helpers.insert(obj, null, tbName);
            await con.query(sql);
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    
    update: async (tbName, obj) => {
        let con = null;
        try {
            con = await cn.connection.connect();
            let columns = Object.keys(obj);
            let condition = columns.shift();
            let sql = cn.pgp.helpers.update(obj, columns, tbName) + ` WHERE id = ${ obj.id }`;
            await con.query(sql);
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },

    delete: async (tbName, id) => {
        let con = null;
        try {
            con = await cn.connection.connect();
            await con.query(`DELETE FROM "${tbName}" WHERE id = $1`, [ id ]);
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }
};