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
    const aggCursor = await ideas.aggregate([
      { $match:  { 
            //category_id: idea_obj['category_id'], //new ObjectId( ) ,
            idea: idea_obj['idea']}
        }
    ]);
    const arr = await aggCursor.toArray();
    const length = await arr.length;

    if(length == 0){
      const result = await ideas.insertOne(idea_obj);
      return ("Date idea was incserted successfully")
    }else{
      return ("This idea is already in the database")
    }
  } finally {
    await client.close();
  }
}

// get a random date idea

async function get_date_idea(category_id){
  try{
    await client.connect();
    console.dir(category_id['category_id']);
    const database = client.db("dateIdeas");
    const ideas = database.collection("ideas");

    const aggCursor = await ideas.aggregate([
        { $match:  { 
              category_id: category_id['category_id']} //new ObjectId( ) 
          },  
        { $sample: { size: 3}}
    ]);

    const idea_returned = await aggCursor.toArray();

    //console.log(idea_returned[0]);
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
})

app.get('/get_idea', (req, res) => {
  (async () => {
    var category_id = req.body;
    //console.log(req.body)
    var result = await get_date_idea(category_id);
    ///console.dir(result)
    res.send(result);
  })()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

