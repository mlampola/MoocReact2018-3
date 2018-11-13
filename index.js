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

app.get('/info', (req, res) => {
    Person.countDocuments({})
        .then(count => {
            const info = `<p>puhelinluettelossa on ${count} henkilön tiedot</p><p>${new Date()}</p>`
            console.log(info)
            res.send(info)
        })
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
    const id = req.params.id
    Person.findById(id)
        .then(savedPerson => {
            res.json(Person.format(savedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Person
        .findByIdAndRemove(id)
        .then(person => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const body = req.body

    Person.findByIdAndUpdate(id, body, { new: true })
        .then(savedPerson => {
            res.json(Person.format(savedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).end()
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

    Person
        .find({ name: body.name })
        .then(result => {
            if (result.length == 0) { // Does not exist
                person
                    .save()
                    .then(savedPerson => {
                        res.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).end()
                    })

            } else {
                res.status(409).end() // Already exists
                }
        })
        .catch(error => {
            console.log(error)
            res.status(409).end()
        })
})

const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)