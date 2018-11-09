const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

const MAX_ID = 100000

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max)) + 100;
}

app.get('/info', (req, res) => {
    const info = `<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`
    console.log(info)
    res.send(info)
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
         })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })    
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Person
    .findByIdAndRemove(id)
    .then(persons => {
        res.status(204).end()
    })
    .catch(error => {
        console.log(error)
        res.status(404).end()
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    //body.id = getRandomInt(MAX_ID)

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    if (body.number === undefined) {
        return res.status(400).json({ error: 'number missing' })
    }

    // if (persons.find(p => p.name === person.name)) {
    //     return res.status(409).json({ error: 'name must be unique' })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
      })
    
      person
        .save()
        .then(savedPerson => {
          response.json(Person.format(savedPerson))
        })
    
    res.json(person)
})

const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)