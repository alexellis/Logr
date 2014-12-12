var express = require('express');
var app = express();
var server = require('http').createServer(app);
var dataaccess = require('./dataaccess').dataaccess;

server.listen(3000);

var end = function () {
    dataaccess.end();
    process.exit(1);

};
process.on('SIGINT', end);

dataaccess.bootup("events.db");

app.use(express.static(__dirname + '/public'));

function logdb(dataaccess) {
    this.data_access = dataaccess;
}

logdb.prototype.top = function (count, back) {
    return this.data_access.top(count, back);
};

logdb.prototype.log = function (item) {
    this.data_access.push(item);
};

logdb.prototype.get = function (back) {
    return this.data_access.get(back);
};

var logdb1 = new logdb(dataaccess);

function Item(id, name, date, ip) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.ip = ip;
}

function toDateTime(secs) {
    var t = new Date();
    t.setTime(secs);
    return t;
}

app.get('/top/:number/', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    var numberInput = req.params.number;
    var limitNumber = parseInt(numberInput);

    var callb = function (values) {

        var list = values;
        var content = "";
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                content = content + "<li>@" + toDateTime(list[i].date).toLocaleTimeString() + " " + list[i].id + " " + list[i].name + " - from - " + list[i].ip + "</li>";
            }
        } else {
            content = "<li>No items logged yet."
        }

        res.write("<html><body><h3>Listing all events logged</h3>" +
            "<ul>" + content + "</ul>" +
            "</body></html>");
        res.end();
    };
    logdb1.top(limitNumber, callb);
});

app.get('/list/', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    var back = function (list) {
        var content = "";
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                content = content + "<li>@" + toDateTime(list[i].date).toLocaleTimeString() + " " + list[i].id + " " + list[i].name + " - from - " + list[i].ip + "</li>";
            }
        } else {
            content = "<li>No items logged yet."
        }

        res.write("<html><body><h3>Listing all events logged</h3>" +
            "<ul>" + content + "</ul>" +
            "</body></html>");
        res.end();
    };

    logdb1.get(back);
});

app.get('/log/:id/:name', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/json'
    });
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var dateNow = new Date();
    var item = new Item(req.params.id, req.params.name, dateNow, ip);
    logdb1.log(item);
    console.log("Item logged from ip " + ip);
    res.write(JSON.stringify({
        status: 'logged',
        ip: ip,
        now: dateNow.getTime()
    }));
    res.end();
});