# Tennis Betting AI Web App

## Setup

1. Copy `backend/.env.example` to `backend/.env` and fill in your API keys for:
   - `OPENAI_API_KEY`
   - `RAPIDAPI_KEY`
   - `THEODDS_API_KEY`

2. Install backend dependencies:
   ```bash
   npm install express cors dotenv openai axios
   ```

3. Start the backend server:
   ```bash
   node backend/app.js
   ```

4. Install frontend dependencies and start the React app:
   ```bash
   cd frontend
   npm install
   npm start
   ```

Alternatively, from the repository root you can start both servers at once:
```bash
pnpm run start-tennis-app
```

The frontend runs on port 3000 and the backend on port 5000.
