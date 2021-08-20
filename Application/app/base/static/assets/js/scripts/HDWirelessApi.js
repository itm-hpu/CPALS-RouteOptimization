

function initApi() {
    console.log("test");
    var signalR = require('signalr-client');
    var server = "http://xxxxxxx.hd-wireless.com:9000"
    var client = new signalR.client(
        server + "/signalr", ['objectPositionHub'], 10, true);

    client.headers['X-Authenticate-Token'] = 'xxxxxxxxxx@hd-wireless.com:20170209111428:l5vB5n/0R4mDwsXE8MlxN1uPZMo=';

    client.start();

    client.serviceHandlers.connected = function () {
        client.invoke("objectPositionHub", "subscribe", "00000010");
    }

    client.on(
        "objectPositionHub",
        "onEvent",
        function (p) { console.log(p); }
    );
}