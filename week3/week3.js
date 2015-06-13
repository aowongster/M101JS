//mongoimport -d school -c students < students.json
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/school';
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
  var collection = db.collection('students');
  var cursor = collection.find({},{"name" : 1, "scores" : 1});

  var lastState = '';
  cursor.each(function(err, student){
    if ( student === null) {
     return db.close();
    }
    if(err){
      console.log(err);
    } else {
      //collection.update(item._id, {$unset:{'month_high' :1}})
     //console.log(student);
      var min  = 100;
      for(var i = 0; i< student.scores.length; i++){
        if(student.scores[i]["type"] === 'homework'){
          if(student.scores[i]["score"] < min){
            min = student.scores[i]["score"];
          }
          //console.log(student.name, student.scores[i]["score"]);

        }
      }
      student.scores = student.scores
        .filter(function(el){
          return el.score !== min;
        })

      console.log(student.scores);

      // now save back scores
      collection.update({_id : student._id,  "scores.score" : min },
      {"scores": student.scores });
      console.log(min);

    }
    //db.close();
  });
  // console.log(cursor);

});
