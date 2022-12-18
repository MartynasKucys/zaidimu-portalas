const { app } = require("firebase-admin");
const sql = require("../configs/connect.js");



const getFavoriteGroup = (req, res) => {


    var userID = 1 // TODO userID 

    // sqlString = 'SELECT * FROM info.megstamiausiu_grupes WHERE fk_Naudotojas__id_Naudotojas = '+userID

    sqlString = "select info.megstamiausiu_grupes.Pavadinimas as groupName, info.megstamiausi_zaidimai.Ikelimo_data as date, info.zaidimai.Pavadinimas as gameName, info.megstamiausi_zaidimai.Eiles_numeris as nr, info.megstamiausiu_grupes.id_Megstamiausiu_grupe as groupId, info.zaidimai.id_Zaidimas as gameId\
    from info.megstamiausiu_grupes\
    left join info.megstamiausi_zaidimai\
    on info.megstamiausi_zaidimai.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe=  info.megstamiausiu_grupes.id_Megstamiausiu_grupe\
    left join info.zaidimai\
    on info.zaidimai.id_Zaidimas = info.megstamiausi_zaidimai.fk_Zaidimas__id_Zaidimas\
    where info.megstamiausiu_grupes.fk_Naudotojas__id_Naudotojas = "+userID+"\
    order by groupId, nr"

  sql.query(sqlString, function (err, results){


    return res.render("favoriteGroup.ejs", {data: results})

    })

}


const addFavorite = (req, res) => {


    var grupeName = req.body.grupeName
    var userID = 1 // TODO userID

    sqlString = "INSERT INTO info.megstamiausiu_grupes (Pavadinimas, fk_Naudotojas__id_Naudotojas)"
    +" VALUE ('"+ grupeName +"',"+ userID +")"

    // console.log(sqlString)
    sql.query(sqlString)

    

}

const removeFavoriteGame = (req, res) => {

    console.log(req.body.gameId)

    values = req.body.gameId.split("|")


    sqlString = "delete from info.megstamiausi_zaidimai\
    where Eiles_numeris = "+ values[0] +" and fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe = " + values[1] 

    sql.query(sqlString)

}



module.exports = {
    getFavoriteGroup:getFavoriteGroup,
    addFavorite: addFavorite,
    removeFavoriteGame: removeFavoriteGame
}