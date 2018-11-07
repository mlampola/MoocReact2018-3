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

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
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
            res.json(persons.map(formatPerson))
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
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    person.id = getRandomInt(MAX_ID)

    if (person.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    if (person.number === undefined) {
        return res.status(400).json({ error: 'number missing' })
    }

    if (persons.find(p => p.name === person.name)) {
        return res.status(409).json({ error: 'name must be unique' })
    }

    persons = persons.concat(person)
    res.json(person)
})

const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)