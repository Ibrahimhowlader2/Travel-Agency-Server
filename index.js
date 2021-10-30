const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express()
const port = process.env.PORT || 5000;

require("dotenv").config();


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS_USER}@cluster0.fjj4l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('travelAgency');
        const destinationsCollection = database.collection('destination');



        // GET All Destinations
        app.get('/destinations', async (req, res) => {
            const cursor = destinationsCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        });

        // GET SINGLE SERVICE
        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const destinations = await destinationsCollection.findOne(query);
            res.json(destinations);
        })

        // POST Destination
        app.post('/destinations', async (req, res) => {
            const destination = req.body;
            // console.log('hit from api', destination);
            const result = await destinationsCollection.insertOne(destination)

            res.json(result);
        });
        
        // Delete From Manage All
        app.delete('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await destinationsCollection.deleteOne(query);
            res.json(result);
        });

        // Get Booking by email address
        app.get("/myBookings/:email", async (req, res) => {
            const result = await destinationsCollection.find({
              email: req.params.email,
            }).toArray();
            res.send(result);
          });



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Travel Agency Website')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})