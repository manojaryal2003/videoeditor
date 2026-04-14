require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (exists) {
    console.log('Admin already exists:', exists.email);
    process.exit(0);
  }
  const admin = await Admin.create({
    username: 'admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  console.log('Admin created:', admin.email);
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
