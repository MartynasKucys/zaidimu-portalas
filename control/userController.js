let getLoginPage = (req, res) =>  {
    return res.render("login.ejs");
};

let getRegisterPage = (req, res ) => {
    return res.render("register.ejs");
};

module.exports = {
    getLoginPage: getLoginPage,
    getRegisterPage: getRegisterPage
}