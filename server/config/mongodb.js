//in these we are connecting the mongooes with server.js
import mongoose from "mongoose";
const connectDB=async ()=>{

    mongoose.connection.on('connected',()=> console.log("connected to db"))
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
}
export default connectDB;