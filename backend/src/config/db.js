import mongoose from 'mongoose';

export const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();
  if (!mongoUri) {
    throw new Error('MONGO_URI is required in backend/.env');
  }

  const isPlaceholderUri =
    mongoUri.includes('<username>') ||
    mongoUri.includes('<password>') ||
    mongoUri.includes('cluster.mongodb.net/team-task-manager');

  if (isPlaceholderUri) {
    throw new Error(
      'MONGO_URI is still using the placeholder Atlas connection string. Replace it in backend/.env with your real MongoDB URI.'
    );
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};
