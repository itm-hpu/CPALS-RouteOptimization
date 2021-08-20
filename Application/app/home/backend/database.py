
import os
import mysql.connector as database
import json
import geojson

username = "wajid"
password = "wajid"

#connection = database.connect(
#    user=username,
#    password=password,
#    host="130.237.3.249",
#    port="3306",
#    database="OrderDeliveryScheduler")

#cursor = connection.cursor()

def clear_data(id):
    try:
        connection = database.connect(
        user=username,
        password=password,
        host="130.237.3.249",
        port="3306",
        database="OrderDeliveryScheduler")

        cursor = connection.cursor()

        if id == 'NodeNetworkScania':
            statement = "DELETE FROM NodeNetworkScania"
        elif id == 'NodeNetworkKTHLab':
            statement = "DELETE FROM NodeNetworkKTHLab"
        
        cursor.execute(statement)

        connection.commit()
        print("Successfully added entry to database")
        connection.close()
    except database.Error as e:
        
        print(f"Error adding entry to database: {e}")

def add_data(nodeData):
    try:
        connection = database.connect(
        user=username,
        password=password,
        host="130.237.3.249",
        port="3306",
        database="OrderDeliveryScheduler")

        cursor = connection.cursor()
        print("_____________")
        print(nodeData['id'])
        print(nodeData['nodes'])
        print("_____________")

        id =  nodeData['id']
        nodes = nodeData['nodes']

        clear_data(id)

        if id == 'NodeNetworkScania':
            statement = "INSERT INTO NodeNetworkScania (id, type, identifier, latitude, longitude, edges) VALUES (%s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE id=values(id), type=values(type), identifier=values(identifier), latitude=values(latitude), longitude=values(longitude), edges=values(edges)"

        elif id == 'NodeNetworkKTHLab':
            statement = "INSERT INTO NodeNetworkKTHLab (id, type, identifier, latitude, longitude, edges) VALUES (%s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE id=values(id), type=values(type), identifier=values(identifier), latitude=values(latitude), longitude=values(longitude), edges=values(edges)"


        columns = ', '.join("" + str(x).replace('/', '_') + "" for x in nodes[0].keys())

        for node in nodes:
                    
                    values = ', '.join("" + str(x).replace('/', '_') + "" for x in node.values())
                    data = (node["id"], node["type"], node["identifier"], node["latitude"], node["longitude"], str(node["edges"])[1:-1])
                    cursor.execute(statement, data)

  
        connection.commit()
        print("Successfully added entry to database")
        connection.close()
    except database.Error as e:
        
        print(f"Error adding entry to database: {e}")

def add_order(orderData):

    try:
        connection = database.connect(
        user=username,
        password=password,
        host="130.237.3.249",
        port="3306",
        database="OrderDeliveryScheduler")

        cursor = connection.cursor()
        print("_____________")
        print(orderData)
        print("_____________")
        statement = "INSERT INTO CompletedOrders (OrderID, TruckID, StartTime,EndTime,Distance,AverageSpeed,EnergyConsumption) VALUES (%s, %s, %s, %s, %s, %s, %s)" 
        data = (orderData["id"],orderData["truckID"],orderData["startTime"],orderData["endTime"],orderData["distanceTraveled"],orderData["averageSpeed"],orderData["energyConsumption"])

        #statement = "INSERT INTO SiteMaps (SiteID, Description, jsonFile) VALUES (%s, %s, %s)"
        #data = (SiteID, desciption, jsonFile)
        cursor.execute(statement, data)
        connection.commit()
        print("Successfully added entry to database")
        connection.close()
    except database.Error as e:
        print(f"Error adding entry to database: {e}")


def get_data(id):
    try:
        connection = database.connect(
        user=username,
        password=password,
        host="130.237.3.249",
        port="3306",
        database="OrderDeliveryScheduler")

        cursor = connection.cursor()
        #statement = "SELECT SiteID, Description, jsonFile FROM SiteMaps WHERE SiteID = %s"
        statement = "SELECT SiteID, nodes, edges FROM SiteMaps WHERE SiteID = %s"
        data = (id,)
        cursor.execute(statement, data)
       
        for (SiteID, nodes, edges) in cursor:
            print(f"Successfully retrieved {SiteID},{nodes},{edges}")
            nodes = geojson.loads(nodes)
            edges = geojson.loads(edges)
            mapData = {"nodes":nodes, "edges":edges}
        connection.close()
        return mapData
    except database.Error as e:
        print(f"Error retrieving entry from database: {e}")

#add_data(1,"KTHLab", '{"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620406, 59.201959]}, "properties": {"ID": 35, "edges": [49]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620383, 59.201933]}, "properties": {"ID": 36, "edges": [47]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620365, 59.201954]}, "properties": {"ID": 37, "edges": [47]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620433, 59.201941]}, "properties": {"ID": 38, "edges": [48, 59]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620478, 59.201961]}, "properties": {"ID": 39, "edges": [51]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620481, 59.201974]}, "properties": {"ID": 40, "edges": [51]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620452, 59.201982]}, "properties": {"ID": 41, "edges": [50]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620434, 59.201987]}, "properties": {"ID": 42, "edges": [52]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620463, 59.202005]}, "properties": {"ID": 43, "edges": [55]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620482, 59.201998]}, "properties": {"ID": 44, "edges": [56]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620509, 59.20199]}, "properties": {"ID": 45, "edges": [57]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.62054, 59.20199]}, "properties": {"ID": 46, "edges": [57]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620398, 59.20194]}, "properties": {"ID": 47, "edges": [36, 37, 48]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620412, 59.201949]}, "properties": {"ID": 48, "edges": [38, 47, 49]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620419, 59.201954]}, "properties": {"ID": 49, "edges": [35, 48, 50]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620445, 59.201975]}, "properties": {"ID": 50, "edges": [41, 49, 51, 52]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620474, 59.201968]}, "properties": {"ID": 51, "edges": [39, 40, 50]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620424, 59.20198]}, "properties": {"ID": 52, "edges": [42, 50, 53]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620406, 59.201986]}, "properties": {"ID": 53, "edges": [52, 54]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620449, 59.202017]}, "properties": {"ID": 54, "edges": [53, 55]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.62047, 59.202011]}, "properties": {"ID": 55, "edges": [43, 54, 56]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620491, 59.202005]}, "properties": {"ID": 56, "edges": [44, 55, 57]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620517, 59.201998]}, "properties": {"ID": 57, "edges": [45, 46, 56]}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.620398, 59.201954]}, "properties": {"ID": 59, "edges": [38]}}]}')
#get_data(1)

#connection.close()


def get_nodes(SiteId):
    print(SiteId)
    try:
        output = []
        connection = database.connect(
        user=username,
        password=password,
        host="130.237.3.249",
        port="3306",
        database="OrderDeliveryScheduler")

        cursor = connection.cursor()
        #statement = "SELECT SiteID, Description, jsonFile FROM SiteMaps WHERE SiteID = %s"
        statement = "SELECT * FROM %s"  % (SiteId)
        cursor.execute(statement)

        desc = cursor.description
        column_names = [col[0] for col in desc]
        print(column_names)

        for data in cursor:
            edgearray = []
            print(f"Successfully retrieved {data}")
            results = list(item for item in data)
            print(results)
            results = dict(zip(column_names, results))
            #for i in results['edges']:
            #    edgearray.append(int(i))
            results['edges'] = list(map(int, results['edges'].split(",")))
            output.append(results)

        connection.close()


        return output
    except database.Error as e:
        print(f"Error retrieving entry from database: {e}")

def get_completed_orders():

    output = []
    connection = database.connect(
    user=username,
    password=password,
    host="130.237.3.249",
    port="3306",
    database="OrderDeliveryScheduler")

    cursor = connection.cursor()
    statement = "SELECT * FROM CompletedOrders ORDER BY EndTime DESC LIMIT 20"
    cursor.execute(statement)

    desc = cursor.description
    column_names = [col[0] for col in desc]


    for data in cursor:
        
        print(f"Successfully retrieved {data}")
        results = list(str(item) for item in data)

        output.append(dict(zip(column_names, results)))

    connection.close()

        
    return output


def get_orders():

    output = []
    connection = database.connect(
    user=username,
    password=password,
    host="130.237.3.249",
    port="3306",
    database="OrderDeliveryScheduler")

    cursor = connection.cursor()
    statement = "SELECT * FROM DeliveryOrders ORDER BY consumption_time DESC LIMIT 20"
    cursor.execute(statement)

    desc = cursor.description
    column_names = [col[0] for col in desc]

    for data in cursor:
        
        print(f"Successfully retrieved {data}")
        results = list(item for item in data)

        output.append(dict(zip(column_names, results)))

    connection.close()

        
    return output


def send_order(orderData):
    try:
        connection = database.connect(
        user=username,
        password=password,
        host="130.237.3.249",
        port="3306",
        database="OrderDeliveryScheduler")

        cursor = connection.cursor()

        statement = "INSERT INTO DeliveryOrders (transfer_order, part, part_description,consumption_time,pick_time,from_location,to_area, to_location, transfer_order_type) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)" 
        data = (orderData["transfer_order"],orderData["part"],orderData["part_description"],orderData["consumption_time"],orderData["pick_time"],orderData["from_location"],orderData["to_area"],orderData["to_location"],orderData["transfer_order_type"])

        cursor.execute(statement, data)
        connection.commit()
        print("Successfully added entry to database")
        connection.close()
    except database.Error as e:
        print(f"Error adding entry to database: {e}")