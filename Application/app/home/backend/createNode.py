from kafka import KafkaConsumer
from haversine import haversine, Unit
import sys
import os
import json
import time



class Object:
    def __init__(self, objectID, longi, lati):
        self.object = objectID
        self.longitude = longi
        self.latitude = lati





def startNode(): 
# To consume latest messages and auto-commit offsets
    createNode = []
    
    
    consumer = KafkaConsumer('RTLS',
                         group_id='kafka-node-group',
                         bootstrap_servers=['130.237.3.249:9092'])

    
    for message in consumer:
        print("fffffffffffffffffff")
        print(message)
        print("kkkkkkkkkkkkkkkkkkkkkkkkkk")

        dictionary = json.loads(message.value.decode('utf-8'))
        objectID = dictionary["Object"]
        longitude = dictionary["Longitude"]
        latitude = dictionary["Latitude"]
        ID = Object(objectID, longitude, latitude)
        
        print(dictionary)

        vehicle = { 
            "vehicles": [{ 
                "name" : ID.object, 
                "coordinates" : [{'lng': ID.longitude, 'lat': ID.latitude}]
                }
            ]
        }

        print(vehicle)
        createNode.append([longitude, latitude])
        json_data = json.dumps(vehicle)
        
        
        return vehicle
        
    
        

    
      

        
    # consume earliest available messages, don't commit offsets
    KafkaConsumer(auto_offset_reset='earliest', enable_auto_commit=False)

    # consume json messages
    KafkaConsumer(value_deserializer=lambda m: json.loads(m.decode('utf-8')))

    # consume msgpack
    KafkaConsumer(value_deserializer=msgpack.unpackb)

    # StopIteration if no message after 1sec
    KafkaConsumer(consumer_timeout_ms=1000)

    # Subscribe to a regex topic pattern
    consumer = KafkaConsumer()
    consumer.subscribe(pattern='^awesome.*')



