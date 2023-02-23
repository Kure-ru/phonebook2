const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5 ) {
  console.log('give password as argument, and name + number to add a new item')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://claire:${password}@cluster0.yanxu69.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema)

//display names in the console
if (process.argv.length === 3) {
    console.log("reading phonebook")

    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
      return;
}

//add a new entry to the phonebook


const name = process.argv[3];
const number = process.argv[4];

const person = new Person({ name, number });

person.save().then(result => {
  console.log(`${person.name} is added!`);
  mongoose.connection.close()
})