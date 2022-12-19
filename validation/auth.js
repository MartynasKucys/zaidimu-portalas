const sql = require("../configs/connect.js")

module.exports = {
    checkRegister:
        function checkRegister(fields , err) {


            sql.query(`Select * FROM Naudotojai Where Vardas='${fields.name}' or Elektroninis_pastas='${fields.email}'`, (error, res) => {
                if(error) {
                    return console.log(err);
                }
                let errors = [];
                if(res.length > 0) {
                    errors.push("Toks vartotojas jau egzistuoja!");
                }

                console.log(fields);
                if(!fields.name || !fields.password || !fields.email || !fields.language || !fields.height || !fields.width || !fields.hair_col || !fields.eye_col || !fields.gender || !fields.short_desc || !fields.desc || !fields.country) {
                    errors.push("Visi laukeliai privalo buti uzpildyti !")
                }
                return err(errors);
            });
        

        }
}