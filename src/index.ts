import 'reflect-metadata';

import dotenv from 'dotenv';

import { app } from './app';

dotenv.config();

/**
 * listening port
 */
const PORT = 8080;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
