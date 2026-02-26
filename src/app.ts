import express from 'express';
import { identify } from './controllers/identifyController.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bitespeed Identity Reconciliation Service is running. Use POST /identify to interact.');
});

app.post('/identify', identify);

export default app;
