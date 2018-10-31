const express = require('express')
const app = express()
// const moment = require('moment') // npm install moment --save

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

app.get('/info', (req, res) => {
    // const info = `<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${moment().format('ddd MMM DD YYYY HH:mm:ssZ')}</p>`
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

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)