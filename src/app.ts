import express from 'express';
import { identify } from './controllers/identifyController.js';

const app = express();

app.use(express.json());

app.post('/identify', identify);

export default app;
