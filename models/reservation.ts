import { Schema, model } from 'mongoose';

const reservationSchema = new Schema(
  {
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    confirmed: {
      type: Boolean,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      index: true,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      index: true,
    },
    team_id: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      index: true,
    },
  },
  { timestamps: true },
);

const Reservation = model('Reservation', reservationSchema);

export { Reservation };
