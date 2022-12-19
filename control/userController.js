const sql = require("../configs/connect.js");
const auth = require("../validation/auth.js");
const mail = require("nodemailer");

let transporter = mail.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: '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'
    }
});

let getLoginPage = (req, res) =>  {
    return res.render("login.ejs", {err_msg: "", code:0});
};

let codes = [];

let getRegisterPage = (req, res ) => {
    return res.render("register.ejs", {err_msg: []});
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

let getDeletePage = (req, res) => {
    return res.render("delete.ejs", {id: req.query.id, msg: ""});
}  

let logoutPage = (req, res) => {
    req.session.destroy();
    codes = [];
    return res.redirect('/');
}
let getPowerPage = (req, res) => {
    if(req.session.userRole != 1) {
        return res.redirect("/");
    }
    return res.render("power.ejs", {id: req.query.id});
}

let deleteUser = (req, res) => {
    console.log(req.body.id);
    console.log(req.session.userID);
    if(req.body.id == req.session.userID || req.session.userRole == '1' ) {
        sql.query(`SELECT * FROM Naudotojai WHERE id_Naudotojas='${req.body.id}'`, (error, result) => {
            if(error) {
                return console.log(error);
            }
            if(result.length > 0) {
                console.log(result);
                sql.query(`DELETE FROM Roles WHERE fk_Naudotojas__id_Naudotojas='${req.body.id}'`);
                sql.query(`DELETE FROM Megstamiausios_Megstamiausiu_grupes WHERE fk_Naudotojas__id_Naudotojas='${req.body.id}'`);
                sql.query(`DELETE FROM Megstamiausiu_grupes WHERE fk_Naudotojas__id_Naudotojas='${req.body.id}'`);
                for (let i of result) {
                    sql.query(`DELETE FROM Zaidimai WHERE fk_Naudotojas='${req.body.id}'`);
                } 
                sql.query(`DELETE FROM Naudotojai WHERE id_Naudotojas='${req.body.id}'`);
            }
            req.session.destroy();
            return res.redirect("/");
        })
    }
}

let updateUser = (req, res) => {
    let userID = req.session.userID;
    let id = req.body.id;
    if(userID == id || req.session.userRole == 1) {
        let newData = {
            language: req.body.lang,
            height: req.body.height,
            width: req.body.width,
            hair: req.body.hair_col,
            short: req.body.short_desc,
            desc: req.body.desc
        }
        sql.query(`UPDATE Naudotojai SET Kalba='${newData.language}', Ugis='${newData.height}', Svoris='${newData.width}', Plauku_spalva='${newData.hair}', Trumpas_aprasas='${newData.short}', Aprasas='${newData.desc}'`);
        return res.redirect('/');
    } else {
        return res.redirect('/');
    }
}

let powerUser = (req, res) => {
    if(req.session.userRole == "1") {
        sql.query(`UPDATE Roles SET Role='1' WHERE fk_Naudotojas__id_Naudotojas='${req.body.id}'`);
    }
    return res.redirect("/");
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
                console.log(userID);
                req.session.userID = userID;

                let code = Math.floor(1000 + Math.random() * 9000);
                    



                let userInfo = {
                    userID: userID,
                    code: code
                }

                if(!codes.find(x => x.userID == userID)) {
                    codes.push(userInfo);
                    res.render("login.ejs", {err_msg: "Neteisingas prisijungimo kodas! Jeigu kodo nevedėte, į jūsų el. paštą išsiuntėme laišką su kodu.", code: 0});

                    const msg = ({
                        from: "zaidimu_portalas@email.com",
                        to: result[0].Elektroninis_pastas,
                        subject:"Zaidimu portalas | Prisijungimo kodas",
                        text:`Sveiki, džiugu jus matyti mūsų portale. Prisijungimo kodas yra ${code}.`
                    });
    
                    transporter.sendMail(msg, (error, response) => {
                        if(error) {
                            return console.log(error);
                        }
    
                        console.log(response);
                        console.log(codes);
                    });
                }


                sql.query(`SELECT * FROM roles WHERE fk_Naudotojas__id_Naudotojas='${userID}'`, (err,result) => {
                    if(err) {
                       return console.log(err);
                    }   


                    req.session.userRole = result[0].Role;

                    if(req.body.code){
                        if(codes.find(x => x.code == req.body.code)) {
                            return res.redirect("/");
                        } else {
                            return res.render("login.ejs", {err_msg: "Neteisingas prisijungimo kodas! Jeigu kodo nevedėte, į jūsų el. paštą išsiuntėme laišką su kodu.", code: 0});
                        }
                    }

                });
            } else {
                res.render("login.ejs", {err_msg: "Toks vartotojas neegzistuoja!,", code: 0});
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
            sql.query(`SELECT name FROM Lygis Where id_Lygis='${r.fk_lygis__id_lygis}'`, (e_level, level) => {
                if(e_level) {
                    return console.log(e_level);
                }
                sql.query(`select name FROM Akiu_Spalva Where id_Akiu_spalva='${r.Akiu_spalva}'`, (e_eyes, eyes) => {
                    if(e_eyes) {
                        return console.log(e_eyes);
                    }
                    sql.query(`select name FROM Lytis Where id_Lytis='${r.Lytis}'`, (e_gender, gender) => {
                        if(e_gender) {
                            return console.log(e_gender);
                        }                        
                        return res.render("profile.ejs", {currID: req.session.userID, role: req.session.userRole, id: userID,image: r.image, name: r.Vardas, desc: r.Aprasas, xp: r.Patirties_taskai, country: r.Salis, short_desc: r.Trumpas_aprasymas, height: r.Ugis, width: r.Svoris, language: r.Kalba, hair: r.Plauku_spalva, gender: gender[0].name, eyes: eyes[0].name, img: r.Nuotrauka, lvl: level[0].name});
                    })
                })
            });          
        } else {
            return res.redirect('/');
        }
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
            country: req.body.country,
        }

        auth.checkRegister(newUser, (err) => {
            if(err.length > 0) {
                return res.render("register.ejs", {err_msg: err[0]})
            } else {

            sql.query(`INSERT INTO Naudotojai(Vardas, Elektroninis_pastas, Slaptazodis, Aprasas, Patirties_taskai,Salis, Trumpas_aprasas, Ugis, Svoris, Kalba, Plauku_spalva, Lytis, Akiu_spalva,  fk_lygis__id_lygis) 
                VALUES ('${newUser.name}', '${newUser.email}', '${newUser.password}', '${newUser.desc}', '0', '${newUser.country}', '${newUser.short_desc}', '${newUser.height}', '${newUser.width}', '${newUser.language}',' ${newUser.hair_col}', '${newUser.gender}', '${newUser.eye_col}','1')`);

            sql.query(`INSERT INTO roles(Data, Komentaras, Role, fk_Naudotojas__id_Naudotojas) 
                    VALUES (NOW(), 'Vartotojas uzsiregistravo', '2', LAST_INSERT_ID())`);
            
            const msg = ({
                from: "zaidimuportalas42069420@gmail.com",
                to: newUser.email,
                subject:"Sveikiname užsiregistravus prie mūsų portalo!",
                text:"Sveiki, džiugu jus matyti mūsų portale. Galite pasitvirtinti su šia nuoroda: http://localhost:5000/"
            });

            transporter.sendMail(msg, (error, info) => {
                if(error) {
                    console.log(error);
                }

                console.log(info);
            });
            return res.render("register.ejs", {err_msg: "Registracija sėkminga. Į jūsų el. paštą buvo išsiųstas laiška su patvirinimo nuoroda, tačiau galite prisijungti."});
            }
        });                    
    } catch(error) {
        console.log(error);
    }
}

let getCommentPage = (req,res) => {
    res.render("comment.ejs", {msg: ""});
}

let saveComment = (req, res) => {
    res.render("comment.ejs", {msg: "Operacija sekmingai atlikta."});
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
    updateUser: updateUser,
    powerUser: powerUser,
    getCommentPage: getCommentPage,
    saveComment: saveComment,
    logoutPage: logoutPage
}