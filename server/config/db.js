import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CLOUD)
        // console.log(`Connected to MongoDb Database ${conn.connection.host}`.bgGreen.black)
        // console.log(`Connected to MongoDb Database ${conn.connection.host}`.bgGreen.black)
    } catch (error) {
        // console.log(`Error in Mongodb ${error}`.bgRed.white)
    }
}

export default connectDB;
