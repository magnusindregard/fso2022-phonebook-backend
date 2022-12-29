const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')

// morgan.token("body", function(request, response){ return JSON.stringify(request.body) })

const app = express()

app.use(express.json())
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

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

const generateRandomId = () => {
    const randomId = Math.round(Math.random() * 1000000)
    return randomId
}

const isInList = (element) => element.name === newName;

app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1>')
})

app.get('/info', (request, response) => {
    const noOfPeople = persons.length
    const now = new Date()
    response.send(`<p>Phonebook has info about ${noOfPeople} people</p><p>${now}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => {
        return person.id === id
    })
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Entry is not complete' 
    })
  }

  const isInList = (element) => element.name === body.name;
  if (persons.some(isInList)) {
    return response.status(409).json({ 
        error: 'Person already exists in database' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateRandomId(),
  }

  persons = persons.concat(person)

  response.json(person)
})
  
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})