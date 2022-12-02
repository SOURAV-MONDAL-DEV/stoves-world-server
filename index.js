const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ihuwgkj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const categoryCollection = client.db('stoveWorld').collection('categories');
        const productsCollection = client.db('stoveWorld').collection('products');
        const usersCollection = client.db('stoveWorld').collection('users');
        const ordersCollection = client.db('stoveWorld').collection('orders');



        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);

        })



        // Loading Product by category--------------

        app.get('/category/:id', async (req, res) => {
            const CategoryName = req.params.id;
            const query = { category: CategoryName, isSold: false };
            const cursor = await productsCollection.find(query);
            const products = await cursor.toArray();

            res.send(products);
        })


        // Loading Product by Advertise--------------

        app.get('/productsAdvertise/:id', async (req, res) => {
            const isAdvertised = req.params.id;
            const query = { isAdvertised: true};
            const cursor = await productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const email = req.params.id;
            const query = { email: email };
            const cursor = await productsCollection.find(query);
            const user = await cursor.toArray();

            res.send(user);
        })


        // UPDATE SOLD INFORMATION 

        app.put('/productSold/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const status = req.body;

            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    isSold: status.isSold,
                }
            }
                const result = await productsCollection.updateOne(query, updatedUser, options);
                res.send(result); 

        })


        // UPDATE Advertise INFORMATION



        app.put('/productAdvertise/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const status = req.body;
            console.log(query, status);

            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    isAdvertised: status.isAdvertised,
                }
            }
                const result = await productsCollection.updateOne(query, updatedUser, options);
                res.send(result); 

        })



        app.get('/usersRole/:id', async (req, res) => {
            const userRole = req.params.id;
            const query = {userRole:userRole}
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })




        app.get('/users/:id', async (req, res) => {
            const email = req.params.id;
            const query = { email: email };
            const cursor = await usersCollection.find(query);
            const user = await cursor.toArray();

            res.send(user);
        })

        


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


       

        app.put('/users/:id', async (req, res) => {
            const email = req.params.id;
            const query = { email: email };
            const user = req.body;
            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    userRole: user.userRole
                }
            }
            if (user.email) {
                const result = await usersCollection.updateOne(query, updatedUser, options);
                res.send(result);
            }

        })

        app.delete('/users/:id', async (req, res) => {
            const email = req.params.id;
            const query = { email: email };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })


        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })


        app.put('/orders', async (req, res) => {
            const orders = req.body;
            const query = { buyerEmail: orders.buyerEmail, productId: orders.productId }
            console.log(orders);
            const options = { upsert: true };
            const updatedOrders = {
                $set: {
                    buyerEmail: orders.buyerEmail,
                    productId: orders.productId,
                    productName: orders.productName,
                    picture: orders.picture,
                    resalePrice: orders.resalePrice,
                    originalPrice: orders.originalPrice,
                    sellerName: orders.sellerName,
                    location: orders.location,
                    sellerEmail: orders.sellerEmail,
                    sellerPhone: orders.sellerPhone,
                    condition: orders.condition,
                    buyerLocation: orders.buyerLocation,
                    buyerPhone: orders.buyerPhone
                }
            }
            const result = await ordersCollection.updateOne(query, updatedOrders, options);
            res.send(result);

        })


        // ---------------------------------

        app.get('/orders/:id', async(req, res) => {
            const email = req.params.id;
            const query = {buyerEmail: email };
            const cursor = await ordersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        // --------------------------------------

        // app.get('/product', async(req, res)=>{
        //     const CategoryName = req.params.id;
        //     let query = {};
        //     if(req.query.CategoryName){
        //                 query = {
        //                     CategoryName: req.query.CategoryName
        //                 }
        //             }
        //     const products = await productsCollection.find(query);
        //     res.send(products);
        // })




        // app.get('/reviews', async(req, res) =>{
        //     let query = {};
        //     if(req.query.service){
        //         query = {
        //             service: req.query.service
        //         }
        //     }
        //     else if(req.query.email){
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     const cursor = reviewCollection.find(query).sort({$natural:-1});
        //     const reviews = await cursor.toArray();
        //     res.send(reviews);

        // })



        // app.post('/reviews', async(req, res) => {
        //     const review = req.body;
        //     const result = await reviewCollection.insertOne(review);
        //     res.send(result);
        // })



    }
    finally {

    }

}

run().catch(err => console.err(err));



app.get('/', (req, res) => {
    res.send('stove server is running')
})


app.listen(port, () => {
    console.log(`stove server running on ${port}`);
})
