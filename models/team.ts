import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Team = model('Team', teamSchema);

export { Team };
