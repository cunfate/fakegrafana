#!/usr/bin/env python3
import os
from app import create_app
from flask_script import Manager, Shell
from influxdb import InfluxDBClient

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)

def make_shell_content():
    return dict(InfluxDBClient=InfluxDBClient)

manager.add_command('shell', Shell(make_context=make_shell_content))

if __name__ == '__main__':
    manager.run()