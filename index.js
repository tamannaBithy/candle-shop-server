const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

var cors = require('cors')
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
    res.send('my new assignment 12 has come')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y9cyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("candleDb");
        const productsCollection = database.collection("allProducts");
        const ordersCollection = database.collection("orders");

        // console.log("mongo connect succesfully");


        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })


        // // GET INSERTED DATA
        // app.get('/addService', async (req, res) => {
        //     const cursor = addedCollection.find({});
        //     const services = await cursor.toArray();
        //     res.send(services)
        // })


        // GET SINGLE SERVICE
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await productsCollection.findOne(query);
            res.send(service)
        })




        // //  POST / INSERT API
        // app.post('/addService', async (req, res) => {
        //     const packageDetails = req.body;
        //     const result = await addedCollection.insertOne(packageDetails);
        //     res.json(result);

        // })



        //add order in database
        app.post("/manageOrders", async (req, res) => {
            const orderDetails = req.body;
            const result = await ordersCollection.insertOne(orderDetails);
            res.json(result);
        });



        // get all order by email query only for me
        app.get("/myOrder/:email", async (req, res) => {
            const result = await ordersCollection
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
        });



        // // get all orders for all public
        // app.get('/manageOrders', async (req, res) => {
        //     const cursor = ordersCollection.find({});
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // })



        // DELETE API
        app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })



        // // UPDATE API
        // app.put("/manageOrders/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };

        //     ordersCollection
        //         .updateOne(filter, {
        //             $set: {
        //                 status: "Approved",
        //             },
        //         })
        //         .then((result) => {
        //             res.send(result);
        //         });
        // });

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);