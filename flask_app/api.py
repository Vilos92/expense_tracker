from flask_jwt import jwt_required, current_identity

from flask_app import app


@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity
