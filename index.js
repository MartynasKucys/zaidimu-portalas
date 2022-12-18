const sql = require("./configs/connect.js");

const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const {getFavoriteGroup, addFavorite,removeFavoriteGame,removeFavoriteGroup} = require("./control/favoriteController");
const {getLoginPage, getRegisterPage, getUpdatePage, getPowerPage, 
    getDeletePage, registerNewUser, getProfilePage, loginUser, deleteUser, updateUser} = require("./control/userController");
const {getGamePage, getGameCreationPage, createNewGame} = require("./control/gameController");
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
    let games = [];
    sql.query(`SELECT * FROM Zaidimai`, (error, result) => {
        if(error) {
            return console.log(error);
        }       
        if (result.length > 0) {
            for (let i of result) {
                data = {
                    name: i.Pavadinimas,
                    shortdesc: i.Trumpas_aprasymas,
                    id: i.id_Zaidimas,
                    image: i.Nuotrauka.toString('base64')
                }
                games.push(data);
            };        
        }
        console.log(games);
        res.render('index.ejs', {root: __dirname, id: req.session.userID, Games: games});
    }); 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Favourites sub-system
app.get("/favoriteGroup", getFavoriteGroup);
app.post("/addFavoriteGroup", addFavorite);
app.post("/removeFavoriteGame",removeFavoriteGame);
app.post("/removeFavoriteGroup", removeFavoriteGroup);

// User management sub-system
app.get("/login", getLoginPage);
app.get("/profile", getProfilePage);
app.get("/register", getRegisterPage);
app.get("/update", getUpdatePage);
app.get("/delete", getDeletePage);
app.get("/power", getPowerPage);

// Game management sub-system
app.get("/game", getGamePage);
app.get("/game_create", getGameCreationPage);

// POSTs
app.post("/addFavorite", addFavorite);
app.post("/register", registerNewUser);
app.post("/login", loginUser);
app.post("/delete", deleteUser);
app.post("/update", updateUser);
app.post("/game_create", createNewGame);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
  })