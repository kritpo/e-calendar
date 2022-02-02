import { Schema, model } from 'mongoose';

interface IBaseUser {
	username: string;
}

export interface IUser extends IBaseUser {
	password: string;
}
const userSchema = new Schema<IUser>({
	username: { type: String, required: true },
	password: { type: String, required: true }
});

export const User = model('User', userSchema);

export interface IPublicUser extends IBaseUser {
	id: string;
}
