import React, { useState } from 'react';

function App() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/best-bets');
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setBets(data);
    } catch (err) {
      console.error('Failed to fetch best bets', err);
      setError('Unable to load best bets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Tennis Betting AI</h1>
      <button onClick={fetchBets} disabled={loading}>
        {loading ? 'Loading...' : 'Show Best Bets'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {bets.map((bet, idx) => (
          <li key={idx} style={{ marginTop: '1rem' }}>
            <h3>{bet.players.player1} vs {bet.players.player2}</h3>
            <p>{bet.summary}</p>
            {bet.prediction && (
              <>
                <p>Win Probabilities: {bet.prediction.win_prob_player1}% / {bet.prediction.win_prob_player2}%</p>
                <p>Value Bet: {bet.prediction.value_bet} ({bet.prediction.confidence_level})</p>
              </>
            )}
            <p>{bet.explanation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
