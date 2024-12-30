import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
    console.log("Database Connected");
  } catch (error) {
    console.error("db not connected!!", error.message);
    process.exit(1);
  }
  mongoose.connection.on('connected', () => console.log('Database Connected'))
  await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
}

export default connectDB