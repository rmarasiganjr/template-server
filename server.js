const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const data = require('./routes/api/v1/dataHandling.js');

const app = express();
app.use(express.json({ extended: false }));
app.use(cors());

// Routes
app.get('/', (req, res) => res.send('API Running')); //test endpoint
app.use('/api/data', data);

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
