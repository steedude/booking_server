import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  // 賬號
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // 使用者名稱
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = model('Admin', adminSchema);

export { Admin };
