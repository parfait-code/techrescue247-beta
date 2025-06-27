import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Remplacez par votre URI MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/techrescue247';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin Techrescue247',
      email: 'admin@techrescue247.com',
      phone: '+237678830036',
      password: hashedPassword,
      role: 'admin',
    });
    
    console.log('Admin créé avec succès:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

createAdmin();