var logr = {} || logr;

logr.BuildHostUrl = function () {
    var str = "http://" + document.location.hostname + ":" + document.location.port;
    return str;
};
logr.Log = function (id, item) {
    console.log("Logged: " + id + " " + item);
    var myUrl = this.BuildHostUrl() + "/log/" + id + " / " + item;
    console.log(myUrl);
    $.ajax({
        url: myUrl
    });
};