1. **Backend Setup**
   - Initialize Node.js backend in `/backend` with Express and CORS.
   - Implement `openaiService.js` to configure the OpenAI client with `OPENAI_API_KEY` from `.env`.
   - Create `apiFootballService.js` in `/backend/services` to fetch player statistics from API-Football's Tennis API via RapidAPI. Expose a `getMatchStats(player1, player2)` function that returns recent form, surface win rate, and head-to-head data.
   - Create `theOddsService.js` in `/backend/services` to pull betting odds from TheOddsAPI (prioritizing Hard Rock when available). Provide a `getMatchOdds(player1, player2)` function that returns sportsbook odds and implied probabilities.
   - Create three agent modules in `/backend/agents`:
     - `matchAnalyst.js` to summarize matchup data using OpenAI.
     - `predictionAgent.js` to calculate win probabilities and value bet recommendation.
     - `explainerAgent.js` to generate a short explanation of the betting advice.

2. **API Route**
   - In `/backend/routes/predict.js` set up a POST handler to receive player names, match context, and odds.
   - Use `apiFootballService.js` to fetch player stats automatically when the client only supplies names. Merge these stats with any manually provided data.
   - Retrieve betting odds with `theOddsService.js` and calculate implied probabilities to compare against the LLM prediction.
   - Sequentially call the three agents with the formatted stats and odds, then return `summary`, `prediction`, and `explanation` as JSON.
   - Add a new `/best-bets` route that retrieves upcoming matches from the stats API, runs predictions for each, and returns the bets with the highest expected value.
   - Wire the routes in `app.js` and start the server on port 5000.

3. **Frontend Setup**
   - Create a React app inside `/frontend` using `create-react-app`.
   - Build a simple page with a **Show Best Bets** button instead of manual player selection.
   - When clicked, call a new `/best-bets` endpoint that returns the top value bets for the next day.
   - Display each bet's summary, win probabilities, recommended wager, and explanation.

4. **Environment & Running**
   - Add `.env` containing keys for `OPENAI_API_KEY`, `RAPIDAPI_KEY` (for API-Football), and `THEODDS_API_KEY`.
   - Install backend dependencies: `npm install express cors dotenv openai`.
   - Run the backend with `node app.js` and the frontend with `npm start` inside `/frontend`.

5. **MVP Goals**
   - Focus on on-demand predictions with no database. API calls to API-Football and TheOddsAPI occur only at runtime, keeping the app stateless.
   - Ensure error handling for failed API calls and invalid form input.
   - Later enhancements could include persistent storage or authentication if desired.
