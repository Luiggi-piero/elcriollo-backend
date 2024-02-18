import { Schema, model } from 'mongoose';

export interface User {
    id: string;
    email: string;
    password: string;
    isAdmin: boolean;
    address: string;
    name: string;
}

export const UserSchema = new Schema<User>(
    // definición del schema
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, required: true },
        isAdmin: { type: Boolean, required: true },
    },
    // opciones adicionales
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const UserModel = model<User>('user', UserSchema);