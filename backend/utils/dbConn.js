import 'dotenv/config'
import mongoose from 'mongoose'

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            autoIndex: true
        })
    } catch (err) {
        console.log(err)
    }
}

export default connectDB