const express = require('express')


const app = express()
app.use(express.json()) 
const port = 3000



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =  "mongodb+srv://admin:passwordpassword@dateideasdb.pvicx.mongodb.net/dateIdeas?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function create_date_idea(idea_obj){
  try{
    await client.connect();

    const database = client.db("dateIdeas");
    const ideas = database.collection("ideas");

    const result = await ideas.insertOne(idea_obj);

    console.log("An idea was inserted")
  } finally {
    await client.close();
  }
}

async function get_date_idea(category_id){
  try{
    await client.connect();

    const database = client.db("dateIdeas");
    const ideas = database.collection("ideas");

    const aggCursor = await ideas.aggregate([
        { $match:  { 
            category_id: new ObjectId("62652c61fc41248e6e47fbcb")}
        },  
        { $sample: { size: 1}}
    ]);

    const idea_returned = await aggCursor.toArray();

    console.log(idea_returned[0]);
    return idea_returned[0];
  } finally {
    await client.close();
  }
}





app.post('/add_idea', (req, res) => {

  console.dir(req.body);
  var idea_obj = req.body;
  create_date_idea(idea_obj);
  res.send('Hello World!');
})

app.get('/get_idea', (req, res) => {
  var category_id = req.body;
  var result = get_date_idea(category_id);
  console.dir(result)
  res.send(result);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

