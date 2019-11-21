import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

class Database {
    constructor () {
        this.database = null;
        this._connect()
    }

    async _connect () {
        try {
            this.database = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            })
            console.info('Connection to DB was successful')
        } catch (error) {
            console.error('Connection to DB failed 💣', error)
        }
    }

    getDatabase () {
        return this.database;
    }
}

export default new Database()