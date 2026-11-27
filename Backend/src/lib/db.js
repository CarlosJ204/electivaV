import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected:", conn.connection.host);
        console.log("Database name:", conn.connection.name);
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }
}