from flask import Blueprint


main = Blueprint('main', __name__, template_folder='./templates', static_folder='static')
#print(main.static_folder)


from . import views