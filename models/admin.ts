import { Schema, model } from 'mongoose';

const adminSchema = new Schema({});

const Admin = model('Admin', adminSchema);

export { Admin };
