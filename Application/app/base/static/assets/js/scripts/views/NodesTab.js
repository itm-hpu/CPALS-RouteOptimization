

//async function initNodes() {

//    var nodes = await getNodes1();
//    drawNodes(nodes);

//}



//async function initAddNodes() {

//    var nodes = await getNodes1();
//    initAddNode(nodes);

//}




//async function getNodes1() {

//    return await fetch('/createNetwork', {
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify('TestNodeNetworkScania'),
//        method: 'POST',
//    }).then(function (response) {
//        return response.text();
//    }).then(function (text) {
//        const nodeData1 = JSON.parse(text);
//        return nodeData1

//    })
//}



//async function sendNode1(data) {

//    return await fetch('/sendOrder', {
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        method: 'POST',
//        body: JSON.stringify(data)
//    }).then(function () {
//        console.log("Order added");
//        return
//    })
//}





//function drawNodes(items) {

//    var a = 0;
//    const tablehead = document.getElementById("table4headrow");
//    tablehead.innerHTML = '';



//    for (let key of Object.keys(items[0])) {
//        let header = tablehead.insertCell(a);
//        header.innerHTML = humanize(key);
//        a++;
//    }


//    const table = document.getElementById("table4body");
//    table.innerHTML = '';

//    items.forEach(item => {
//        let row = table.insertRow();

//        var i = 0;
//        for (let value of Object.values(item)) {
//            let date = row.insertCell(i);
//            date.innerHTML = value;
//            i++;
//        }



//    });

//}

//function initAddNode(items) {

//    var a = 0;
//    const form = document.getElementById("addOrderForm1");
//    form.innerHTML = '';


//    form.onsubmit = function () {

//        var elements = form.elements;
//        var obj = {};
//        for (var i = 0; i < elements.length; i++) {
//            var item = elements.item(i);
//            if (item.name != "") {
//                obj[item.name] = item.value;
//            }

//        }

//        sendOrder(obj);
//        form.reset();
//        return false;
//    };

//    for (let key of Object.keys(items[0]).slice(1)) {


//        var div1 = document.createElement('div');
//        div1.className = "addOrderFormDiv";

//        var label1 = document.createElement('label');
//        label1.className = "addOrderFormText1";
//        label1.innerHTML = humanize(key) + ": ";


//        if (label1.innerHTML.includes("Time")) {
//            var input1 = document.createElement('input');
//            input1.type = "datetime-local";
//            input1.className = "addOrderFormText1";

//        }

//        else {
//            var input1 = document.createElement('input');
//            input1.type = "text";
//            input1.className = "addOrderFormText1";
//        }


//        input1.name = key;
//        div1.appendChild(label1);
//        div1.appendChild(input1);
//        form.appendChild(div1);
//        //field.innerHTML = a;
//        a++;


//    }

//    var div2 = document.createElement('div');
//    div2.className = "addOrderFormDiv";

//    var x = document.createElement("INPUT");
//    x.setAttribute("type", "submit");
//    var resetForm = document.createElement("INPUT");
//    resetForm.setAttribute("type", "reset");

//    var div = document.createElement('div');
//    div.style.height = "20px";

//    div2.appendChild(x);
//    div2.appendChild(resetForm);
//    form.appendChild(div);
//    form.appendChild(div2);



//}


//function humanize(str) {
//    var i, frags = str.split('_');
//    for (i = 0; i < frags.length; i++) {
//        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
//    }
//    return frags.join(' ');
//}