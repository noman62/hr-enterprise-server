const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json())
const port = 8080


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o5lo4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("hrEnterprise").collection("products");
  const orderCollection=client.db("hrEnterprise").collection("orders");

  app.get('/products', (req, res) => {
    collection.find()
      .toArray((err, items) => {
        res.send(items);


      })
  })
  app.get('/product/:id', (req, res) => {
    collection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, items) => {
        res.send(items[0]);


      })
  })
  app.post('/addProduct', (req, res) => {
    const newEvent = req.body;

    collection.insertOne(newEvent)
      .then(result => {

        res.send(result.insertedCount > 0);
      })
  })

  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;

    orderCollection.insertOne(order)
      .then(result => {

        res.send(result.insertedCount > 0);
      })
  })

  app.get('/', (req, res) => {
    res.send('HR ENTERPRISE !')
  })
  console.log('database connected');

});



app.listen(process.env.PORT || port)