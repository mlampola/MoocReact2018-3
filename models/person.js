const mongoose = require('mongoose')

const MONGO_USER = process.env.MONGO_USER 
const MONGO_PASS = process.env.MONGO_PASS

const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@ds253783.mlab.com:53783/persons`

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person