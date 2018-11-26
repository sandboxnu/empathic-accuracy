const express = require('express');

const app = express();

const PORT = 3001;

app.get('/api/experiment', function (req, res) {
  let obj = {
    videoId: 302719494,
    question: "some question"
  };
  res.json(obj);
})

app.listen(PORT, function () {
  console.log(`API running at http://localhost:${PORT}`);
})
