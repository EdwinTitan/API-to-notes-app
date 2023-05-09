// Memo content type -> tipos de Content-type para distintos tipos de respuestas desde los endpoints en el servidor
// MiddleWare -> función que intercepta la petición que
// Está pasando por tu API
const logger = require('./loggerMiddleware')
const cors = require('cors')

const express = require('express')
const app = express()
app.use(cors())
app.use(express.json())

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Me tengo que suscribir a @EdwinTitan',
    date: '2023-05-06T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Me tengo que desuscribir a @EdwinTitan',
    date: '2023-07-06T17:30:31.098Z',
    important: false
  },
  {
    id: 3,
    content: 'Repasar los retos diarios de JS',
    date: '2023-05-30T17:30:31.098Z',
    important: true
  }
]

const users = [
  {
    id: 1,
    username: 'edwinhubble233@gmail.com',
    password: '123123'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  !note
    ? response.status(404).end()
    : response.status(200).json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }
  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  notes = [...notes, newNote]
  return response.status(201).json(newNote).end()
})

app.post('/api/login', (request, response) => {
  const credentials = request.body
  if (!credentials || credentials.username) {
    return response.status(400).json({
      error: 'user credentials are wrong'
    })
  }
  const findedUser = users.find(user => user.username === credentials.username && user.password === credentials.password)
  const data = { data: findedUser }
  return response.status(200).json(data)
})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const updatedNote = request.body

  notes = notes.map(note => {
    if (note.id === id) {
      note = updatedNote
    }
    return note
  })
  return response.status(200).json(updatedNote).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
