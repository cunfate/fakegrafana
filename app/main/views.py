from . import main
from flask import render_template, jsonify
from ..hinocdb import HinocInfluxDBClient
from flask import request
import os


@main.route('/')
def index_page():
    return render_template('showtables.html')


@main.route('mydb')
def mydb():
    proxy = os.getenv('HTTP_PROXY')
    querystr = request.args.get('query')
    if querystr == "" or querystr == None:
        return jsonify([])
    influx = HinocInfluxDBClient(host='162.105.155.39', port=8086, username='root',
            database='hinoc_inform', proxies={'http': proxy})
    result = influx.query(querystr)
    return jsonify(result.raw)
