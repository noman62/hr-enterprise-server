const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json())
const port = 8080


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o5lo4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("hrEnterprise").collection("products");

  app.get('/products',(req,res)=>{
    collection.find()
    .toArray((err,items)=>{
      res.send(items);
      console.log('from database',items);
    
    })
  })
  app.post('/addProduct',(req,res)=>{
    const newEvent = req.body;
    console.log('event', newEvent);
    collection.insertOne(newEvent)
      .then(result => {
        console.log('inserted', result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })
  console.log('database connected');

});

app.get('/', (req, res) => {
  res.send('HR ENTERPRISE !')
})

app.listen(port)