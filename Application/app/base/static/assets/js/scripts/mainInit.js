

mainInit().then((value) => {
    console.log(value);
    sessionData = value;
    
    // expected output: "Success!"
});



//initOrders().then((value) => {
//    console.log(value);
//    orderData = value;

//    // expected output: "Success!"
//});






async function mainInit() {
    var data = {};
    sessionData = await setSessionVariables(data);
    sessionData = await setSessionData(sessionData);
    console.log(sessionData);

    return sessionData;
}


function setSessionVariables(data) {
    data.variables = {};
    data.variables.prodSite = localStorage.getItem("prodSite");

    if (data.variables.prodSite == 'scania') {
        data.variables.URL = 'https://p184-geps-production-api.hd-rtls.com/objects'
        data.variables.headers = {
            "Accept": "application/json",
            "X-Authenticate-User": "cpal",
            "X-Authenticate-Password": "cpal"
        }
        data.variables.myLatlng = new google.maps.LatLng(59.181894, 17.637911);
        data.variables.mapID = "NodeNetworkScania";
        data.variables.distanceThreshold = 10;
        data.variables.mapZoom = 22;
    }

    else if (data.variables.prodSite == 'kth') {

        data.variables.URL = 'https://p186-geps-production-api.hd-rtls.com/objects';
        data.variables.headers = {
            "Accept": "application/json",
            "X-Authenticate-User": "KTH",
            "X-Authenticate-Password": "!Test4KTH"

        }
        data.variables.myLatlng = new google.maps.LatLng(59.20195420643025, 17.62039849472319);
        data.variables.mapID = "NodeNetworkKTHLab";
        data.variables.distanceThreshold = 1;
        data.variables.mapZoom = 22;
    }

    return data;
}


async function setSessionData(data) {


    var orderData = await fetchOrderData();
    var nodeData = await fetchMapData();
    var truckData = await fetchTruckData(orderData);

    data.orders = orderData;
    data.nodes = nodeData;
    data.trucks = truckData;

    return data;

}
