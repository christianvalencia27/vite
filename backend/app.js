const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const predictRoute = require('./routes/predict');
const bestBetsRoute = require('./routes/bestBets');

app.use('/predict', predictRoute);
app.use('/best-bets', bestBetsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
