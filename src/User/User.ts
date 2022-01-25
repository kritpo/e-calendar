import { Schema, model } from 'mongoose';

export interface IUser {
	username: string;
	password: string;
}
const userSchema = new Schema<IUser>({
	username: { type: String, required: true },
	password: { type: String, required: true }
});

export const User = model('User', userSchema);

export type PublicUserType = { id: string } & Omit<IUser, 'password'>;
