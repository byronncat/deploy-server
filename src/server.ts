import 'dotenv/config';
import './data/database/MongoDB.database';
import express from 'express';
import configureApi from './api';
import configureServer from './configuration';

const serverConfiguration = express();
configureServer(serverConfiguration);
configureApi(serverConfiguration);

export default serverConfiguration;
