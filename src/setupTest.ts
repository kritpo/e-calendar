import 'reflect-metadata';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';
import supertest from 'supertest';

import { app } from './app';

chai.use(chaiAsPromised);
chai.use(dirtyChai);
chai.use(sinonChai);

export const itShould = chai.should();

export const appRequest = supertest(app);
