const express = require('express');
const { json } = require('express/lib/response');


const app = express()
app.use(express.json()) 
const port = 3000



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =  "mongodb+srv://admin:passwordpassword@dateideasdb.pvicx.mongodb.net/dateIdeas?retryWrites=true&w=majority";
const client = new MongoClient(uri);


// CATEGORIES 

async function get_category_list(){
  try{
    await client.connect();

    const database = client.db("dateIdeas");
    const categories = await database.collection("categories").find().toArray();
    //console.log(categories);
    return categories

  } finally {
    await client.close();
  }

}



// DATE IDEAS 

// Create new date idea

async function create_date_idea(idea_obj){
  try{
    await client.connect();

    const database = client.db("dateIdeas");
    const ideas = database.collection("ideas");

    const result = await ideas.insertOne(idea_obj);
    return ("Date idea was incserted successfully")
  } finally {
    await client.close();
  }
}

// get a random date idea

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



//  HTTP REQUESTS


// CATEGORIES
app.get('/get_category_list', (req, res) => {
  
  (async () => {
    var result = await get_category_list();
    var json_list = JSON.stringify({category_list: result});
    res.send(json_list)
    })()

})


// IDEAS
app.post('/add_idea', (req, res) => {

  (async () => {
    var idea_obj = req.body;
    var result = await create_date_idea(idea_obj);
    res.send(result);
    })()
  //console.dir(req.body);
  //var idea_obj = req.body;
  //create_date_idea(idea_obj);
  //res.send('');
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

