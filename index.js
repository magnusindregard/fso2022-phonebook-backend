require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

morgan.token("body", function(request, response){ return JSON.stringify(request.body) })

const app = express()

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1>')
})

app.get('/info', (request, response) => {
    const now = new Date()
    Person.countDocuments()
        .then(noOfPeople => {
            response.send(`<p>Phonebook has info about ${noOfPeople} people</p><p>${now}</p>`)
        })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>
        response.json(persons)    
    )
})

app.get('/api/persons/:id', (request, response, next) => {
    
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
              } else {
                response.status(404).end()
              }
        })
        .catch(error => next(error))
    
  })

app.delete('/api/persons/:id', (request, response, next) => {
    
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    })

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Entry is not complete' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })


    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const number = body.number

    Person.findByIdAndUpdate(request.params.id, { number: number }, {new: true, runValidators: true, context: 'query'})
        .then (result => {
            console.log(result)
            console.log(`Updated number for ${body.name}`)
            response.json(result)
        })
        .catch (error => next(error))
})

app.use(errorHandler)
  
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})