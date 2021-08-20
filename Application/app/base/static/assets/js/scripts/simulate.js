
var simulationArray = [];


class Simulation {
    constructor(order) {
        this.id = order.id;
        this.order = order;
        this.speed = 11;
        this.result = { path: null, distance: null, time: null};
    }

    setupSimulation() {
        console.log();

    }


    async runSimulation() {

        var from = findId(this.order.from_location).id;
        var to = findId(this.order.to_location).id;       
        var pathData = await getPath(from, to);
        

        this.result.path = pathData.path;
        this.result.distance = Math.round((pathData.distance * 1000) * 1e2) / 1e2;
        var time = this.result.distance / this.speed;
        this.result.time = Math.round(time * 1e2) / 1e2;

    }



}


function printSimulationResult() {

    var a = 0;
    var tablebody = document.getElementById("orderSimulationResultsBody");
    tablebody.innerHTML = '';



    //for (var value of Object.values(this.result)) {
    //    var cell = tablebody.insertCell(a);
    //    cell.innerHTML = value;
    //    a++;
    //}


    var totDistance = simulationArray.reduce(function (prev, cur) {
        return prev + cur.result.distance;
    }, 0);

    var totTime = simulationArray.reduce(function (prev, cur) {
        return prev + cur.result.time;
    }, 0);

    var totPath = simulationArray.reduce(function (prev, cur) {
        return prev + cur.result.path;
    }, 0);

    var Pathcell = tablebody.insertCell(0);
    Pathcell.innerHTML = totPath;

    var Disyancecell = tablebody.insertCell(1);
    Disyancecell.innerHTML = totDistance;

    var Timecell = tablebody.insertCell(2);
    Timecell.innerHTML = totTime;




    for (var i = 0; i < simulationArray.length; i++) {
        
        var simulation = simulationArray[i];
        console.log(simulation.result);
        drawPolylinePath(simulation.result, 0, simulation.order);
    }


    //console.log(simulationArray[0].order.polyline.getPath().getArray());

    var path = simulationArray[0].order.polyline.getPath().getArray();
    var center = path[Math.round((path.length - 1) / 2)];
    map.panTo(center);
}


function createSimulation(order) {
    var simulation = new Simulation(order);
    simulation.order.polyline = new google.maps.Polyline({});

    return simulation

}

async function initSimulateOrder() {


    //if (localStorage.getItem("prodSite") == 'scania') {
    //    mapID = "NodeNetworkScania";
    //    myLatlng = new google.maps.LatLng(59.181894, 17.637911);
    //}

    //else if (localStorage.getItem("prodSite") == 'kth') {
    //    myLatlng = new google.maps.LatLng(59.20195420643025, 17.62039849472319);
    //    mapID = "NodeNetworkKTHLab";
    //}
    

    ////mapID = "NodeNetworkScania";
    //nodeData = await fetchMapData();

    //mapData.nodes = nodeData;
    sessionData = await mainInit();
    drawNodes();
    drawEdges();

    console.log(orderData);
    var orderData = await getOrders();
    var orderDataFull = await fetchOrderData();
    orderDataFull = orderDataFull[0].sequence;
    orderDataFull.shift();
    console.log(orderData);
    console.log(orderDataFull)
    drawSimulationOrders(orderData, orderDataFull);
    drawSimulationMap();

}

function drawSimulationOrders(items, orderDataFull) {

    var a = 0;
    const tablehead = document.getElementById("orderSimulationTableHeader");
    tablehead.innerHTML = '';



    for (let key of Object.keys(items[0])) {
        let header = tablehead.insertCell(a);
        header.innerHTML = humanize(key);
        a++;
    }

    let header = tablehead.insertCell(a);
    //header.innerHTML = "ACTION";


    var btn2 = document.createElement("button");
    btn2.innerHTML = "Simulate All";
    btn2.className = "btn btn - primary";
    btn2.style.margin = "5px";
    btn2.addEventListener("click", simulateOnClickEventAll(orderDataFull));
    header.appendChild(btn2);


    const table = document.getElementById("orderSimulationTableBody");
    table.innerHTML = '';

    items.forEach(item => {
        let row = table.insertRow();

        var i = 0;
        for (let value of Object.values(item)) {
            let date = row.insertCell(i);
            date.innerHTML = value;
            i++;
        }

        //let action = row.insertCell(i);
        //action.innerHTML = "button";
        let header = row.insertCell(i);
        var btn = document.createElement("button");
        btn.innerHTML = "Simulate";
        btn.className = "btn btn - primary";
        btn.style.margin = "5px";
        btn.addEventListener("click", simulateOnClickEvent(row, items));
        header.appendChild(btn);
    });
}

function simulateOnClickEvent(row, items) {

    return async function () {
        for (var i = 0; i < simulationArray.length; i++) {
            simulationArray[i].order.polyline.setMap(null);
        }
        simulationArray = [];
        var simulation = createSimulation(items[row.rowIndex - 1]);
        await simulation.runSimulation();
        simulationArray.push(simulation);
        printSimulationResult();
    }

 
}

function simulateOnClickEventAll(items) {

    return async function () {
        for (var i = 0; i < simulationArray.length; i++) {
            simulationArray[i].order.polyline.setMap(null);
        }
        simulationArray = [];
        for (var i = 0; i < items.length; i++) {
            var simulation = createSimulation(items[i]);
            await simulation.runSimulation();
            simulationArray.push(simulation);
        }

        printSimulationResult();
        
    }


}

function drawSimulationMap() {
    document.getElementById('mapSimulation').innerHTML = "";
    map = getGoogleMap('mapSimulation');
}





    
