const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);


// const uri = "mongodb+srv://<username>:<password>@cluster0.ihuwgkj.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ihuwgkj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const categoryCollection = client.db('stoveWorld').collection('categories');
        const productsCollection = client.db('stoveWorld').collection('products');


        // app.get('/categories', async(req,res) => {

        // })

        app.get('/categories', async(req, res) =>{
            const query = {}
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);

        })

        // app.post('/services', async(req, res) => {
        //     const service = req.body;
        //     console.log(service);
        //     const result = await serviceCollection.insertOne(service);
        //     res.send(result);
        // })

        app.get('/category/:id', async(req, res)=>{
            const CategoryName = req.params.id;
            const query = {CategoryName:CategoryName};
            const cursor = await productsCollection.find(query);
            const products = await cursor.toArray();
 
            res.send(products);
        })



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
    finally{

    }

}

run().catch(err => console.err(err));



app.get('/', (req, res)  =>{
    res.send('stove server is running')
})


app.listen(port, ()=>{
    console.log(`stove server running on ${port}`);
})
