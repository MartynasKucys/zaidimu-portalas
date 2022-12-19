const sql = require("../configs/connect.js");


const getFavoriteGroup = (req, res) => {


    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const currentURL = new URL(fullUrl);
    const searchParams = currentURL.searchParams;


    if (searchParams.get("id") === undefined) // todo temp 
        {userID = 1}
    else
        {var userID = searchParams.get("id")}



        sqlString = "select info.megstamiausiu_grupes.Pavadinimas as groupName,\
         info.megstamiausi_zaidimai.Ikelimo_data as date,\
          info.zaidimai.Pavadinimas as gameName,\
           info.megstamiausi_zaidimai.Eiles_numeris as nr,\
            info.megstamiausiu_grupes.id_Megstamiausiu_grupe as groupId,\
             info.zaidimai.id_Zaidimas as gameId\
        from info.megstamiausiu_grupes\
        left join info.megstamiausi_zaidimai\
        on info.megstamiausi_zaidimai.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe=  info.megstamiausiu_grupes.id_Megstamiausiu_grupe\
        left join info.zaidimai\
        on info.zaidimai.id_Zaidimas = info.megstamiausi_zaidimai.fk_Zaidimas__id_Zaidimas\
        where info.megstamiausiu_grupes.fk_Naudotojas__id_Naudotojas = "+userID+"\
        order by groupId, nr"


    sql.query(sqlString, function (err, results){

        // console.log(userID)
        // console.log(req.session.userID)
        
        sqlString = "select\
        info.megstamiausiu_grupes.Pavadinimas as groupName,\
        info.zaidimai.Pavadinimas as gameName,\
        info.megstamiausi_zaidimai.Eiles_numeris as nr,\
        info.zaidimai.id_Zaidimas as gameId,\
        info.megstamiausiu_grupes.id_Megstamiausiu_grupe as groupId,\
        info.megstamiausios_megstamiausiu_grupes.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe as otherGroupId,\
        info.megstamiausi_zaidimai.Ikelimo_data as data\
        \
        from info.megstamiausios_megstamiausiu_grupes\
        left join info.`megstamiausiu_grupes`\
        on info.megstamiausios_megstamiausiu_grupes.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe = info.megstamiausiu_grupes.id_Megstamiausiu_grupe\
        left join info.`megstamiausi_zaidimai`\
        on info.`megstamiausi_zaidimai`.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe = info.megstamiausiu_grupes.id_Megstamiausiu_grupe\
        left join info.`zaidimai`\
        on info.`zaidimai`.id_Zaidimas = info.megstamiausi_zaidimai.fk_Zaidimas__id_Zaidimas\
        \
        where info.megstamiausios_megstamiausiu_grupes.fk_Naudotojas__id_Naudotojas = "+userID+" \
        order by groupId, nr"






        sql.query(sqlString, function(err, other){


            if (req.session.userID == userID){

                // console.log({data: results, guest: false, otherFavorites:other})
                return res.render("favoriteGroup.ejs", {data: results, guest: false,userID:userID, otherFavorites:other})
            }else{
                // console.log({data: results, guest: true, userID:userID, otherFavorites:other})
                return res.render("favoriteGroup.ejs", {data: results, guest: true, userID:userID, otherFavorites:other, myID:req.session.userID })
            }


        })


    })


}


const addFavorite = (req, res) => {


    var grupeName = req.body.grupeName
    if (req.session.userID === undefined) // todo temp
        {userID = 1}
    else
        {var userID = req.session.userID}

    sqlString = "INSERT INTO info.megstamiausiu_grupes (Pavadinimas, fk_Naudotojas__id_Naudotojas)"
    +" VALUE ('"+ grupeName +"',"+ userID +")"

    // console.log(sqlString)
    sql.query(sqlString)

    

}

const removeFavoriteGame = (req, res) => {

    // console.log(req.body.gameId)

    values = req.body.gameId.split("|")


    sqlString = "delete from info.megstamiausi_zaidimai\
    where Eiles_numeris = "+ values[0] +" and fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe = " + values[1] 

    sql.query(sqlString)

}

const removeFavoriteGroup = (req, res) => {

    groupId = req.body.removeGroupButton

    sqlString = "delete FROM info.megstamiausi_zaidimai\
    where info.megstamiausi_zaidimai.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe =" + groupId


    sql.query(sqlString)



    sqlString = "delete FROM info.megstamiausios_megstamiausiu_grupes\
    where info.megstamiausios_megstamiausiu_grupes.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe =" + groupId


    sql.query(sqlString)





    sqlString = "delete from info.megstamiausiu_grupes\
    where info.megstamiausiu_grupes.id_Megstamiausiu_grupe = " + groupId


    sql.query(sqlString)

}


const addToFavoritesOtherGroup  = (req, res) =>{



    values = req.body.addToFavoritesOtherGroup.split("|")

    sqlString = "INSERT INTO `info`.`megstamiausios_megstamiausiu_grupes` (fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe, fk_Naudotojas__id_Naudotojas)\
    VALUES ("+values[0]+","+ values[1]+")"

    sql.query(sqlString)

}


const removeFavoriteOtherGroup = (req, res) =>{

    groupId = req.body.removeFavoriteOtherGroup

    sqlString = "DELETE from `info`.`megstamiausios_megstamiausiu_grupes` \
    where `info`.`megstamiausios_megstamiausiu_grupes`.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe="+groupId
    sql.query(sqlString)


}


const share = (req, res) =>{





}

const addFavoriteGameForm = (req, res) =>{




    values = req.query.gameId.split("|")

    gameId = values[0]
    userId = values[1]



    sqlString = "select info.megstamiausiu_grupes.Pavadinimas from info.megstamiausiu_grupes\
    where info.megstamiausiu_grupes.fk_Naudotojas__id_Naudotojas = " + userId


    sql.query(sqlString, function(err, results){

        console.log({gameId:gameId, userId:userId, name:results})

        res.render("favorite_create.ejs", {gameId:gameId, userId:userId, names:results})


    })


}



const addFavoriteGameToNewGroup = (req, res) =>{

    groupName = req.body.newGroup
    parts = req.body.data.split("|")
    gameId = parts[0]
    userId = parts[1]


    sqlString = "INSERT INTO `info`.`megstamiausiu_grupes` (Pavadinimas, fk_Naudotojas__id_Naudotojas)\
    VALUES ('"+ groupName+"',"+userId+")"

    sql.query(sqlString)


    sqlString = "select info.megstamiausiu_grupes.id_Megstamiausiu_grupe as id from info.megstamiausi_zaidimai \
    right join info.`megstamiausiu_grupes`\
    on info.`megstamiausiu_grupes`.id_Megstamiausiu_grupe = info.megstamiausi_zaidimai.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe\
    where info.megstamiausiu_grupes.Pavadinimas = '"+groupName+"' and info.megstamiausiu_grupes.fk_Naudotojas__id_Naudotojas =" +userId

    sql.query(sqlString, function (err, results){

        groupId = results[0]["id"]

        console.log(groupId)

        sqlString = "INSERT INTO `info`.`megstamiausi_zaidimai` (Eiles_numeris, fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe, fk_Zaidimas__id_Zaidimas)\
        VALUES (1, '"+groupId+"', "+gameId+" ) "
    
        sql.query(sqlString)


        res.redirect("/favoriteGroup?id="+userId)


    })



}


const addFavoriteGame = (req, res) =>{

    parts = req.body.data.split("|")
    gameId = parts[0]
    userId = parts[1]
    groupName = req.body.groupName

    
    sqlString = "select info.megstamiausiu_grupes.id_Megstamiausiu_grupe as id from info.megstamiausi_zaidimai \
    right join info.`megstamiausiu_grupes`\
    on info.`megstamiausiu_grupes`.id_Megstamiausiu_grupe = info.megstamiausi_zaidimai.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe\
    where info.megstamiausiu_grupes.Pavadinimas = '"+groupName+"' and info.megstamiausiu_grupes.fk_Naudotojas__id_Naudotojas =" +userId

    console.log(sqlString)

    sql.query(sqlString, function (err, results){
        console.log(results)


        sqlString = "select  max(info.megstamiausi_zaidimai.Eiles_numeris) as max from info.megstamiausi_zaidimai \
        right join info.`megstamiausiu_grupes`\
        on info.`megstamiausiu_grupes`.id_Megstamiausiu_grupe = info.megstamiausi_zaidimai.fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe\
        where info.megstamiausiu_grupes.Pavadinimas = '"+groupName+"' and info.megstamiausiu_grupes.fk_Naudotojas__id_Naudotojas =" +userId

        sql.query(sqlString, function(err, otherRes){


            console.log(otherRes)

    

            groupId = results[0]["id"]
            nr = otherRes[0]["max"]


            if (nr === null){
                nr= 1
            }else{
                nr++
            }

            sqlString = "INSERT INTO `info`.`megstamiausi_zaidimai` (Eiles_numeris, fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe, fk_Zaidimas__id_Zaidimas)\
            VALUES ("+nr+", '"+groupId+"', "+gameId+" ) "
        
            sql.query(sqlString)
    
    
            res.redirect("/favoriteGroup?id="+userId)


        })



    })



}



module.exports = {
    getFavoriteGroup:getFavoriteGroup,
    addFavorite: addFavorite,
    removeFavoriteGame: removeFavoriteGame,
    removeFavoriteGroup:removeFavoriteGroup,
    addToFavoritesOtherGroup:addToFavoritesOtherGroup,
    removeFavoriteOtherGroup:removeFavoriteOtherGroup,
    share:share,
    addFavoriteGameForm:addFavoriteGameForm,
    addFavoriteGameToNewGroup:addFavoriteGameToNewGroup,
    addFavoriteGame:addFavoriteGame
}