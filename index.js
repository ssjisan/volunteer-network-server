const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())

/****************Connect to Cluster*************************/ 
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.larxv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteerNetwork").collection("eventrego");
  /*******************************Post Data to server**********************************/ 
  app.post('/submitted',(req,res)=>{
      const event= req.body;
      console.log(event);
      collection.insertOne(event)
      .then(result=>{
            res.send(result.insertedCount > 0)
      })
  })
  /*******************************Get Data to server**********************************/ 
  app.get('/registeredEvent',(req,res)=>{
    const email = req.query.email;
    console.log(email);
    collection.find({email:email})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })
});

app.listen(process.env.PORT || port)

