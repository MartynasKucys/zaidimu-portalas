function confirm() {
    var cnf = confirm("Ar norite palikti komentara?");
    if(cnf) {
        window.location.href = "/comment";
    }
}