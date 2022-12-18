const sql = require("../configs/connect.js");

let getLoginPage = (req, res) =>  {
    return res.render("login.ejs");
};

let getRegisterPage = (req, res ) => {
    return res.render("register.ejs");
};

let getUpdatePage = (req, res) => {
    return res.render("update.ejs", {id: req.query.id});
}

let  getDeletePage = (req, res) => {
    return res.render("delete.ejs", {id: req.query.id});
}  

let getPowerPage = (req, res) => {
    return res.render("power.ejs", {id: req.query.id});
}

let loginUser = (req, res) => {
    try {
        let session = req.session;
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
                console.log(req.session);
                return res.redirect('/');   
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
            console.log(r);
            return res.render("profile.ejs", {name: r.Vardas, desc: r.Aprasas, xp: r.Patirties_taskai, country: r.Salis, short_desc: r.Trumpas_aprasymas, height: r.Ugis, width: r.Svoris, language: r.Kalba, hair: r.Plauku_spalva, gender: r.Lytis, eyes: r.Akiu_spalva, img: r.Nuotrauka, lvl: r.fk_lygis__id_lygis});
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
    getPowerPage: getPowerPage
}