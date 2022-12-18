const sql = require("../configs/connect.js");

let getLoginPage = (req, res) =>  {
    return res.render("login.ejs");
};

let getRegisterPage = (req, res ) => {
    return res.render("register.ejs");
};

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
        
        sql.query(`INSERT INTO Naudotojai(Vardas, Elektroninis_pastas, Slaptazodis, Aprasas, Patirties_taskai,Salis, Trumpas_aprasas, Ugis, Svoris, Kalba, Plauku_spalva, Lytis, Akiu_spalva, fk_image__id_image, fk_lygis__id_lygis) 
                          VALUES ('${newUser.name}', '${newUser.email}', '${newUser.password}', '${newUser.desc}', '0', '${newUser.country}', '${newUser.short_desc}', '${newUser.height}', '${newUser.width}', '${newUser.language}',' ${newUser.hair_col}', '${newUser.gender}', '${newUser.eye_col}', '1', '1')`);
        res.redirect("/");                          
    } catch(error) {
        console.log(error);
    }
}
module.exports = {
    getLoginPage: getLoginPage,
    getRegisterPage: getRegisterPage,
    registerNewUser: registerNewUser
}