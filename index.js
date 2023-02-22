const express = require('express')
const app = express()
const cors = require('cors')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

  // `````````  
// show the data sent in HTTP POST requests
// `````
// const morgan = require('morgan');
// app.use(morgan('tiny'));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  
  app.get('/api', (request, response) => {
    response.json(persons)
  })
  
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
const person = {
        name: body.name,
        number: body.number,
        id: generateId,
      }
    
      persons = persons.concat(person)
    
      response.json(person)
    })
    
    app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const person = persons.find(person => person.id === id)
      
        if (person) {
          response.json(person)
        } 
        else 
        {
          response.status(404).end()
        }
      
        response.json(person)
      })
      
      app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
      })
      
  
// info page
app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`
    <p>Phonebook has info for ${persons.length} people </p> 
    <p>${date} </p>`)
  })
  
// definition of port application
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})