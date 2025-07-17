const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const CSV_PATH = './SeatData.csv';

// อัปเดตสถานะที่นั่ง
app.post('/api/update-seat', (req, res) => {
  const { row, col } = req.body;
  fs.readFile(CSV_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Read error');
    const lines = data.trim().split('\n');
    const updated = lines.map(line => {
      const [r, c, available] = line.split(',');
      if (r === row && c === col) return `${r},${c},False`;
      return line;
    });
    fs.writeFile(CSV_PATH, updated.join('\n'), err => {
      if (err) return res.status(500).send('Write error');
      res.send({ success: true });
    });
  });
});

app.get('/api/seats', (req, res) => {
  fs.readFile(CSV_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Read error');
    res.type('text/plain').send(data);
  });
});

app.listen(4000, () => console.log('Server running on port 4000'));