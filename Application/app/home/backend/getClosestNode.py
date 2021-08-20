import numpy as np


def getClosestNode(player, nodes):
    player_pos = [player['lat'], player['lng']]
    nodes_pos = []

    for i in nodes:
        data = list(i.values())
        nodes_pos.append(data)


    
    try:
        nodes = np.asarray(nodes_pos)
        deltas = nodes - player_pos
        dist_2 = np.einsum('ij,ij->i', deltas, deltas)
        #print('CLOSEST ', np.argmin(dist_2)+1)
        return np.argmin(dist_2)+1
    except:
        pass
