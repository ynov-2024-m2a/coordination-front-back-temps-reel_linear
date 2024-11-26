const db = require('./db');

class DataHelper {
    static async query(sqlString) {
        const req = await new Promise((resolve, reject) => {
            db.query(sqlString, function (error, req) {
                if (error) reject(error);
                resolve(req);
            });
        });
        return JSON.parse(JSON.stringify(req))
    }

    static async getPixels() {
        return await DataHelper.query('SELECT * FROM pixels');
    }

    static async getPixel(x, y) {
        const pixel = await DataHelper.query(`SELECT * FROM pixels where y=${y} and x=${x}`);
        if (pixel.length) {
            return pixel[0];
        }
    }
    
    static async setPixel(x, y, color) {
        await DataHelper.query(`update pixels set color='${color}' where y=${y} and x=${x}`);
    }
    
    static async createPixel(x, y, color) {
        await DataHelper.query(`insert into pixels (x, y, color) values (${x}, ${y}, '${color}')`);
        return (await this.getPixel(x, y)).id;
    }
    
    static async getMessages() {
        return await DataHelper.query('SELECT * FROM messages');
    }
}

module.exports = { DataHelper }