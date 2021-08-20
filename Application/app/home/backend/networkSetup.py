
#import numpy as np
#from haversine import haversine, Unit
#from app.home.backend.networkGraph import *
#import json
#import geojson
#import sys
#import os

#positions = []
#network = Network()


#def createNetwork(str):
#    network = Network()

#    with open(os.path.join(str)) as json_file:
#        data = geojson.load(json_file)
#        for p in data['features']:
#            ID = p.properties['ID']
#            edges = p.properties['edges']
#            pos = tuple(p.geometry.coordinates)
#            network.addNode(ID, pos)


#        for k in data['features']:
#            ID = k.properties['ID']
#            edges = k.properties['edges']
    
#            pos = tuple(k.geometry.coordinates)
#            for i in edges:
#                network.addEdge(ID, i, haversine(pos,network.G.nodes[i]['pos']))


#    pos_list = [el[1] for el in network.G.nodes(data = 'pos', default=None)]
#    edge_list = [e for e in network.G.edges]

#    result = list(map(lambda x, y: {'id': x, 'pos': y}, network.G.nodes, pos_list))

#    data = {'data': result, 'edges': edge_list }
#    print("1",network.G.nodes)
#    return data





#def getPath(a,b):  
#    print("2",network.G.nodes)
#    path = network.findPath(a,b)
#    return path
