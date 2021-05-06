const express = require('express');
const noteData = require('./db/db.json');
const fs = require('fs')
const path = require('path')
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // this line enables connection to the 'public' folder

// Unable to connect
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Unable to connect
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});


app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', function (req, res) { 
  const readFile = JSON.parse(fs.readFileSync('./db/db.json'));
  const noteToAdd = req.body;
  noteToAdd.id = moment().toISOString()
  readFile.push(noteToAdd);
  fs.writeFileSync('./db/db.json', JSON.stringify(readFile))
  res.json(readFile)
})

// Causing problems due to not recognizing the id (is currently set as a string of Moment)
app.delete('/api/notes/:id', function (req, res) { 
  const readFile = JSON.parse(fs.readFileSync('./db/db.json'));
  const notesToKeep = readFile.filter((noteToThrow) => noteToThrow.id !== req.params.id);
  fs.writeFileSync('./db/db.json', JSON.stringify(notesToKeep))
  res.json(notesToKeep)
})

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});