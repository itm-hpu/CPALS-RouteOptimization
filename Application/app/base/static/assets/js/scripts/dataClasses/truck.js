let icon_truck = {
    url: "static/assets/img/marker_blue_circle.png", // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(12.5, 12.5) // anchor
};


class ActiveOrder {
    constructor(order) {
        this.id = order.id;
        this.startTime = null;
        this.endTime = null;
        this.distanceTraveled = null;
        this.averageSpeed = null;
        this.energyConsumption = null;
        this.order = order;
    }

}





class Truck {
    constructor(id, position, orders) {
        this.id = id;
        this.position = position;
        this.orders = orders;
        this.activeOrder = null;
        this.marker = new google.maps.Marker({
            map: null,
            icon: icon_truck,
            title: id,
            position: position,
            //draggable: true,
            visible: true
        });
        this.visitedLatLng = [];
        this.closest = null;
        this.marker.addListener('position_changed', async () => {

            

            this.position = this.marker.getPosition();
            if (this.orders.length >= 1) {
                
                await playerMoveEvent(this);
            }
            


            

        });
        
        
        
    }
    getIcon() {   
        return icon_truck;
    }




    async storeOrder() {

        var output = this.activeOrder;
        output.order = null;
        output.truckID = this.id;

        //console.log(JSON.stringify(this.orders[0].sequence[0]));
        await fetch('/saveOrder', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(output)
        }).then(function () {

            console.log("Order stored");

        })


    }


}



async function getTrucks() {
    try {
        return await fetch(sessionData.variables.URL, {
            method: 'GET',
            headers: sessionData.variables.headers,
        })
            .then(response => response.json())
            .then(result => {
                return result;
            })
            .catch(error => {
                console.error('Error:', error);
            });


    }

    catch (err) {
        console.error('Error:', err);
    }

}
async function getTruckPosition(truckID) {
    var positionURL = sessionData.variables.URL;
    positionURL = positionURL.concat("/" + truckID + "/pos?")
    positionURL = positionURL.concat("max_age=60");
    return await fetch(positionURL, {
        method: 'GET',
        headers: sessionData.variables.headers,
    })
        .then(function (response) {
            if (response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then(response => response.json())
        .then(function (result) {
            return result;
        })

        .catch(error => {
            return;
        });
}


