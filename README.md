# Fake grafana

> a web app imitate grafana, which can do some monitoring web app.

To use this app, you should install python >= 3.5.

```sh
git clone https://github.com/cunfate/fakegrafana.git
cd fakegrafana
pip -3 install -r ./requirements/dev.txt
./manager.py runserver -h 0.0.0.0 -p 5000
``` 
And you can view http://localhost:5000 to use this app.