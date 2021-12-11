import 'reflect-metadata';

import dotenv from 'dotenv';

import { app } from './app';
import { getEnv } from './utils/getEnv';

dotenv.config({ path: `/.env.${process.env.NODE_ENV?.toLowerCase() ?? ''}` });
dotenv.config();

const PORT = parseInt(getEnv('PORT', '8080'));
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
