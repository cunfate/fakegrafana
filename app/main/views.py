from . import main
from flask import render_template, jsonify
from ..hinocdb import HinocInfluxDBClient, create_json
from flask import request
import os, json, re
from urllib.parse import urlencode, unquote_plus


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


@main.route('statistic/<condition>', methods=["GET"])
def statistic_data(condition):
    '''
    get some statistic data
    '''
    condition_literal = unquote_plus(condition) #decode the str to url raw string
    print(condition_literal)
    return_data = '<h1>OK!</h1><p>{0}</p>'.format(condition_literal)
    return return_data, 200
