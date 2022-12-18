const sql = require("../configs/connect.js");

let getGamePage = (req, res) => {
    return res.render("game.ejs", {id: req.session.userID});
};

let getGameCreationPage = (req, res) => {
    return res.render("game_create.ejs");
};

let createNewGame = (req, res) => {
    let id = req.session.userID;

    try {
        let newUser = {
            name: req.body.name,
            reldate: req.body.reldate,
            genre: req.body.genre,
            crlink: req.body.crlink,
            soclink: req.body.soclink,
            downlink: req.body.downlink,
            playtime: req.body.playtime,
            diff: req.body.diff,
            photo: req.body.photo,
            shortdesc: req.body.shortdesc,
            desc: req.body.desc,
        }
        
        sql.query(`INSERT INTO Zaidimai(Pavadinimas, Aprasas, Isleidimo_data, Nuoroda_i_kurejo_puslapi, Nuoroda_i_socialinius_tinklus, Nuoroda_i_atsisiuntima, Zaidimo_ilgis,
            Trumpas_aprasymas, Sunkumas, Zanras, Statusas, Nuotrauka, fk_Naudotojas) 
                          VALUES ('${newUser.name}', '${newUser.desc}', '${newUser.reldate}', '${newUser.crlink}', '${newUser.soclink}', 
                          '${newUser.downlink}', '${newUser.playtime}', '${newUser.shortdesc}', '${newUser.diff}',' 
                          ${newUser.genre}', '1', '${newUser.photo}', '${id}')`);
        return res.redirect("/");                         
    } catch(error) {
        console.log(error);
    }
};

module.exports = {
    getGamePage: getGamePage,
    getGameCreationPage: getGameCreationPage,
    createNewGame: createNewGame
}