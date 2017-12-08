from . import main
from flask import render_template, jsonify
from ..hinocdb import HinocInfluxDBClient
from flask import request


@main.route('/')
def index_page():
    return render_template('showtables.html')


@main.route('mydb')
def mydb():
    querystr = request.args.get('query')
    if querystr == "" or querystr == None:
        return None
    influx = HinocInfluxDBClient(host='162.105.155.39', port=8086, username='root',
            database='hinoc_inform', proxies={'http':'http://zhangcun:Hinoc2505@162.105.155.14:3128'})
    result = influx.query(querystr)
    #print('{0}'.format(result))
    return jsonify(result.raw)
