const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
require('dotenv').config();
const app = express()
const port =process.env.PORT ||5000


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t04cp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log("error",err);
  const productCollection = client.db("jersey").collection("products");
  const orderCollection = client.db("jersey").collection("orders");
  // console.log("database connected successfully");

  app.post('/addCart', (req, res) =>{
    const newCart = req.body;
    orderCollection.insertOne(newCart)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
    console.log(newCart);
  })

  app.get('/cart', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray( (err,items) => {
      res.send(items);
    })
  })

  app.get('/jersey/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.find({_id: id})
    .toArray( (err,items) => {
      res.send(items);
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray( (err,items) => {
      res.send(items);
    })
  })
  
  

  app.post('/addProduct', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event',newEvent);
    productCollection.insertOne(newEvent)
    .then(result =>{
      console.log('inserted',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  

  // client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})