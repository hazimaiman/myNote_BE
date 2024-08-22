const express = require('express');
const app = express();
const port = 5000;

require('dotenv').config();



app.use(express.json());

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));
  
// Mongoose schema and model for notes
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
  });
  
  const Note = mongoose.model('Note', noteSchema);
  
  // Get all notes
  app.get('/api/notes', (req, res) => {
    Note.find()
      .then(notes => res.json(notes))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Add a new note
  app.post('/api/notes', (req, res) => {
    const note = new Note({
      title: req.body.title,
      content: req.body.content
    });
  
    note.save()
      .then(savedNote => res.status(201).json(savedNote))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Delete a note
  app.delete('/api/notes/:id', (req, res) => {
    Note.findByIdAndDelete(req.params.id)
      .then(() => res.status(204).end())
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });