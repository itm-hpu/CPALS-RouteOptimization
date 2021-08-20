class Order {
    constructor(orderData, type) {
        if (orderData != null) {
            this.id = orderData.id;
            this.sequence_id = orderData.sequence_id;
            this.order_sequence = orderData.order_sequence;
            this.tast_type = orderData.task_type;
            this.pick_time = orderData.pick_time;
            this.material_handling_time = orderData.material_handling_time;
            this.consumption_time = orderData.consumption_time;
            this.from_location = orderData.from_location;
            this.to_area = orderData.to_area;
            this.to_location = orderData.to_location;
            this.transfer_order_type = orderData.transfer_order_type;
            this.state = orderData.state;


        }
        else {
            this.state = "inactive";
        }

        this.type = type;
        this.polyline = new google.maps.Polyline({
         
        });;
        
    }

}


class OrderSequence {
    constructor(id, sequence) {
        this.id = id;
        this.sequence = sequence;
    }
}




async function getOrders() {

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


function groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
    }, {});
}



async function fetchOrderData() {


    var orderArray = await getOrders();
    var groupedArray = groupBy(orderArray, 'sequence_id');



    var objArray = [];
    Object.keys(groupedArray).forEach(key => objArray.push(

        new OrderSequence(key, groupedArray[key])
       ));


    for (var orderSequence of objArray) {
        var tmpArray = orderSequence.sequence;
        var output = [];

        var order = new Order(null, 'transport');
        order.from_location = null;
        order.to_location = orderArray[0].from_location;
        output.push(order);

        for (let i = 0; i < tmpArray.length; i++) {
            var order = new Order(tmpArray[i], 'order');
            output.push(order);
            if (tmpArray[i + 1] != undefined) {
                if (tmpArray[i].to_location != tmpArray[i + 1].from_location) {

                    var order = new Order(null, 'transport');
                    order.from_location = orderArray[i].to_location;
                    order.to_location = orderArray[i + 1].from_location;
                    output.push(order);

                }

            }
        }

        orderSequence.sequence = output;

    }




    return objArray;
}



