import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.message.includes('whitelisted')) {
            console.error('CRITICAL: Your IP address is not whitelisted in MongoDB Atlas.');
            console.error('Please go to MongoDB Atlas > Network Access > Add IP Address > Add Current IP Address.');
        }
        process.exit(1);
    }
};

export default connectDB;
