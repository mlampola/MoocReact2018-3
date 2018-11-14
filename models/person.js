const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
  }
  
const MONGO_USER = process.env.MONGO_USER 
const MONGO_PASS = process.env.MONGO_PASS

// Production: MONGO_DB = ds253783.mlab.com:53783/persons
// Development: MONGO_DB = ds111370.mlab.com:11370/markus-db
const MONGO_DB = process.env.MONGO_DB 

const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_DB}`

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