const express = require('express');
const fs = require('fs')
const path = require('path')
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // this line enables connection to the 'public' folder

// Route to main page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Route to 'notes' app
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// // Route to main page
// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "/public/index.html"));
// });

// 'Get' method for API/JSON of notes
app.get('/api/notes', (req, res) => {
  let noteData = require('./db/db.json');
  return res.json(noteData)
});

// 'Post' method for API/JSON of notes
app.post('/api/notes', function (req, res) { 
  const readFile = JSON.parse(fs.readFileSync('./db/db.json'));
  const noteToAdd = req.body;
  noteToAdd.id = moment().toISOString()
  readFile.push(noteToAdd);
  fs.writeFileSync('./db/db.json', JSON.stringify(readFile))
  return res.json(readFile)
})

// 'Delete' method (uses string of Moment to set a unique ID)
// Seems to only work when you've rebooted the server
app.delete('/api/notes/:id', function (req, res) { 
  const readFile = JSON.parse(fs.readFileSync('./db/db.json'));
  const notesToKeep = readFile.filter((noteToThrow) => noteToThrow.id !== req.params.id);
  console.log(notesToKeep)
  fs.writeFileSync('./db/db.json', JSON.stringify(notesToKeep))
  return res.json(notesToKeep)
})

// PORT listener
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});