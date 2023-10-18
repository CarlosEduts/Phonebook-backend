const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token("req-body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - :req-body"));
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.use(express.json());

app.get("/info", (request, response) => {
  const date = new Date();
  const infoText = `
  <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`;
  response.send(infoText);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const idGenerator = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const equalName = persons.find((person) => person.name === body.name);

  if (!body.name && !body.number) {
    return response.status(404).json({
      error: "content missing",
    });
  } else if (equalName) {
    return response.status(404).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: idGenerator(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
