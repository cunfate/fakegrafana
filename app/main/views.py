from . import main
from flask import render_template, jsonify
from ..hinocdb import HinocInfluxDBClient, create_json
from flask import request
import os, json, re


@main.route('/')
def index_page():
    return render_template('showtables.html')


@main.route('mydb')
def mydb():
    #proxy = os.getenv('HTTP_PROXY')
    querystr = request.args.get('query')
    if querystr == "" or querystr is None:
        return jsonify([]), 500
    influx = HinocInfluxDBClient(host='162.105.155.39', port=8086, username='root',
            database='hinoc_inform')
    result = influx.query(querystr)
    # print(result.raw)
    return jsonify(result.raw)


@main.route('mydb', methods=['POST'])
def insert_to_db():
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
