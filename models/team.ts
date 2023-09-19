import { Schema, model } from 'mongoose';

const teamSchema = new Schema({});

const Team = model('Team', teamSchema);

export { Team };
