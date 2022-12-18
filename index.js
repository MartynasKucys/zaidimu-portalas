

const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const {getFavoriteGroup, addFavorite} = require("./control/favoriteController");
const {getLoginPage, getRegisterPage, registerNewUser} = require("./control/userController");
const {getGamePage} = require("./control/gameController");
const bodyParser = require("body-parser");


app.use(express.static(__dirname + "/public"));
//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.render('index.ejs', {root: __dirname});  
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/favoriteGroup", getFavoriteGroup);
app.post("/addFavoriteGroup", addFavorite)


app.get("/login", getLoginPage);

app.get("/game", getGamePage);
app.get("/register", getRegisterPage);

app.post("/register", registerNewUser);




app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
  })