var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var dataaccess = dataaccess || {};
dataaccess.db = undefined;

dataaccess.provision = function (db) {
    db.serialize(function () {
        db.run("CREATE TABLE Event (id TEXT, name TEXT, date TEXT, ip TEXT)");
    });
}

var bootUp = function (name, provision_db) {
    var file = name;
    var exists = fs.existsSync(file);
    if (!exists) {
        console.log("Having to create DB " + name + " suggest provisioning schema?");
    }
    var db = new sqlite3.Database(file);
    if (!exists) {
        provision_db(db);
    }
    return {
        database: db
    };
};

dataaccess.bootup = function (file) {
    var result = bootUp("events.db", this.provision);
    var db = result["database"];
    this.db = db;
    //console.log(db);
    //console.log(this);
    return this.db != undefined;
};

dataaccess.get = function (back) {
    var self = dataaccess;
    var rowz = [];
    self.db.serialize(function () {
        self.db.all("SELECT * FROM Event order by date desc;", function (err, rows) {
            rowz = rows;
            back(rowz);
        });
    });
    return rowz;
};

dataaccess.top = function (number, back) {
    var self = dataaccess;
    var rowz = [];
    self.db.serialize(function () {
        self.db.all("SELECT * FROM Event order by date desc LIMIT " + number + ";", function (err, rows) {
            rowz = rows;
            back(rowz);
        });
    });
    return rowz;
};

dataaccess.push = function (obj) {
    var self = dataaccess;
    //console.log("this: " + self);
    //console.log(self.db);
    self.db.serialize(function () {
        self.db.run("INSERT INTO Event (id,name,date,ip) VALUES (?,?,?,?)", obj.id, obj.name, obj.date.getTime(), obj.ip);
    });
};

dataaccess.end = function () {
    this.db.close();
};

module.exports.dataaccess = dataaccess;