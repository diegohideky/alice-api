var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('alice', ['alice']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/drop', function (req, res) {
  db.alice.drop(function (err, docs) {
    res.json(docs);
  });
});

app.post('/login', function (req, res) {
  var request = req.query;
  db.alice.findOne({
    username: request.username,
    password: request.password
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "Username or passwod wrong: " + err, res: null});
    } else {
      res.json({success: true, msg: "Welcome " + request.username , res: docs});
    }
  });
});

app.get('/find/user', function (req, res) {
  var request = req.query;
  db.alice.findOne({
    username: request.username
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "User not found: " + err, res: null});
    } else {
      res.json({success: true, msg: "User successfully found", res: docs});
    }
  });
});

app.post('/add/user', function (req, res) {
  var request = req.query;
  db.alice.insert({
    name: request.name,
    username: request.username,
    email: request.email,
    password: request.password
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "User not inserted: " + err, res: null});
    } else {
      res.json({success: true, msg: "User successfully inserted", res: docs});
    }
  });
});

app.post('/pee', function (req, res) {
  var request = req.query;
  db.alice.update({
    username: request.username
  }, {
    $push: {
      pee: {
        datetime: request.datetime,
        description: request.description
      }
    }
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "Pee not inserted: " + err, res: null});
    } else {
      db.alice.findOne({
        username: request.username
      }, function (err, result) {
        if (err) {
          res.json({success: false, msg: "User not found", res: null});
        } else {
          res.json({success: true, msg: "Pee successfully inserted", res: result});
        }
      });
    }
  });
});

app.post('/poo', function (req, res) {
  var request = req.query;
  db.alice.update({
    username: request.username
  }, {
    $push: {
      poo: {
        datetime: request.datetime,
        description: request.description
      }
    }
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "Poo not inserted: " + err, res: null});
    } else {
      db.alice.findOne({
        username: request.username
      }, function (err, result) {
        if (err) {
          res.json({success: false, msg: "User not found", res: null});
        } else {
          res.json({success: true, msg: "Poo successfully inserted", res: result});
        }
      });
    }
  });
});

app.get('/pee', function (req, res) {
  var request = req.query;
  db.alice.findOne({
    username: request.username
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "User not found", res: null});
    } else {
      if (docs.pee) {
        docs.pee.forEach(function (pee){
          if (pee.datetime === request.datetime) {
            res.json({success: true, res: pee});
          }
        });
        res.json({success: false, msg: "Pee not found", res: null});
      } else {
        res.json({success: false, msg: "There is no pee inserted yet", res: null});
      }
    }
  });
});

app.get('/poo', function (req, res) {
  var request = req.query;
  db.alice.findOne({
    username: request.username
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "User not found", res: null});
    } else {
      if (docs.poo) {
        docs.poo.forEach(function (poo){
          if (poo.datetime === request.datetime) {
            res.json({success: true, res: poo});
          }
        });
        res.json({success: false, msg: "Pee not found", res: null});
      } else {
        res.json({success: false, msg: "There is no poo inserted yet", res: null});
      }
    }
  });
});

app.delete('/pee', function (req, res) {
  var request = req.query;
  db.alice.update({
    username: request.username
  }, {
    $pull: {
      pee: {
        datetime: request.datetime
      }
    }
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "Pee not found", res: null});
    } else {
      db.alice.findOne({
        username: request.username
      }, function (err, result) {
        if (err) {
          res.json({success: false, msg: "User not found", res: null});
        } else {
          res.json({success: true, msg: "Pee successfully deleted", res: result});
        }
      });
    }
  });
});

app.delete('/poo', function (req, res) {
  var request = req.query;
  db.alice.update({
    username: request.username
  }, {
    $pull: {
      poo: {
        datetime: request.datetime
      }
    }
  }, function (err, docs) {
    if (err) {
      res.json({success: false, msg: "Poo not found", res: null});
    } else {
      db.alice.findOne({
        username: request.username
      }, function (err, result) {
        if (err) {
          res.json({success: false, msg: "User not found", res: null});
        } else {
          res.json({success: true, msg: "Poo successfully deleted", res: result});
        }
      });
    }
  });
});

app.listen(3000);
console.log("Listening on the port 3000");