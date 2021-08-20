//document.getElementsByClassName('tablinks')[0].click()

//class ActiveOrder {
//    constructor(id) {
//        this.id = id;
//        this.startTime = null;
//        this.endTime = null;
//        this.distanceTraveled = null;
//        this.averageSpeed = null;
//        this.energyConsumption = null;
//    }

//}

//var sessionData;

var orderData;

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;

    if (evt.currentTarget.className.includes("active")) {
        document.getElementById(cityName).style.display = "none";
        evt.currentTarget.className.replace(" active", "");
        tablinks = document.getElementsByClassName("tablinks");

        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }

    else {
        

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab

        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
        //initOrders();


    }

    // Declare all variables
    
    
} 

async function initOrders() {


    orderData = {};

    var orderRaw = await getOrders();
    var orderSequences = await fetchOrderData();
    var completedOrderData = await getCompletedOrders();


    orderRaw = orderRaw.map(item => item = new Order(item, 'order'));

    orderData.allOrders = orderRaw;
    orderData.allCompletedOrders = completedOrderData;
    orderData.sequences = orderSequences;

    return orderData;

    //drawOrders(orderData);
    //initAddOrder(orderData);

}



async function initCompletedOrders() {
    console.log(orderData);
    drawCompletedOrders(orderData.allCompletedOrders);

}

async function initOrder() {
    drawOrders(orderData.allOrders);

}

async function initAddOrders() {
    initAddOrder(orderData.allOrders);

}






async function getCompletedOrders() {

    return await fetch('/getOrders', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET',
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        const orderData = JSON.parse(text);
        return orderData

    })
}

async function sendOrder(data) {

    return await fetch('/sendOrder', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function () {
        console.log("Order added");
        return
    })
}


async function getCompletedOrders() {

    return await fetch('/getCompletedOrders', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET',
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        const orderData = JSON.parse(text);
        return orderData

    })
}

function drawCompletedOrders(items) {

    var a = 0;
    const tablehead = document.getElementById("table2headrow");
    tablehead.innerHTML = '';
    
    for (let key of Object.keys(items[0])) {
        let header = tablehead.insertCell(a);
        header.innerHTML = key;
        a++;
    }


    const table = document.getElementById("table2body");
    table.innerHTML = '';
    items.forEach(item => {
        let row = table.insertRow();

        var i = 0;
        for (let value of Object.values(item)) {
            let date = row.insertCell(i);
            date.innerHTML = value;
            i++;
        }



    });

}

function drawOrders(items) {
    var a = 0;
    const tablehead = document.getElementById("table3headrow");
    tablehead.innerHTML = '';



    for (let key of Object.keys(items[0])) {
        let header = tablehead.insertCell(a);
        header.innerHTML = humanize(key);
        a++;
    }


    const table = document.getElementById("table3body");
    table.innerHTML = '';

    items.forEach(item => {
        let row = table.insertRow();

        var i = 0;
        for (let value of Object.values(item)) {
            let date = row.insertCell(i);
            date.innerHTML = value;
            i++;
        }



    });

}

function initAddOrder(items) {


    var a = 0;
    const form = document.getElementById("addOrderForm");
    form.innerHTML = '';


    form.onsubmit = function () {

        var elements = form.elements;
        var obj = {};
        for (var i = 0; i < elements.length; i++) {
            var item = elements.item(i);
            if (item.name != "") {
                obj[item.name] = item.value;
            }
            
        }

        sendOrder(obj);
        form.reset();
        return false;
    };

    for (let key of Object.keys(items[0]).slice(1)) {


        var div1 = document.createElement('div');
        div1.className = "addOrderFormDiv";

        var label1 = document.createElement('label');
        label1.className = "addOrderFormText";
        label1.innerHTML = humanize(key) + ": ";


        if (label1.innerHTML.includes("Time")) {
            var input1 = document.createElement('input');
            input1.type = "datetime-local";
            input1.className = "addOrderFormText";

        }

        else {
            var input1 = document.createElement('input');
            input1.type = "text";
            input1.className = "addOrderFormText";
        }

        
        input1.name = key;
        div1.appendChild(label1);
        div1.appendChild(input1);
        form.appendChild(div1);
        //field.innerHTML = a;
        a++;


    }

    var div2 = document.createElement('div');
    div2.className = "addOrderFormDiv";

    var x = document.createElement("INPUT");
    x.setAttribute("type", "submit");
    var resetForm = document.createElement("INPUT");
    resetForm.setAttribute("type", "reset");

    var div = document.createElement('div');
    div.style.height = "20px";

    div2.appendChild(x);
    div2.appendChild(resetForm);
    form.appendChild(div);
    form.appendChild(div2);


    //const table = document.getElementById("table4body");
    //items.forEach(item => {
    //    let row = table.insertRow();

    //    var i = 0;
    //    for (let value of Object.values(item)) {
    //        let date = row.insertCell(i);
    //        date.innerHTML = value;
    //        i++;
    //    }



    //});

}


function humanize(str) {
    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}