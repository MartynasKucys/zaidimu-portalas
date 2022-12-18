const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const {getLoginPage, getRegisterPage} = require("./control/userController");
const {getGamePage} = require("./control/gameController");

app.use(express.static(__dirname + "/public"));
//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.render('index.ejs', {root: __dirname});  
});

app.get("/login", getLoginPage);

app.get("/game", getGamePage);
app.get("/register", getRegisterPage);
