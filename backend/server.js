import express from 'express';

const app = express();

const PORT = 3001;

app.get('/api/experiment', (req, res) => {
  const obj = {
    videoId: 302719494,
    question: 'some question',
  };
  res.json(obj);
});

/* eslint no-console: "off" */
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
