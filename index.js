const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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
    res.json(persons)
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
    console.log(person)

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

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)