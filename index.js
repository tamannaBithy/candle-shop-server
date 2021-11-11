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
        const reviewCollection = database.collection("reviews");
        const usersCollection = database.collection("admin");

        // console.log("mongo connect succesfully");


        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })


        //add product in database
        app.post("/products", async (req, res) => {
            const productDetails = req.body;
            const result = await productsCollection.insertOne(productDetails);
            res.json(result);
        });



        // GET SINGLE SERVICE
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await productsCollection.findOne(query);
            res.send(service)
        })



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



        // get all orders for all public
        app.get('/manageOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })



        // DELETE API
        app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })


        // review
        app.post("/review", async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
        });


        // GET reviews
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })


        // DELETE API
        app.delete('/deleteMainProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
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

        // status update
        app.put("/manageOrders/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const result = await ordersCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
            console.log(result);
        });




        //   for save the user in database
        // post api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })


        // upsert data for google log in
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, options, updateDoc);
            res.send(result);
        })



        //  make admin
        app.put("/makeAdmin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await usersCollection.find(filter).toArray();
            if (result) {
                const documents = await usersCollection.updateOne(filter, {
                    $set: { role: "admin" },
                });
                res.send(result);
                console.log(documents);
            }
        });

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);