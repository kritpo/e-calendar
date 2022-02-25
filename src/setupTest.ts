import 'reflect-metadata';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';
import supertest from 'supertest';

import { app } from './app';

chai.use(chaiAsPromised);
chai.use(dirtyChai);

/**
 * chai's should command
 */
export const itShould = chai.should();

/**
 * prepared supertest request
 */
export const appRequest = supertest(app);
