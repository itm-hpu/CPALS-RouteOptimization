let map;
let markersPositionArray = [];
let edgePolylineArray = [];
let pathPolylineArray = [];
let polyline = null;
let edgePolyline = null;
let polylineClosest = null;
let polylineClosestNode = null;
let edgePath = null;
let pathPolyline = null;
let icon_node;
let icon_workstation;
var target;
var path;
var nodes;
var testmarker2;
var edges;
var listenerFn;
let lineSymbol;
var path_length = 0;
let testMarker = null;
var pathLength = 0;
var edgeData = [];
var filteredEdges = [];
var oldClosestEdge = null;
var oldClosest = 0;
var d0 = 0;
var closest = 0;
var multiPath = [];
var closestpath;
var truckObj = [];
var player;
var nodeData;
var closestPoint = null;
var subInterval;
var nodeVisibility = false;
var edgeVisibility = false;
var pathVisibility = true;
var pathVisibilityFirst = true;
var closesVisibility = false;
var stop = true;
var start = 0;
var activeTruck;


function getGoogleMap(divId) {
    map = new google.maps.Map(document.getElementById(divId), {
        center: sessionData.variables.myLatlng,
        zoom: sessionData.variables.mapZoom,
        disableDefaultUI: true,
        mapId: 'ab31ab3f3e4940c6',



    });


    return map;
}


async function fetchTruckData(orderData) {

    var truckArray = [];
    var truckIdArray = await getTrucks();

    for (let i = 0; i < truckIdArray.length; i++) {

        var truckData = await getTruckPosition(truckIdArray[i]);
        if (truckData != undefined) {
            var myLatlng = new google.maps.LatLng(truckData.Latitude, truckData.Longitude);
            var truck = new Truck(truckIdArray[i], myLatlng, [orderData[i]]) 
            truckArray.push(truck);
        }
    }
    var manual = new Truck("manual", myLatlng, [orderData[0]])
    manual.marker.setDraggable(true);

    truckArray.push(manual);

    return truckArray;
}

async function fetchMapData() {



    return await fetchNodeData(sessionData.variables.mapID).then(function (nodeData) {


        nodeData = nodeData.map(node => {
            var nodeObj = new Node(parseInt(node.id), node.type, node.identifier, parseFloat(node.latitude), parseFloat(node.longitude));
            nodeObj.edges = node.edges;

            return nodeObj
        })
        return nodeData;
    })
}




async function initMap() {

    console.log("NEW MAP");
    sessionData = await mainInit();

    mapData = {};
    edgePolylineArray = [];
    polyline = null;
    edgePolyline = null;
    polylineClosest = null;
    edgePath = null;
    pathPolyline = null;
    old_closest = -1;
    document.getElementById('map').innerHTML = "";

    icon_node = {
        url: "static/assets/img/marker_gray_circle.png", // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(12.5, 12.5) // anchor
    };

    icon_workstation = {
        url: "static/assets/img/marker_red_circle.png", // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(12.5, 12.5) // anchor
    };

    //map = new google.maps.Map(document.getElementById('map'), {
    //    center: sessionData.variables.myLatlng,
    //    zoom: sessionData.variables.mapZoom,
    //    disableDefaultUI: true,
    //    mapId: 'ab31ab3f3e4940c6',



    //});

    map = getGoogleMap('map');
    
    drawNodes();
    drawEdges();






    var btn2 = document.getElementById('showNodes');
    google.maps.event.addDomListener(btn2, 'change', function () {
        if (btn2.checked) {
            nodeVisibility = true;
            for (let i = 0; i < sessionData.nodes.length; i++) {
                sessionData.nodes[i].marker.setVisible(true);
            }

        } else {
            nodeVisibility = false;
            for (let i = 0; i < sessionData.nodes.length; i++) {
                sessionData.nodes[i].marker.setVisible(false);
            }
        }
    })

    var btn3 = document.getElementById('showEdges');
        
    google.maps.event.addDomListener(btn3, 'change', function () {
        if (btn3.checked) {
            edgeVisibility = true;
            for (let i = 0; i < edgePolylineArray.length; i++) {
                edgePolylineArray[i].polyline.setVisible(true);
            }

        } else {
            edgeVisibility = false;
            for (let i = 0; i < edgePolylineArray.length; i++) {
                edgePolylineArray[i].polyline.setVisible(false);
            }
        }
    })

    var btn4 = document.getElementById('showPathClosest');
    google.maps.event.addDomListener(btn4, 'change', function () {
        if (!btn4.checked) {
            pathVisibility = true;
            pathVisibilityFirst = true;
            //btn5.checked = true;
        } else {
            pathVisibility = false;
            pathVisibilityFirst = true;
            btn5.checked = false;

        }


        for (var i = 0; i < sessionData.orders.length; i++) {
            for (var j = 1; j < sessionData.orders[i].sequence.length; j++) {
                //console.log(mapData.orders[i].sequence[j]);
                sessionData.orders[i].sequence[j].polyline.setVisible(pathVisibility);
            }

        }

        sessionData.orders[0].sequence[0].polyline.setVisible(true);
        //pathVisibility = true;
        if (polylineClosestNode) {
            polylineClosestNode.setVisible(pathVisibilityFirst);
        }
        
    })


    var btn5 = document.getElementById('showPath');
    google.maps.event.addDomListener(btn5, 'change', function () {
        if (!btn5.checked) {
            pathVisibility = true;
            pathVisibilityFirst = true;
            //btn4.checked = true;

        } else {
            pathVisibility = false;
            pathVisibilityFirst = false;
            btn4.checked = false;

        }


        for (var i = 0; i < sessionData.orders.length; i++) {
            for (var j = 0; j < sessionData.orders[i].sequence.length; j++) {
                //console.log(mapData.orders[i].sequence[j]);
                sessionData.orders[i].sequence[j].polyline.setVisible(pathVisibility);
            }

        }


        if (polylineClosestNode) {
            polylineClosestNode.setVisible(pathVisibilityFirst);
        }


    })



    document.getElementById('nodeList').innerHTML = "";
    document.getElementById('distanceBox').innerHTML = 0 + ' meters';
    document.getElementById('timeBox').innerHTML = '00:00:00';
    
    
    const selectElement = document.getElementById("truckId");


    while (selectElement.options.length > 1) {
        selectElement.remove(0);
    }

    for (i = 0; i < sessionData.trucks.length; i++) { 
        //var dropdown = document.getElementById("truckId");
        var option = document.createElement("option");
        option.text = sessionData.trucks[i].id;
        option.value = sessionData.trucks[i].id;
        selectElement.add(option);
    }

    selectElement.removeEventListener('change', listenerFn, true);


    listenerFn = function () {
        const result = selectElement.value;
        //console.log(truckData);
        //console.log("CHANGE");
        for (var i = 0; i < sessionData.trucks.length; i++) {
            //console.log(truckData[i]);
            if (result == "manual" && sessionData.trucks[i].id == "manual") {
                activeTruck = sessionData.trucks[i];
                sessionData.trucks[i].marker.setMap(map);
                playerMoveEvent(sessionData.trucks[i]);
                initPath(sessionData.trucks[i]);
                clearInterval(subInterval);
            }


            else if (result == sessionData.trucks[i].id) {
                activeTruck = sessionData.trucks[i];
                sessionData.trucks[i].marker.setMap(map);
                playerMoveEvent(sessionData.trucks[i]);
                initPath(sessionData.trucks[i]);
                clearInterval(subInterval);
                subscribeToPosition(sessionData.trucks[i]);
            }
            else {
                sessionData.trucks[i].marker.setMap(null);
            }
        }



    }

    selectElement.addEventListener('change', listenerFn, true);

    for (i = 0; i < sessionData.nodes.length; i++) {


        var checkDiv = document.createElement('div');
        checkDiv.setAttribute("class", "form-check");


        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = sessionData.nodes[i].id;
        checkbox.name = sessionData.nodes[i].id;
        checkbox.class = 'form-check-input'

        var label = document.createElement('label')
        label.setAttribute("class", "form-check-label");
        label.appendChild(document.createTextNode(sessionData.nodes[i].id));

        var span = document.createElement('span');
        span.setAttribute("class", "form-check-sign");

        var spanCheck = document.createElement('span');
        spanCheck.setAttribute("class", "check");



        var col = document.createElement('div');
        col.setAttribute("class", "col");


        span.appendChild(spanCheck);
        label.appendChild(checkbox);
        label.appendChild(span);
        checkDiv.appendChild(label);
        col.appendChild(checkDiv);



        //____________________________________

        var slideDiv = document.createElement('div');

        var col2 = document.createElement('div');
        col2.setAttribute("class", "col");

        var label2 = document.createElement('label');
        label2.setAttribute("class", "switch small");


        var input = document.createElement('input');

        input.type = 'checkbox';
        input.checked = "true";
        input.id = "d" + sessionData.nodes[i].id;
        input.name = checkbox.name ;
        //input.value = "off";

        var sliderSpan = document.createElement('span');
        sliderSpan.setAttribute("class", "slider round small");


        label2.appendChild(input);
        label2.appendChild(sliderSpan);


        slideDiv.appendChild(label2);
        col2.appendChild(slideDiv);


        var container = document.getElementById('nodeList');
        var row = document.createElement('div');
        row.setAttribute("class", "row");


        var divider = document.createElement('div');
        divider.setAttribute("class", "divider");


        row.appendChild(col);
        row.appendChild(col2);

        var rowDiv = document.createElement('div');
        rowDiv.appendChild(row);
        container.appendChild(rowDiv);





    }

}


function subscribeToPosition(truck) {
    subInterval = setInterval(async function () {
        var posData = await getTruckPosition(truck.id);
        var latlng = new google.maps.LatLng(posData.Latitude, posData.Longitude);
        truck.marker.setPosition(latlng);
    }, 500);

}





async function initPath(truck) {
    var count;

    if (truck.orders[0].sequence[0].type == "order") {
        count = 2;
    }
    else {
        count = 1;
    }
    var index = 1;


    var filteredOrders = truck.orders[0].sequence.filter(function (value) {
        return value.type == "order"
    });


    for (var i = 0; i < sessionData.orders.length; i++) {
        for (var j = 0; j < sessionData.orders[i].sequence.length; j++) {
            sessionData.orders[i].sequence[j].polyline.setMap(null);
        }



        //truck.orders[i].polyline.setMap(null);

    }

    if (filteredOrders.length >= 3) {

        while (count <= 3) {
            var order = truck.orders[0].sequence[index];
            //console.log(order);

            var a = findId(order.from_location).id
            var b = findId(order.to_location).id

            //var a = order.from_location;
            //var b = order.to_location;


            var tmpPath = await getPath(a, b);
            drawPolylinePath(tmpPath, count, order);

            if (order.type != "transport") {

                count++;
                
            }



            index++;
            
        }

    }
    else {
        while (index < truck.orders.length) {
            var order = truck.orders[0].sequence[index];
            var a = findId(order.from_location).id
            var b = findId(order.to_location).id

            var tmpPath = await getPath(a, b);

            drawPolylinePath(tmpPath, count, order);

            if (order.type != "transport") {
                count++;
            }

            index++;
        }
    }

    pathPolylineArray.unshift(null);

    return;

}


function filterArrayTwobyOne(array) {

    var seen = [];
    var final = [];

    for (i = 0; i < array.length; i++) {
        var unseen = true;
        for (j = 0; j < seen.length; j++) {
            if ((seen[j][0] == array[i][0].id && seen[j][1] == array[i][1].id) || (seen[j][0] == array[i][1].id && seen[j][1] == array[i][0].id)
            ) {
                unseen = false;
            }
        }
        if (unseen) {
            final.push(array[i]);
            seen.push([array[i][0].id, array[i][1].id]);
        }
    }
    return final
}



function drawNodes() {
    console.log(sessionData);
    for (i = 0; i < sessionData.nodes.length; i++) {
        addMarker(sessionData.nodes[i]);
    }
}


function drawEdges() {


    lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3
    };

    for (i = 0; i < edgePolylineArray.length; i++) {
        edgePolylineArray[i].polyline.setMap(null); 
    }
    edgePolylineArray = [];
    
    for (i = 0; i < sessionData.nodes.length; i++) {

        var from = sessionData.nodes[i].marker.position;
        var from_id = sessionData.nodes[i].id;

        for (j = 0; j < sessionData.nodes[i].edges.length; j++) {
            
            var toObj = sessionData.nodes.find(element => element.id == sessionData.nodes[i].edges[j]);
            var to_id = toObj.id;
            to = toObj.marker.position;
            

            edgePath = [{ lat: from.lat(), lng: from.lng() },
            { lat: to.lat(), lng: to.lng() }];

            edgePolyline = new google.maps.Polyline({
                map: map,
                path: edgePath,
                strokeColor: 'gray',
                visible: edgeVisibility,
                icons: [
                    {
                        icon: lineSymbol,
                        offset: "100%",
                    }]
                //strokeOpacity: 0.4

            });

            //edgeData.polyline = edgePolyline;
            edgePolylineArray.push({ fromto: [sessionData.nodes[i], toObj], polyline: edgePolyline});


        }








    }

    //console.log(edgePolylineArray);
    

}

async function saveNodes() {

    var container = {};
    var nodeDataOutput = sessionData.nodes;
    nodeDataOutput = nodeDataOutput.map(node => {
        delete node.marker;
        return node;
    });

    container.id = sessionData.variables.mapID;
    container.nodes = nodeDataOutput;

    //console.log(container);

    await fetch('/saveNetwork', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(container)
    }).then(function () {

        console.log("Nodes updated");
        initMap();
    })
    

}


async function getPath(tx, rx) {
    
    var tmpArray = [tx, rx];
    return await fetch('/getPath', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tmpArray)
    })
        .then(function (response) {
            if (response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then(response => response.json())
        .then(function (result) {
            var path = result.path;
            var path_length = result.path_length;

            if (path.length == 0) {
                alert("ERROR\nNo path to "+rx);
            }

            return { 'path': path, 'distance': path_length };
        })

        .catch(error => {
            //console.error('Error:', error);
            return;
        });
}


function formData() {

    formDataArray = [];
    for (i = 0; i < document.forms["myForm"].length; i++) {
        if (document.forms["myForm"][i].type == "checkbox") {


            formDataArray.push({
                id: parseInt(document.forms["myForm"][i].id),
                checked: document.forms["myForm"][i].checked,
                direction: document.forms["myForm"][i+1].checked
            });

            i = i + 1;
           
        }
    }

    var result = formDataArray.filter(function (data) {
        return data.checked == true;
    });



    addNode(result)
}


function addNode(formDataArray) {

    let max = 0;
    sessionData.nodes.forEach(node => {
        if (parseInt(node.id) > max) {
            max = parseInt(node.id);
        }
    });

    let id = max + 1;

    var node = new Node(id, "trasportNode",null, map.getCenter().lat(), map.getCenter().lng());


    node.marker = null;

    console.log(node);

    for (i = 0; i < formDataArray.length; i++) {
        node.edges.push(formDataArray[i].id);

        if (formDataArray[i].direction) {
            var y = sessionData.nodes.find(node => node.id == formDataArray[i].id);
            y.edges.push(node.id);
        }
    }

    sessionData.nodes.push(node);
    console.log(sessionData.nodes);
    addMarker(node);

    drawEdges();

}

function deleteNode(marker) {


    marker.setMap(null);
    sessionData.nodes = sessionData.nodes.filter(function (value) {
        return value.marker != marker;

    });

    var title = marker.getTitle();

    sessionData.nodes.forEach(node => {
        node.edges = node.edges.filter(edge => edge != title);
    });




    drawEdges();

}




function addMarker(node) {

    var icon;
    var text;

    if (node.type == "WorkStation") {
        icon = icon_workstation;
    }
    else {
        icon = icon_node;
    }

    if (node.identifier) {
        text = node.identifier;
    }

    else {
        text = node.id.toString()
    }


    let marker = new google.maps.Marker({
        map: map,
        icon: icon,
        position: { lat: node.latitude, lng: node.longitude },
        draggable: true,
        title: text,
        label: node.id.toString(),
        visible: nodeVisibility,
    });

    marker.addListener('position_changed', function () {
        //node.LatLng = marker.getPosition();
        node.latitude = marker.position.lat();
        node.longitude = marker.position.lng();
        drawEdges();
    });

    marker.addListener('rightclick', function () {
        deleteNode(marker);
    });

    node.marker = marker;
    
}

function drawPolylineClosestNode(player, closest, truck) {
    var color; 

    var pathLineSymbol = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 2,
        strokeOpacity: 0.5,
        fillOpacity: 0.5
    };

    if (truck.orders[0].sequence[0].type == "transport") {
        color = "gray";
    }
    else {
        color = "green";
    }

    if (polylineClosestNode !== null) {
        polylineClosestNode.setMap(null);
    }

    var pathToClosestNode = [player, closest]

    polylineClosestNode = new google.maps.Polyline({
        map: map,
        path: pathToClosestNode,
        //strokeWeight: 5,
        strokeOpacity: 0,
        //strokeOpacity: 1,
        strokeColor: color,
        visible: pathVisibilityFirst
,
        
        icons: [
            {
                icon: pathLineSymbol,
                offset: '0',
                repeat: '20px',
            }],
        zIndex: 10

    });


}

function drawPolylineClosest(player, closest) {
    var pathLineSymbol = {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity: 0.75,
        scale: 3
    };

    if (polylineClosest !== null) {
        polylineClosest.setMap(null);
    }

    var pathToClosest = [player, closest]

    polylineClosest = new google.maps.Polyline({
        map: map,
        path: pathToClosest,
        //strokeWeight: 5,
        strokeOpacity: 0,
        //strokeOpacity: 1,
        strokeColor: 'green',
        icons: [
            {
                icon: pathLineSymbol,
                offset: '0',
                repeat: '20px',
            }],
        zIndex: 5

    });


}

function drawPolylinePath(path, order, orderData) {

    var pathPositionArray = [];
    var color;
    var zLayer;



    orderData.polyline.setMap(null);
    for (i = 0; i < path.path.length; i++) {
        var p = sessionData.nodes.find(element => element.id == path.path[i]);
        pathPositionArray.push(p.marker.getPosition());

    }

    var pathLineSymbol = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        //fillOpacity: 0.75,
        scale: 2,
        strokeOpacity: 0.5,
        fillOpacity: 0.5
    };

    if (order == 0 || order == 1) {
        color = 'green';
        zLayer = 7;
    }

    if (order == 2) {
        color = 'orange';
        zLayer = 5;
    }

    if (order == 3) {
        color = 'red';
        zLayer = 4;
    }

    if (orderData.type == "transport") {
        color = 'gray';
        zLayer = 6;

    }

    if (order == 0) {
        pathVis = pathVisibilityFirst;
    }

    else {
        pathVis = pathVisibility;
    }



    orderData.polyline = new google.maps.Polyline({
        map: map,
        path: pathPositionArray,
        //strokeWeight: 5,
        strokeOpacity: 0,
        //strokeOpacity: 1,
        visible: pathVis,
        strokeColor: color,
        icons: [
            {
                icon: pathLineSymbol,
                offset: '0',
                repeat: '30px'
            }],
        zIndex: zLayer
    });


}





function project(p, edge) {

    var a = edge.polyline.getPath().getAt(0);
    var b = edge.polyline.getPath().getAt(1);
    
    //https://jsfiddle.net/shishirraven/4dmjh0sa/

    var atob = { x: b.lat() - a.lat(), y: (b.lng() - a.lng())/2 };
    var atop = { x: p.lat() - a.lat(), y: (p.lng() - a.lng())/2 };
    var len = atob.x * atob.x + atob.y * atob.y;
    var dot = atop.x * atob.x + atop.y * atob.y;
    var t = Math.min(1, Math.max(0, dot / len));



    var point = {
        x: a.lat() + atob.x * t,
        y: a.lng() + atob.y*2 * t
    };

    var testPoint = new google.maps.LatLng(point.x, point.y);




    var d = google.maps.geometry.spherical.computeDistanceBetween(p, testPoint, 6371);

    return { 'point': testPoint, 'd': d}

}

function findClosestEdge(truck) {

    if (closestPoint == null) {
        icon_player = {
            url: "static/assets/img/marker_blue_circle.png", // url
            scaledSize: new google.maps.Size(25, 25), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(12.5, 12.5) // anchor
        };

        testmarker2 = new google.maps.Marker({
            map: map,
            icon: icon_player,
            draggable: false,
            title: "test",
            visible: true,
        });


    }

    var oldClosest = 9999999999;
    var position = truck.marker.getPosition();

    for (var k = 0; k < edgePolylineArray.length; k++) {
        var tmpEdgeData = project(position, edgePolylineArray[k]);
        if (oldClosest > tmpEdgeData.d) {
            oldClosest = tmpEdgeData.d;
            closestPoint = tmpEdgeData.point;
            closestEdge = edgePolylineArray[k];
        }
    }

    testmarker2.setPosition(closestPoint);
    return { 'point': closestPoint, 'd': oldClosest, 'edge': closestEdge }

}


async function playerMoveEvent(truck) {


    map.panTo(truck.marker.getPosition());
    if (!truck.activeOrder && truck.orders[0].sequence[0].type != "transport") {
        truck.activeOrder = new ActiveOrder(truck.orders[0].sequence[0]);
        truck.activeOrder.startTime = new Date;
    }

    truck.visitedLatLng.push(truck.marker.getPosition());


    var e = document.getElementById("speed");
    var speed = e.value;

    var closestEdge = findClosestEdge(truck);
    //var path = await updatePath(truck, closestEdge);
    //console.log(closestEdge);


    if (oldClosestEdge == null) {
        oldClosestEdge = closestEdge;
        path = await updatePath(truck, closestEdge);
        //drawPolylinePath(path.path, 0, null);
    }

    else {
        if (oldClosestEdge.edge.fromto != closestEdge.edge.fromto || oldClosestEdge.edge.fromto.reverse() != closestEdge.edge.fromto) {
            oldClosestEdge = closestEdge;
            path = await updatePath(truck, closestEdge);
            //drawPolylinePath(path.path, 0, null);


        }

    }

    drawPolylineClosestNode(closestEdge.point, path.node.marker.getPosition(), truck);

    d0 = path.path.distance;
    var d2 = google.maps.geometry.spherical.computeDistanceBetween(closestEdge.point, path.node.marker.getPosition(), 6371);
    var totDistance = (d0 + d2) * 1000;
    //var time = new Date(totDistance / speed *3600*1000).toISOString().substr(11, 8);
    document.getElementById('distanceBox').innerHTML = (totDistance).toFixed(2) + ' meters';
    //document.getElementById('timeBox').innerHTML = time;


    if (totDistance < sessionData.variables.distanceThreshold && Date.now() > 20000 + start) {
        start = Date.now();
        $('#myModal').modal();
        
    }

    return;
}


async function updatePath(truck, closestEdge) {
    var closest;
    var closestpath;

    var a = closestEdge.edge.fromto[0];
    var b = closestEdge.edge.fromto[1];


    var destination = findId(truck.orders[0].sequence[0].to_location).id


    var tmppathData0 = await getPath(a.id, destination);
    var tmppathData1 = await getPath(b.id, destination);


    if (tmppathData0.path.length <= tmppathData1.path.length) {
        closest = a;
        closestpath = tmppathData0;
    }
    else {
        closest = b;
        closestpath = tmppathData1;
    }

    truck.closest = closest;
    if (truck.orders[0].sequence[0].from_location == null) {
        truck.orders[0].sequence[0].from_location = closest.id;
    }
    
    truck.orders[0].sequence[0].state = "active";


    drawPolylinePath(closestpath, 0, truck.orders[0].sequence[0]);

    return { path: closestpath, node: closest };
}



function dismissArrivalState() {
    console.log('dismiss');
}

function approveArrivalState() {
    var truck = activeTruck;
    console.log("Order Complete");
    if (truck.orders[0].sequence[0].type != "transport") {
        storeOrderDetails(truck);
    }
    truck.orders[0].sequence.shift();
    truck.closest = null;
    oldClosestEdge = null;







    if (truck.orders[0].sequence.length > 1) {
        initPath(truck);
        playerMoveEvent(truck);
    }

    else if (truck.orders[0].sequence.length == 1) {
        for (var i = 0; i < truck.orders[0].sequence.length; i++) {
            truck.orders[0].sequence[i].polyline.setMap(null);

        }
        initPath(truck);
        playerMoveEvent(truck);
    }

    else {
        for (var i = 0; i < truck.orders[0].sequence.length; i++) {
            truck.orders[0].sequence[i].polyline.setMap(null);

        }
        //polylineClosest.setMap(null);
        polylineClosestNode.setMap(null);
    }
    

    return;
}

function storeOrderDetails(truck) {

    var visitedLatLngLength = google.maps.geometry.spherical.computeLength(truck.visitedLatLng);
    visitedLatLngLength = visitedLatLngLength.toFixed(2);

    console.log(truck);

    truck.activeOrder.endTime = new Date;
    truck.activeOrder.distanceTraveled = visitedLatLngLength;

    var timeDiff = truck.activeOrder.endTime - truck.activeOrder.startTime; //in ms
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff);
    truck.activeOrder.averageSpeed = truck.activeOrder.distanceTraveled / seconds;

    truck.storeOrder();
    truck.visitedLatLng = [];
    truck.activeOrder = null;

}


function findId(identifier) {
    var x = sessionData.nodes.find(node => node.identifier == identifier);
    return x;
}