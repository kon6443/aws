// Connecting MySQL

const mysql = require('mysql2/promise');
const util = require('util');

class MySQLRepository {
    constructor(container) {
        console.log('MySQL has been connected...');
        const config = container.get('config');
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: config.MYSQL.USER,
            password: config.MYSQL.PASSWORD,
            database: 'board_db'
        });
        // this.query = util.promisify(this.pool.query).bind(this.pool); 
    }

    async executeQuery(sql) {
        let connection = null;
        let res = null;
        try {
            connection = await this.pool.getConnection();
            res = await connection.query(sql);
            return res;
        } catch(err) {
            console.log('err:', err);
            throw new Error(err);
        } finally {
            if(connection) {
                connection.release();
            }
        }
    }
}

module.exports = MySQLRepository;

// const conn = mysql.createConnection({
//     host: "localhost",
//     user: config.MYSQL.USER,
//     password: config.MYSQL.PASSWORD,
//     database: 'board_db'
// });

// module.exports = conn;
