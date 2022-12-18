let getGamePage = (req, res ) => {
    return res.render("game.ejs");
};

module.exports = {
    getGamePage: getGamePage
}