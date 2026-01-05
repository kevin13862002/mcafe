const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  res.json({ data: [], test: 'hello' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('listening', () => {
  console.log('Server is listening!');
});

