import mongoose from "mongoose"

const coonectDB = async ()=>{
    mongoose.connection.on('connected',()=>console.log("Database Connected"))
    await mongoose.connect(process.env.MONGODB_URI)
}

export default coonectDB;