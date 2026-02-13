import mongoose from 'mongoose';

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}
const MONGO_URI = process.env.MONGO_URI;

let dbConnectionStatus = false;

mongoose.connection.on('open', () => {
  dbConnectionStatus = true;
  console.log('Mongo connection ready');
});

mongoose.connection.on('error', (err:unknown) => {
  dbConnectionStatus = false;
  console.log("MongoDB connection error: ", err);
});

export const mongoConnect = async(): Promise<void> => {
  try {
    console.log(`Connecting to ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
  } catch (err:unknown) {
    console.log('Failed to connect to MongoDB');
    console.log(err);
    process.exit(1);

  }

}
export const isDbConnected = (): boolean => {
  return dbConnectionStatus;
};



