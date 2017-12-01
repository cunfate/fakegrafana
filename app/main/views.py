from . import main
from flask import render_template


@main.route('/')
def index_page():
    return render_template('showtables.html')