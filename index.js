const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER, process.env.DB_PASS)
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = "mongodb+srv://mysha:ONtVYBcmXd4el2Yr@cluster0.n0bjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    // await client.connect();
    const database = client.db("insertDB");
    const jibon = database.collection("haiku");

    app.post('/addCoffee', async(req,res)=>{
      
        const coffee=req.body;
        console.log('new coffee', coffee)
        try{
            const result = await jibon.insertOne(coffee);
        res.send(result)
        }
        catch (error) {
            console.error('Error inserting user:', error);
            res.status(500).send({ error: 'Failed to insert user' });
          }
    })

    app.get('/addCoffee', async(req,res)=>{
        const cursor= jibon.find();
        const result= await cursor.toArray();
        res.send(result)
    })
   
    app.delete('/addCoffee/:id', async(req, res)=>{
         const id=req.params.id;
         console.log('id delete successfully');
         const query={_id: new ObjectId(id)}
         const result=await jibon.deleteOne(query);
         console.log('delete',query);
         res.send(result)
    })
    app.get('/update/:id', async(req,res)=>{
         const id=req.params.id;
         const query={_id: new ObjectId(id)}
         const coffee=await jibon.findOne(query)
         console.log('update',query);
         res.send(coffee)
    })

    app.put('/update/:id', async(req, res)=>{

        const id=req.params.id;
        const coffee=req.body;
        console.log('update',coffee);
        const filter={_id : new ObjectId(id)}
        const option={upsert:true}
        const updateUser={
            $set:{
                name: coffee.name,
                chef:coffee.chef,
               taste:coffee.taste,
               supplier:coffee.supplier,


            }
        }
        const result= await jibon.updateOne(filter,updateUser,option)
        res.send(result)

    })
    app.post('/details/:id', async(req,res)=>{
        const id=req.params.id;
        console.log('see details')
        const query={_id: new ObjectId(id)}
        const result=await jibon.deleteOne(query);
        console.log('delete',query);
        res.send(result)
    })
    app.get('/details/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const coffee=await jibon.findOne(query)
        console.log('update',query);
        res.send(coffee)
   })
  
  } 
  catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})