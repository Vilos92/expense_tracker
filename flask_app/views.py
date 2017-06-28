from flask_app import app                                                                                


@app.route('/app/', defaults={'path': ''})
@app.route('/app/<path:path>')
def index(path):
    return app.send_static_file('html/index.html')
