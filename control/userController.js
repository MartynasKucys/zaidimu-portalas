const sql = require("../configs/connect.js");

let getLoginPage = (req, res) =>  {
    return res.render("login.ejs");
};

let getRegisterPage = (req, res ) => {
    return res.render("register.ejs");
};

let getUpdatePage = (req, res) => {
    if(req.query.id == req.session.userID) {
        let userID = req.query.id;
        sql.query(`SELECT * FROM Naudotojai WHERE id_Naudotojas='${userID}'`, (error, result) => {
            if(error) {
                return console.log(error);
            }
            if(result.length > 0) {
                return res.render("update.ejs", {id: userID, language: result[0].Kalba, height: result[0].Ugis, width: result[0].Svoris, hair_col: result[0].Plauku_spalva, short_desc: result[0].Trumpas_aprasymas, desc: result[0].Aprasas});
            } else {
                return res.redirect("/");
            }
            
        })
    } else {
        return res.redirect("/");
    }

}

let  getDeletePage = (req, res) => {
    return res.render("delete.ejs", {id: req.query.id});
}  

let getPowerPage = (req, res) => {
    return res.render("power.ejs", {id: req.query.id});
}

let deleteUser = (req, res) => {
    if(req.query.id == req.session.userID) {
        sql.query(`SELECT * FROM Naudotojai WHERE id_Naudotojas='${req.query.id}'`, (error, result) => {
            if(error) {
                return console.log(error);
            }
            
            if(result.length > 0) {
                return sql.query(`DELETE * FROM Naudotojai WHERE id_Naudotojas='${req.query.id}'`);
            }

        })
    }

    return res.redirect('/');
}

let updateUser = (req, res) => {
    let userID = req.session.userID;
    let id = req.body.id;

    if(userID == id || req.session.userRole == 1) {
        console.log("ttt");
        let newData = {
            language: req.body.lang,
            height: req.body.height,
            width: req.body.width,
            hair: req.body.hair_col,
            short: req.body.short_desc,
            desc: req.body.desc
        }
        console.log(newData);
        sql.query(`UPDATE Naudotojai SET Kalba='${newData.language}', Ugis='${newData.height}', Svoris='${newData.width}', Plauku_spalva='${newData.hair}', Trumpas_aprasas='${newData.short}', Aprasas='${newData.desc}'`);
        return res.redirect('/');

    } else {
        return res.redirect('/');
    }

}
let loginUser = (req, res) => {
    try {
        let name = req.body.name;
        let password = req.body.password;

        sql.query(`SELECT * FROM Naudotojai WHERE Vardas='${name}' AND Slaptazodis='${password}'`, (err, result) => {
            if(err) {
                return console.log(err);
            }

            if(result.length > 0) {


                //session.id = result.id;
                let userID = result[0].id_Naudotojas;
                req.session.userID = userID;
                sql.query(`SELECT id_Role FROM roles WHERE fk_Naudotojas__id_Naudotojas='${userID}'`, (err,result) => {
                    if(err) {
                       return console.log(err);
                    }

                    req.session.userRole = result[0].id_Role;

                    return res.redirect('/');   
                });

            }


        });
    } catch {
        console.log("error");
    }
}
let getProfilePage = (req,res) => {
    let userID = req.query.id;
    sql.query(`SELECT * FROM Naudotojai WHERE id_Naudotojas='${userID}'`, (error, result) => {
        if(error) {
            return console.log(error);
        }
        
        if(result.length > 0) {

            let r = result[0];
            return res.render("profile.ejs", {id: userID, name: r.Vardas, desc: r.Aprasas, xp: r.Patirties_taskai, country: r.Salis, short_desc: r.Trumpas_aprasymas, height: r.Ugis, width: r.Svoris, language: r.Kalba, hair: r.Plauku_spalva, gender: r.Lytis, eyes: r.Akiu_spalva, img: r.Nuotrauka, lvl: r.fk_lygis__id_lygis});
        }
        return res.redirect('/');
    })

}
let registerNewUser = (req, res) => {
    try {
        let newUser = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            language: req.body.language,
            height: req.body.height,
            width: req.body.width,
            hair_col: req.body.hair_col,
            eye_col: req.body.eye_col,
            gender: req.body.gender,
            short_desc: req.body.short_desc,
            desc: req.body.desc,
            country: req.body.country
        }
        
        sql.query(`INSERT INTO Naudotojai(Vardas, Elektroninis_pastas, Slaptazodis, Aprasas, Patirties_taskai,Salis, Trumpas_aprasas, Ugis, Svoris, Kalba, Plauku_spalva, Lytis, Akiu_spalva, fk_lygis__id_lygis) 
                          VALUES ('${newUser.name}', '${newUser.email}', '${newUser.password}', '${newUser.desc}', '0', '${newUser.country}', '${newUser.short_desc}', '${newUser.height}', '${newUser.width}', '${newUser.language}',' ${newUser.hair_col}', '${newUser.gender}', '${newUser.eye_col}','1')`);
        
        sql.query(`INSERT INTO roles( Komentaras, Role, fk_Naudotojas__id_Naudotojas) 
                          VALUES ('Vartotojas uzsiregistravo', '2', LAST_INSERT_ID())`);
        return res.redirect("/");                         
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    getLoginPage: getLoginPage,
    getRegisterPage: getRegisterPage,
    registerNewUser: registerNewUser,
    loginUser: loginUser,
    getProfilePage: getProfilePage,
    getDeletePage: getDeletePage,
    getUpdatePage: getUpdatePage,
    getPowerPage: getPowerPage,
    deleteUser: deleteUser,
    updateUser: updateUser
}