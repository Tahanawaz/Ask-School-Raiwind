# ASK School & Academy — MERN demo

Premium responsive school website built with React, Express, Node.js and MongoDB.

## Local setup

1. Copy `.env.example` to `.env` and add a MongoDB Atlas connection string.
2. Run `npm install`.
3. In terminal one, run `npm run dev:server`.
4. In terminal two, run `npm run dev`.
5. Open `http://localhost:5173`.

The Vite dev server proxies `/api` to Express on port 5000. Without `MONGODB_URI`, the API remains usable in demo-memory mode and does not persist enquiries.

## Production

Run `npm run build`, then `npm start`. Express serves the generated React app from `dist/` and exposes:

- `GET /api/health`
- `POST /api/enquiries`

For split hosting, set `VITE_API_URL` to the public Express API origin before building and set `CLIENT_URL` on the API to the frontend origin.
