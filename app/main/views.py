from . import main
from flask import render_template
from ..hinocdb import HinocInfluxDBClient


@main.route('/')
def index_page():
    return render_template('showtables.html')


@main.route('/mydb', methods=['GET'])
def getDbData():
    pass
