# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
import json
import random
import time
from datetime import datetime
from app.home import blueprint
from flask import session, render_template, redirect, url_for, request, Response
from flask_login import login_required, current_user
from app import login_manager
from jinja2 import TemplateNotFound
from app.home.backend.getTruckPos import *
from app.home.backend.getClosestNode import *
#from app.home.backend.networkSetup import *
from app.home.backend.networkGraph import *
from app.home.backend.database import *
#from app.home.backend.createNode import *
from geojson import Point, Feature, FeatureCollection, dump
#from run import cache

node_input = []
player_input = []
network = Network()


def getPath(tmpArray):

    #print(tmpArray)

    path, length = session['network'].findPath(tmpArray[0],tmpArray[1])

    return json.dumps({'path': path, 'path_length' :length })
    #try: 
    #    path, length = session['network'].findPath(tmpArray[0],tmpArray[1])
    #    print(path)
    #    print(length)
    #    return json.dumps({'path': path, 'path_length' :length })
    #except:
    #    return json.dumps({'path': [], 'length': 0})

def createNetwork(SiteId):
    session['network'] = network
    #mapdata = get_data(int(SiteID))
    mapdata2 = get_nodes(str(SiteId))
    result = network.generateNetwork2(mapdata2)
    #result = network.generateNetwork(mapdata)

    #print("create",session['network'].G.nodes)
    return json.dumps(result)

def saveNetwork(nodeData):
    
    #nodeData = json.dumps(nodeData)
    print(nodeData)
    add_data(nodeData)
    #features = []
    #for node in mapData['nodes']:

    #    point = Point((node['pos']['lng'], node['pos']['lat']))    
    #    edges = []

    #    for edge in mapData['edges']:
    #        if str(edge[0]) == str(node['ID']):
    #            edges.append(edge[1])

    #    features.append(Feature(geometry=point, properties={"ID": int(node['ID']), "edges": edges}))

    #feature_collection = FeatureCollection(features)

    #with open(mapData['file'], 'w') as f:
    #    dump(feature_collection, f)

    return json.dumps(None)

def saveOrder(orderData):

    add_order(orderData)
    return orderData

def getCompletedOrders():
    try: 
        completedOrders = get_completed_orders()
        return json.dumps(completedOrders)
    except:
        return json.dumps(None)


def getOrders():
    try: 
        orders = get_orders()
        return json.dumps(orders)
    except:
        return json.dumps(None)

def sendOrder(orderData):
    send_order(orderData)
    return orderData

@blueprint.route('/getPath',methods = ['POST'])
def get_Path():
    tmpArray = request.get_json()
    return Response(getPath(tmpArray), mimetype='text/event-stream')


@blueprint.route('/createNetwork', methods = ['POST'])
def create_Network():
    id = request.get_json()
    return Response(createNetwork(id), mimetype='text/event-stream')


@blueprint.route('/saveNetwork', methods = ['POST'])
def save_Network():
    mapData = request.get_json()
    return Response(saveNetwork(mapData), mimetype='text/event-stream')


@blueprint.route('/saveOrder', methods = ['POST'])
def save_Order():
    orderData = request.get_json()

    return Response(saveOrder(orderData), mimetype='text/event-stream')

@blueprint.route('/getCompletedOrders', methods = ['GET'])
def get_Completed_Orders():
    return Response(getCompletedOrders(), mimetype='text/event-stream')

@blueprint.route('/getOrders', methods = ['GET'])
def get_Orders():
    return Response(getOrders(), mimetype='text/event-stream')

@blueprint.route('/sendOrder', methods = ['POST'])
def send_Order():
    orderData = request.get_json()
    return Response(sendOrder(orderData), mimetype='text/event-stream')



@blueprint.route('/chart-data')
def chart_data():
    def generate_random_data():
        while True:
            json_data = json.dumps(
                {'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'value': random.random() * 100})
            yield f"data:{json_data}\n\n"
            time.sleep(1)

    return Response(generate_random_data(), mimetype='text/event-stream')



#@blueprint.route('/truck-pos')
#def truck_pos():


    #return Response(start(), mimetype='text/event-stream')

#@blueprint.route('/createNode', methods=['GET', 'POST'])
#def createNodeCallibration():
#    if request.method == 'POST':
#        vehiclePositionNodeCreation = startNode()
#        print("")
        
        #print(vehiclePositionNodeCreation['vehicles'][0]['coordinates'][0]['lng'])
        
#        with open('myfile.geojson', 'r') as f:
#            dataFile = geojson.load(f)
                       
#            GivenIDNumber = len(dataFile['features']) + 1
            

#        nodeCreation = {
#                "type": "Feature",
#                "geometry": {
#                    "type": "Point",
#                    "coordinates": [ vehiclePositionNodeCreation['vehicles'][0]['coordinates'][0]['lng'], 
#                                    vehiclePositionNodeCreation['vehicles'][0]['coordinates'][0]['lat'] ]
#                },
 #               "properties": {
#                    "ID": GivenIDNumber,
#                    "edges": [ ]
#                }
#            }
#
#        dataFile['features'].append(nodeCreation)
        
#        with open('myfile.geojson', 'w') as f:
#            dump(dataFile, f)

            
      

#        return json.dumps(vehiclePositionNodeCreation)








@blueprint.route('/hello', methods=['GET', 'POST'])
def hello():

    # POST request
    if request.method == 'POST':
        player_input = request.get_json()

        output = getClosestNode(player_input, node_input)

        return json.dumps({'Closest': str(output)})


    # GET request
    else:
        message = {'greeting':'Hello from Flask!'}
        return jsonify(message)  # serialize and use JSON headers



#@blueprint.route('/nodes2', methods=['GET', 'POST'])
#def getNodes():
#    global node_input

    # POST request
#    if request.method == 'POST':
#        node_input = request.get_json()
#        return 'OK', 200

    # GET request
#    else:
 #       message = {'greeting':'Hello from Flask!'}
 #       return jsonify(message)  # serialize and use JSON headers

#def getNodeArray():
 #   return node_input




@blueprint.route('/index')
@login_required
def index():
    #return render_template('index.html', segment='index')
    return render_template('ui-maps.html', segment='index')

@blueprint.route('/<template>')
@login_required
def route_template(template):

    try:

        if not template.endswith( '.html' ):
            template += '.html'

        # Detect the current page
        segment = get_segment( request )

        # Serve the file (if exists) from app/templates/FILE.html
        return render_template( template, segment=segment )

    except TemplateNotFound:
        return render_template('page-404.html'), 404
    
    except:
        return render_template('page-500.html'), 500

# Helper - Extract current page name from request 
def get_segment( request ): 

    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment    

    except:
        return None  
