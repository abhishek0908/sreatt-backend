import mongoose from 'mongoose';


const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    const secret = process.env.SECRET_KEY;
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit if DB connection fails
  }
};

export default connectDB;
