const mongoose = require('mongoose')

const MONGO_USER = process.env.MONGO_USER 
const MONGO_PASS = process.env.MONGO_PASS

const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@ds253783.mlab.com:53783/persons`

mongoose.connect(url, { useNewUrlParser: true })

var Schema = mongoose.Schema;

let personSchema = new Schema({
    name: String,
    number: String
});

personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
  };

const Person = mongoose.model('Person', personSchema)

module.exports = Person