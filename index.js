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
  const collection = client.db("manobotar-deyal").collection("products");
  const orderCollection = client.db("manobotar-deyal").collection("orders");
  const userCollection = client.db("manobotar-deyal").collection("users");
  const RequestCollection = client.db("manobotar-deyal").collection("allRequest");

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
    console.log(req.body)
    const newEvent = req.body;

    collection.insertOne(newEvent)
      .then(result => {

        res.send(result.insertedCount > 0);
      })
  })


  app.post('/request', (req, res) => {
    console.log(req.body)
    const newRequest= req.body;

    RequestCollection.insertOne(newRequest)
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

  app.post('/register', (req, res) => {

    //Received Data From Front-End
    console.log(req.body);
    const { name, email, password } = req.body

    // Name validation
    if (!name) return res.status(400).send('Name is required')

    // Password validation
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send('Password is required and should be min 6 characters long')
    }

    // Email validation
    let userExist = userCollection.findOne({ email })
    if (userExist) {
      return res.status(400).send('Email is taken')
    } else {
      // Save user in database
      userCollection.insertOne({
        name, email, password
      })
        .then(result => {

          res.send(result.insertedCount > 0);
        })
    }

  })

  //User Login
  app.post('/login',async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body
    

    // Email Validation
    const user = await userCollection.findOne({ email });
    console.log(user);
    if (!user){
      return res.status(400).send('No user found')
    }
console.log(user.password);
    // Password Validation
    if(user.password!==password){
      return res.status(400).send("Password didn't match.")
    }else{
      return res.status(200).send("success")
    }
    
  
});

  app.get('/', (req, res) => {
    res.send('Manobotar Deyal!')
  })
  console.log('database connected');

});



app.listen(process.env.PORT || port)