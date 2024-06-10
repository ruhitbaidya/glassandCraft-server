const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 4000;

// server cors and json link
// const crosConfig = {
//   origin : "*",
//   credential : true,
//   methods : ["GET", "POST", "PUT", "DELETE", "PATCH"]

// }
// app.options("", cors(crosConfig))
app.use(cors());
app.use(express.json());

// mongodb url 
const uri =
  `mongodb+srv://${process.env.BD_USER}:${process.env.DB_PASS}@ruhit0.zpi8gqt.mongodb.net/?retryWrites=true&w=majority&appName=ruhit0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    client.connect();

    // all router here

    const perocustCollection = client.db("paperCraftDB").collection("product");
    const catagorycoll = client.db("paperCraftDB").collection("category");

    app.get("/category", async(req, res)=>{
        try{
            const result = await catagorycoll.find().toArray();
            res.send(result)
        }
        catch(err){
            res.send({error : "this category router problem"})
        }
    })

    app.get("/categoryFind/:id", async (req, res)=>{
        try{
            const id = {subcategory_Name : req.params.id}
            const result = await perocustCollection.find(id).toArray();
            res.send(result)
        }
        catch(err){
            res.send({error : "This Problem category router"})
        }
    })

    app.get("/product", async (req, res) => {
      try {
        const result = await perocustCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.send({ error: "Problem In Product get Router" });
      }
    });

    app.get("/signalProduct/:id", async (req, res) => {
      try {
        const id = { _id: new ObjectId(req.params.id) };
        const result = await perocustCollection.findOne(id);
        res.send(result);
      } catch (err) {
        res.send({ error: "Problem In Singel get router" });
      }
    });

    app.get("/selfUser/:email", async (req, res) => {
      try {
        const query = { email: req.params.email };
        const result = await perocustCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        res.send({ error: "This problem Self Router" });
      }
    });
    app.patch("/update/:id", async (req, res)=>{
        try{
            const id = {_id : new ObjectId(req.params.id)}
            const datas = req.body;
            const options = { upsert: true };
            const data = {
                $set : {
                    name : datas.name,
                    image : datas.image,
                    subcategory_Name : datas.subcategory_Name,
                    price : datas.price,
                    rating : datas.rating,
                    customization : datas.customization,
                    times : datas.times,
                    stock_status : datas.stock_status,
                    description : datas.description,
                 }
            }

            const result = await perocustCollection.updateOne(id, data, options);
            res.send(result)
        }
        catch(err){
            res.send({error : "this problem in update router"})
        }
    })
    app.delete("/delete/:id", async (req, res)=>{
        try{
            const id = {_id : new ObjectId(req.params.id)}
            const result = await perocustCollection.deleteOne(id);
            res.send(result)
        }
        catch(err){
            res.send({error: "problem in Delete Route"})
        }
    })
    app.post("/createProduct", async (req, res) => {
      try {
        const docs = req.body;
        console.log(req.body)
        const result = await perocustCollection.insertOne(docs);
        res.send(result);
      } catch (err) {
        res.send({ error: "Product Router Problem" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("this post has done");
});

// this app listen link listen port here
app.listen(port, () => {
  console.log(`This server is start port ${port}`);
});
