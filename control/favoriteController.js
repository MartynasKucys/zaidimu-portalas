const sql = require("../configs/connect.js");



const getFavoriteGroup = (req, res) => {
    return res.render("favoriteGroup.ejs")
}


const addFavorite = (req, res) => {


    var grupeName = req.body.grupeName
    var userID = 1 // TODO userID

    sqlString = "INSERT INTO info.megstamiausiu_grupes (Pavadinimas, fk_Naudotojas__id_Naudotojas)"
    +" VALUE ('"+ grupeName +"',"+ userID +")"

    console.log(sqlString)
    sql.query(sqlString)


}



module.exports = {
    getFavoriteGroup:getFavoriteGroup,
    addFavorite: addFavorite
}