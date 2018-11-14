const mongoose = require('mongoose')

const MONGO_USER = process.env.MONGO_USER 
const MONGO_PASS = process.env.MONGO_PASS

const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@ds253783.mlab.com:53783/persons`

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 2) {
  Person
    .find({})
    .then(persons => {
      console.log('puhelinluettelo:')
      persons.forEach(p => console.log(`${p.name} ${p.number}`))
      mongoose.connection.close()
    })
} else if (process.argv.length === 4) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
  person
    .save()
    .then(response => {
      mongoose.connection.close()
    })
}

