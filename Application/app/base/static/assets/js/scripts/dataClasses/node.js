class Node {
    constructor(id,type,identifier,latitude,longitude) {
        this.id = id;
        this.type = type;
        this.identifier = identifier;
        this.latitude = latitude;
        this.longitude = longitude;
        this.edges = [];
        this.marker = null;
    }

}


async function fetchNodeData(mapID) {


    return await fetch('/createNetwork', {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mapID),
        method: 'POST',

    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        var nodeData = JSON.parse(text);

        return nodeData;


    })
}