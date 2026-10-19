import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Enquiry from './models/Enquiry.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
let databaseReady = false;

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_URL?.split(',').map((value) => value.trim()) || true }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'ASK School API', database: databaseReady ? 'connected' : 'demo-memory' });
});

app.post('/api/enquiries', async (request, response, next) => {
  try {
    const { name, email, phone, stage, childName, currentGrade, contactPreference, message } = request.body;
    if (![name, email, phone, stage].every((value) => typeof value === 'string' && value.trim())) {
      return response.status(400).json({ message: 'Please complete every field.' });
    }
    const enquiry = {
      name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), stage: stage.trim(),
      childName: childName?.trim() || undefined,
      currentGrade: currentGrade?.trim() || undefined,
      contactPreference: contactPreference?.trim() || 'Phone',
      message: message?.trim() || undefined,
    };
    if (databaseReady) await Enquiry.create(enquiry);
    else console.info('[demo enquiry]', { ...enquiry, email: '[redacted]' });
    return response.status(201).json({ message: databaseReady ? 'Thank you — your school visit request has been received.' : 'Demo enquiry accepted. Add MONGODB_URI to persist it in MongoDB.' });
  } catch (error) { return next(error); }
});

app.use(express.static(distPath));
app.get('*', (_request, response) => response.sendFile(path.join(distPath, 'index.html')));

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ message: 'Request body must be valid JSON.' });
  }
  console.error(error);
  response.status(500).json({ message: 'Something went wrong. Please try again.' });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      databaseReady = true;
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed; starting in demo-memory mode:', error.message);
    }
  }
  app.listen(port, () => console.log(`ASK School server running on http://localhost:${port}`));
}

start();
