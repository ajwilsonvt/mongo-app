const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();

let db;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) return console.log(err);
  db = client.db('mongo-app');
  return db;
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  db.collection('quotes').find().sort({ name: 1 }).toArray((err, result) => {
    if (err) return console.log(err);
    return res.render('index.ejs', { quotes: result });
  });
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database', result.ops);
    return res.redirect('/');
  });
});

app.listen(4000, () => {
  console.log('listening on 4000');
});
