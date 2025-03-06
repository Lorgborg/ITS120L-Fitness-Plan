const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors  = require("cors");
const corsOptions = {
    origin: "http://localhost:5173"
}
require('dotenv').config(); // Load environment variables from .env

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.uri;

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

app.get("/api", ( req, res) => {
    console.log("I enter this lmao")
    res.json({account: "do this skibidi"});
})

app.post("/api/signup", async (req, res) => {
    console.log(req.body)
    let connection = await connectToMongoDB();
    const collection = connection.db('MyFit').collection("users");
    await collection.insertOne({username: req.body.username, password: req.body.password});
    res.send("http://localhost:5173/home")
})

app.get("/api/login")

app.listen(8080, () => {
    console.log("started on 8080");
})

module.exports = app;