
import networkx as nx
import numpy as np
from haversine import haversine, Unit
import json
import geojson
import sys
import os


class Network():

    def __init__(self):
        self.G = nx.DiGraph()



    def findPath(self, tx, rx):
        

        try:
            sp = nx.dijkstra_path(self.G, source = tx, target = rx)
            length = nx.dijkstra_path_length(self.G, source = tx, target = rx)
            return sp , length
        except:
            return False

    def getNodes(self):
        return self.G.nodes

    def addNode(self, id, pos):
        self.G.add_node(id, pos = pos)

    def addEdge(self, tx, rx, weight):
        self.G.add_edge(tx, rx, weight = weight)

    def generateNetwork(self, mapData):
        print("mapdata", mapData)
        self.G = nx.DiGraph()
        data = mapData
        for p in data['nodes']:
            ID = p['ID']
            #edges = p.properties['edges']
            pos = (p['pos']['lng'], p['pos']['lat'])
            self.addNode(ID, pos)


        for k in data['edges']:
            ID = k[0]
            #edges = k.properties['edges']
    
            #pos = tuple(k.geometry.coordinates)
            self.addEdge(k[0], k[1], haversine(self.G.nodes[k[0]]['pos'],self.G.nodes[k[1]]['pos']))
            #for i in edges:
            #    self.addEdge(ID, i, haversine(pos,self.G.nodes[i]['pos']))


        pos_list = [el[1] for el in self.G.nodes(data = 'pos', default=None)]
        edge_list = [e for e in self.G.edges]

        result = list(map(lambda x, y: {'id': x, 'pos': y}, self.G.nodes, pos_list))

        data = {'data': result, 'edges': edge_list }
        
        return data

    def generateNetwork2(self, mapData):
        print()
        print("mapdata", mapData)
        print()
        self.G = nx.DiGraph()

        for node in mapData:
            id = int(node['id'])
            pos = (float(node['longitude']), float(node['latitude']))
            self.addNode(id, pos)

        for node in mapData:
            id = int(node['id'])
            pos = (float(node['longitude']), float(node['latitude']))

            for edge in node['edges']:

                self.addEdge(id, int(edge), haversine(self.G.nodes[int(id)]['pos'],self.G.nodes[edge]['pos']))



        return mapData


    #def tempfunc(self):
    #    self.G = nx.DiGraph()
    #    with open("scania.geojson", 'r') as json_file:
    #        data = geojson.load(json_file)
    #        for p in data['features']:
    #            ID = p.properties['ID']
    #            edges = p.properties['edges']
    #            pos = tuple(p.geometry.coordinates)
    #            self.addNode(ID, pos)
    #        for k in data['features']:
    #            ID = k.properties['ID']
    #            edges = k.properties['edges']
    
    #            pos = tuple(k.geometry.coordinates)
    #            for i in edges:
    #                self.addEdge(ID, i, haversine(pos,self.G.nodes[i]['pos']))
    #    pos_list = [el[1] for el in self.G.nodes(data = 'pos', default=None)]
    #    edge_list = [e for e in self.G.edges]
    #    result = list(map(lambda x, y: {"ID": x, "pos": y}, self.G.nodes, pos_list))
    #    data = {'data': result, 'edges': edge_list }

    #    return data

