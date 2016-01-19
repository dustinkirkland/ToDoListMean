/* To Do List Demo App
 * server.js
 * Anjay Ajodha
 * From Chris Sevilleeja (scotch.io)
 * Microsoft Corporation 2015 
 */

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/todo')

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));         // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//Model

var Todo = mongoose.model('Todo', {
    text : String,
    done : Boolean
});

//Routes

app.get('/api/todos', function (req, res) {
    
    Todo.find(function (err, todos) {
        
        if (err)
            res.send(err);
        
        res.json(todos);
    });
});

app.post('/api/todos', function(req, res) {

    Todo.create({
        text : req.body.text,
        done : false
    }, function (err, todo) {
        if (err)
            res.send(err);
    
        Todo.find(function (err, todos) {
            if (err)
                res.send(err);
            res.json(todos);
        });
    });

});

app.delete('/api/todos/:todo_id', function (req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);
        
        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

//frontend code - for anything other than the API above, send index.html
app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

//Listening for input
app.listen(8080);
console.log("Listening on 8080");

