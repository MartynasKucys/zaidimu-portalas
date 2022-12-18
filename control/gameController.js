const sql = require("../configs/connect.js");

let getGamePage = (req, res) => {
    let userID = req.session.userID;
    let queryID = req.query.id;

    sql.query(`SELECT * FROM Zaidimai WHERE id_Zaidimas='${queryID}'`, (error, result) => {
        if(error) {
            return console.log(error);
        }
        if (result.length > 0) {
            let r = result[0];
            let userFK = r.fk_Naudotojas;
            if (userID == userFK || req.session.userRole == 1) {
                return res.render("game.ejs", {id: queryID, name: r.Pavadinimas, crlink: r.Nuoroda_i_kurejo_puslapi, genre: r.Zanras, 
                    reldate: r.Isleidimo_data, playtime: r.Zaidimo_ilgis, diff: r.Sunkumas, 
                    soclink: r.Nuoroda_i_socialinius_tinklus, downlink: r.Nuoroda_i_atsisiuntima, desc: r.Aprasas});
            }
        }
        else {
            return res.render("game.ejs", {name: r.Pavadinimas, crlink: r.Nuoroda_i_kurejo_puslapi, genre: r.Zanras, 
            reldate: r.Isleidimo_data, playtime: r.Zaidimo_ilgis, diff: r.Sunkumas, soclink: r.Nuoroda_i_socialinius_tinklus, downlink: r.Nuoroda_i_atsisiuntima, desc: r.Aprasas});
        }  
    })   
};

let getGameCreationPage = (req, res) => {
    return res.render("game_create.ejs");
};

let getGameEditPage = (req, res) => {
    if(req.query.id == req.session.userID) {
        let gameID = req.query.id;
        sql.query(`SELECT * FROM Zaidimai WHERE id_Zaidimas='${gameID}'`, (error, result) => {
            if(error) {
                return console.log(error);
            }
            if(result.length > 0) {
                return res.render("game_edit.ejs", {id: result[0].id_Zaidimas, crlink: result[0].Nuoroda_i_kurejo_puslapi, soclink: result[0].Nuoroda_i_socialinius_tinklus, 
                    downlink: result[0].Nuoroda_i_atsisiuntima, diff: result[0].Sunkumas, shortdesc: result[0].Trumpas_aprasymas, desc: result[0].Aprasas});
            } else {
                return res.redirect("/");
            }          
        })
    } else {
        return res.redirect("/");
    }
}

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

let editGame = (req, res) => {
        let newData = {
            id: req.body.id,
            crlink: req.body.crlink,
            soclink: req.body.soclink,
            downlink: req.body.downlink,
            diff: req.body.diff,
            shortdesc: req.body.shortdesc,
            desc: req.body.desc
        }
        sql.query(`UPDATE Zaidimai SET Aprasas='${newData.desc}', Nuoroda_i_kurejo_puslapi='${newData.crlink}', Nuoroda_i_socialinius_tinklus='${newData.soclink}', Nuoroda_i_atsisiuntima='${newData.downlink}', Trumpas_aprasymas='${newData.shortdesc}', Sunkumas='${newData.diff}' WHERE id_Zaidimas='${newData.id}'`);
        return res.redirect('/');
}

module.exports = {
    getGamePage: getGamePage,
    getGameCreationPage: getGameCreationPage,
    getGameEditPage: getGameEditPage,
    createNewGame: createNewGame,
    editGame: editGame
}