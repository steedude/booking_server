import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  // 賬號
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // 使用者名稱
  username: {
    type: String,
    required: true,
  },
  team_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const User = model('User', userSchema);

export { User };
