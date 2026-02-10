// Simple Express server for SkillSync India
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files from the sibling `frontend` folder
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Mount API routes
app.use('/api', routes);

// Serve frontend index at root
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SkillSync India backend listening on port ${PORT}`);
});
