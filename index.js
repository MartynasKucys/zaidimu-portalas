

const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const {getFavoriteGroup, addFavorite,removeFavoriteGame,removeFavoriteGroup} = require("./control/favoriteController");
const {getLoginPage, getRegisterPage, registerNewUser, getProfilePage, loginUser, getDeletePage, deleteUser} = require("./control/userController");
const {getGamePage} = require("./control/gameController");
const bodyParser = require("body-parser");
const sessions = require('express-session');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(sessions({
    secret:"?D(G-KaPdSgVkYp3s6v9y$B&E)H@MbQe",
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60 },
    resave: false
}));

app.use(cookieParser());

app.use(express.static(__dirname + "/public"));
//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    console.log(req.session);
    res.render('index.ejs', {root: __dirname, id: req.session.userID});  
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/favoriteGroup", getFavoriteGroup);
app.post("/addFavoriteGroup", addFavorite);
app.post("/removeFavoriteGame",removeFavoriteGame);
app.post("/removeFavoriteGroup", removeFavoriteGroup);


app.get("/delete", getDeletePage);

app.get("/login", getLoginPage);
app.get("/profile", getProfilePage);

app.get("/game", getGamePage);
app.get("/register", getRegisterPage);

app.post("/register", registerNewUser);
app.post("/login", loginUser);
app.post("/delete", deleteUser);



app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
  })