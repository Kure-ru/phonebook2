const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

// `````````
// show the data sent in HTTP POST requests
// `````
// const morgan = require('morgan');
// app.use(morgan('tiny'));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

let persons = [];

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    response.json(persons);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (body.name === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

//update person 
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true})
  .then(updatedPerson => {
      response.json(updatedPerson)
    })
  .catch(error => next(error))
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
});

//remove a person from the database
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
});

// info page
app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people </p> 
    <p>${date} </p>`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

//handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
console.log(error.message)

if (error.name === 'CastError') {
  return response.status(400).send({ error: 'malformatted id'})
}

next(error)
}

//handler of requests with result to errors
app.use(errorHandler)

// definition of port application
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
