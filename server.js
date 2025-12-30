const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'src', 'students.json');

app.post('/students', (req, res) => {
  const student = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read students.json' });
    let arr = [];
    try {
      arr = JSON.parse(data);
    } catch (e) {
      arr = [];
    }
    const maxId = arr.reduce((max, item) => Math.max(max, item.id || 0), 0);
    const newId = maxId + 1;
    const studentWithId = { id: newId, ...student };
    arr.push(studentWithId);
    fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).json({ error: 'Failed to write students.json' });
      res.json(studentWithId);
    });
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API server running on http://localhost:${port}`));
