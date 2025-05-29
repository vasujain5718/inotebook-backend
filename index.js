const connectToMongo= require('./db');
const cors= require('cors');
const express = require('express')
connectToMongo(); 
const app = express()
const port = 5000
app.use(cors()) // Enable CORS for all routes
app.use(express.json()) 
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))
app.post('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})