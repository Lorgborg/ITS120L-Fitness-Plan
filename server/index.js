const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config(); // Load environment variables from .env
const app = express();
const cors  = require("cors");
const OpenAI = require("openai");

const corsOptions = {
    origin: "*"
}
const jwtDecode = require("jwt-decode");


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.uri;
const origin = process.env.origin;

const openai = new OpenAI({
  apiKey: process.env.openAiKey,
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
    try {
      // Connect to the MongoDB server
      await client.connect();
      console.log('Connected to MongoDB');
  
      // Return the connected client~
      return client;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error; // Re-throw the error to handle it outside the function
    }
  }


app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

app.get("/api", ( req, res) => {
    console.log("I enter this lmao")
    res.json({account: "do this skibidi"});
})

app.post("/api/signup", async (req, res) => {
  console.log(req.body)
  let connection = await connectToMongoDB();
  const collection = connection.db('MyFit').collection("users");
  await collection.insertOne({
    email: req.body.email,
    username: req.body.username,
    weight: req.body.weight,
    nationality: req.body.nationality,
    idealWeight: req.body.idealWeight
  });
})

app.post("/api/login", async (req, res) => { 
  const decoded = jwtDecode.jwtDecode(req.body.raw);
  let connection = await connectToMongoDB();
  console.log("received mail: " + decoded.email)
  const collection = connection.db('MyFit').collection('users');
  const exists = await collection.findOne({ email: decoded.email })
  if(exists) {
    res.status(201).json(({
      status: decoded,
      message: "../dashboard",
      id: 1,
    }))
  } else if (!exists) {
    console.log("sending back signunp: " + decoded)
    res.status(201).json(({
      status: decoded,
      message: "../signup",
      id: 1,
    }))
  }
})

app.post("/api/getResponse", async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {"role": "user", "content": req.body.prompt},
    ],
  });
  // const completion = { choices: [{message: {content: "testing"}}]}
  console.log(completion)
  res.status(201).json(completion.choices[0].message)
})

app.listen(8080, () => {
    console.log("started on 8080");
})

module.exports = app;