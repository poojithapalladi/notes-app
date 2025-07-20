import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://poojithapalladi:WlRYp64K7HagqRkj@cluster0.ax6gzlk.mongodb.net/notes_app?retryWrites=true&w=majority';

export default async function connectToMongoDB() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Atlas Connected');
  } catch (err) {
    console.error('MongoDB connect error:', err.message);
    throw err;
  }
}
