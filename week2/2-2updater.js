//mongoimport --type csv --headerline weather_data.csv -d weather -c data
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/weather';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  if(err){
    console.log("unable to connect")
  } else {
    console.log("connection ok");
  }

  //insertDocuments(db, function() {
  //  db.close();
  //});
  var collection = db.collection('data');
  var cursor = collection.find().sort({"State":1, "Temperature": -1});
  //var cursor = collection.find({"State":"Vermont"}, function(err, doc){
  //  if(err) throw err;
  //  //console.log(doc);
  //  doc.each(function(err, item){
  //    if(err) throw err;
  //    console.log(item);
  //  });

// .sort({"State": 1}).so
  // rt({"Temperature": -1});
  var lastState = '';
  cursor.each(function(err, item){
    if ( item === null) {
      db.close();
      return;
    }
    if(err){
      console.log(err);
    } else {
      //collection.update(item._id, {$unset:{'month_high' :1}})
      if(item.State !== lastState){
        lastState = item.State;
        // insert here
        collection.update({_id: item._id}, {$set:{'month_high':true}})
        console.log("updating " + item.State);
      } else {
        //collection.update(item._id, {$unset:{'month_high' :1}})
      }
      //console.log(item.State);
    }
    //db.close();
  });
  // console.log(cursor);

});

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}