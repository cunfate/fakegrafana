from . import main
from flask import render_template, jsonify
from ..hinocdb import HinocInfluxDBClient, create_json
from flask import request
import os, json, re


@main.route('/')
def index_page():
    '''
    show main page
    '''
    return render_template('showtables.html')


@main.route('mydb')
def mydb():
    '''
    query database information and return raw data
    '''
    querystr = request.args.get('query')
    dbhost = os.getenv('FAKEGRAFANA_DBHOST')
    dbusername = os.getenv('FAKEGRAFANA_DBUSERNAME')
    dbdatabase = os.getenv('FAKEGRAFANA_DBNAME')
    if querystr == "" or querystr is None:
        return jsonify([]), 500
    influx = HinocInfluxDBClient(host=dbhost, port=8086, username=dbusername, database=dbdatabase)
    result = influx.query(querystr)
    # print(result.raw)
    return jsonify(result.raw)


@main.route('mydb', methods=['POST'])
def insert_to_db():
    '''
    insert data from http post
    '''
    dbhost = os.getenv('FAKEGRAFANA_DBHOST')
    dbusername = os.getenv('FAKEGRAFANA_DBUSERNAME')
    dbdatabase = os.getenv('FAKEGRAFANA_DBNAME')
    influx = HinocInfluxDBClient(host=dbhost, port=8086, username=dbusername, database=dbdatabase)
    querystr = str(request.get_data(), encoding='utf-8')
    try:
        influx.insert_from_json_str(querystr)
    except Exception as e:
        print(e)
        return '<h1>Bad Request</h1>', 400
    else:
        return '<h1>OK</h1>', 200


@main.route('mydb-statistic')
def statistic_data():
    '''
    get some statistic data
    '''
    return_data = None
    return return_data
