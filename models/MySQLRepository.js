/**
 * MySQLRepository
 */

const mysql = require('mysql2/promise');

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

    async executeQuery(sql, values) {
        let connection = null;
        let res = null;
        try {
            connection = await this.pool.getConnection();
            res = await connection.query(sql, values);
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
