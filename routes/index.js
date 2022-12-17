var express = require('express');
var router = express.Router();
const MongoClient =require('mongodb').MongoClient; 
const url= "mongodb+srv://admin:a12891289@cluster0.cd0rcje.mongodb.net/?retryWrites=true&w=majority";
const chatrecord=[];
router.get("/chat", function (req, res) {
  let q= req.query;
  if(q.user && q.say){
      let obj={user:q.user,say:q.say,time:new Date().toLocaleString()};
      chatrecord.push(obj);
  }
  res.writeHead(200,{"Content-Type":"application/json"});
  res.write(JSON.stringify(chatrecord));
  res.end();
});
// POST service
router.get("/chat/clear", function (req, res) {
    chatrecord.length=0;
    res.end();
});
router.get("/chat/save",function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err)throw err;
    console.log("連線成功");
    const dbo =db.db("mydb");
    dbo.collection("custor").insertMany(chatrecord, function (err, res) {
      if (err) throw err;
      console.log(`multiple documents were inserted`);
      db.close();
    });
  });
});
router.get("/chat/reload",function(req,res){
    MongoClient.connect(url,function(err,db){
      if(err)throw err;
      console.log("連線成功");
      const dbo =db.db("mydb");
      dbo.collection("custor").find({}).toArray(function (err, chatrecord) {
        if (err) throw err;
        res.send(chatrecord);
        console.log(chatrecord);
        db.close();
      });
    });
});

module.exports = router;
