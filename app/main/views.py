'''routes processing functions of the app'''
import os
from urllib.parse import unquote_plus
from flask import request
from flask import render_template, jsonify
from influxdb.exceptions import InfluxDBClientError
from . import main
from ..hinocdb import HinocInfluxDBClient


@main.route('/')
def index_page():
    '''show main page'''
    return render_template('showtables.html')


@main.route('mydb', methods=['POST'])
def insert_to_db():
    '''insert data from http post'''
    dbhost = os.getenv('FAKEGRAFANA_DBHOST')
    dbusername = os.getenv('FAKEGRAFANA_DBUSERNAME')
    dbdatabase = os.getenv('FAKEGRAFANA_DBNAME')
    influx = HinocInfluxDBClient(host=dbhost, port=8086, username=dbusername, database=dbdatabase)
    querystr = str(request.get_data(), encoding='utf-8')
    try:
        influx.insert_from_json_str(querystr)
    except InfluxDBClientError as exception:
        print(exception)
        return '<h1>Bad Request</h1>', 400
    else:
        return '<h1>OK</h1>', 200


@main.route('statistic/<condition>', methods=["GET"])
def statistic_data(condition):
    '''get some statistic data'''
    condition_literal = unquote_plus(condition) #decode the str to url raw string
    print(condition_literal)
    return_data = '<h1>OK!</h1><p>{0}</p>'.format(condition_literal)
    return return_data, 200


@main.route('testdb', methods=["GET"])
def get_data_new_interface():
    '''interface to get data via database'''
    item_group = request.args.get('group')
    items = request.args.get('items')
    realtime = request.args.get('realtime') == 'true'
    starttime = request.args.get('starttime')
    endtime = request.args.get('endtime')
    addr = request.args.get('addr')

    print(items)
    print(request.args)

    query_statement = None
    if not realtime:
        query_statement = 'SELECT %s FROM "%s" WHERE "HmAddr" = \'%s\' AND time > \'%s\' AND time < \'%s\' ORDER BY time DESC' % (
                items, item_group, addr, starttime, endtime
            )
    else:
        query_statement = 'SELECT %s FROM "%s" WHERE "HmAddr" = \'%s\' ORDER BY time DESC LIMIT 100' % (
                items, item_group, addr
            )
    print(query_statement)
    dbhost = os.getenv('FAKEGRAFANA_DBHOST')
    dbusername = os.getenv('FAKEGRAFANA_DBUSERNAME')
    dbdatabase = os.getenv('FAKEGRAFANA_DBNAME')
    influx = HinocInfluxDBClient(host=dbhost, port=8086, username=dbusername, database=dbdatabase)
    data = influx.query(query_statement)
    return jsonify(data.raw)


@main.route('itemgroup', methods=['GET'])
def get_itemgroups():
    '''interface to get item groups in influxdb'''
    dbhost = os.getenv('FAKEGRAFANA_DBHOST')
    dbusername = os.getenv('FAKEGRAFANA_DBUSERNAME')
    dbdatabase = os.getenv('FAKEGRAFANA_DBNAME')
    influx = HinocInfluxDBClient(host=dbhost, port=8086, username=dbusername, database=dbdatabase)
    data = influx.query('SHOW MEASUREMENTS')
     # print(data.raw)
    data = data.raw['series'][0]['values']
    data = [measurements[0] for measurements in data]
    return jsonify(data)


@main.route('oamitem', methods=['GET'])
def get_oamitems():
    '''interface to get oam items in influxdb'''
    dbhost = os.getenv('FAKEGRAFANA_DBHOST')
    dbusername = os.getenv('FAKEGRAFANA_DBUSERNAME')
    dbdatabase = os.getenv('FAKEGRAFANA_DBNAME')
    influx = HinocInfluxDBClient(host=dbhost, port=8086, username=dbusername, database=dbdatabase)
    group = request.args.get('group')
    data = influx.query('SHOW FIELD KEYS FROM "%s"' % group)
    # print(data.raw)
    data = data.raw['series'][0]['values']
    data = [measurements[0] for measurements in data]
    return jsonify(data)


@main.route('devices', methods=['GET'])
def get_devices():
    '''interface to get devices in influxdb'''
    dbhost = os.getenv('FAKEGRAFANA_DBHOST')
    dbusername = os.getenv('FAKEGRAFANA_DBUSERNAME')
    dbdatabase = os.getenv('FAKEGRAFANA_DBNAME')
    influx = HinocInfluxDBClient(host=dbhost, port=8086, username=dbusername, database=dbdatabase)
    group = request.args.get('group')
    data = influx.query('SHOW TAG VALUES FROM "%s" WITH KEY IN ("HmAddr")' % group)
    # print(data.raw)
    data = data.raw['series'][0]['values']
    data = [measurements[1] for measurements in data]
    return jsonify(data)
