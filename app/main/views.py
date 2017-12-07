from . import main
from flask import render_template
from ..hinocdb import HinocInfluxDBClient
from flask import request


@main.route('/')
def index_page():
    return render_template('showtables.html')


@main.route('/mydb')
def mydb():
    print(request.args.items)
    return '{"success": true}'
