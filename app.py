from flask import Flask
from flask import jsonify
from flask import request
from flask import render_template
from flask import redirect, url_for
from flask import send_from_directory

from flask_login import UserMixin, LoginManager, login_required, login_user, logout_user, current_user

from flask_mongoengine import MongoEngine, DoesNotExist
from mongoengine.errors import NotUniqueError

from passlib.hash import pbkdf2_sha512 as sha512

from uuid import uuid4

import os

app = Flask(__name__)

# app.config['DEBUG'] = True
app.config['MONGODB_DB'] = 'FLASK_VUE_APP'
app.config['MONGODB_HOST'] = 'localhost'
app.config['MONGODB_PORT'] = 27017
app.config['SECRET_KEY'] = "get the hell outta here!"

db = MongoEngine(app)


login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user):
	return User.objects.get(id=user)


@login_manager.unauthorized_handler
def unauthorized():
	# do stuff
	return redirect('/')


class User(UserMixin,db.Document):
	username = db.StringField(max_length=255, unique=True)
	password = db.StringField(max_length=255)
	active = db.BooleanField(default=True)
	confirmed_at = db.DateTimeField()

	def __unicode__(self):
		return self.id

	def is_authenticated(self):
		return True

	def get_id(self):
		return unicode(self.id)

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def verify(self,password):
		return sha512.verify(password, self.password)

class Photo(db.Document):
	name = db.StringField(max_length=50)
	url = db.URLField(verify_exists=True)
	user = db.ReferenceField(User)

# to server protected static files, they are in instance folder instead of static folder
@app.route('/protected/<path:filename>')
@login_required
def protected(filename):
	return send_from_directory(
		os.path.join(app.instance_path, 'protected'),
		filename
	)

@app.route('/')
def index():
	try:
		if current_user.username:
			return redirect(url_for("dashboard"))
	except AttributeError:
		# User not logged in
		return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
	data=request.get_json('data',None)
	print "login", data
	try:
		if data:
			data=data['data']
			user = User.objects.get(username=data['username'])
			if user.verify(data['password']):
				user = User.objects.get(id = user.id)
				login_user(user)
				print current_user.username
				return jsonify(status=True)
			else:
				return jsonify(code=200, message="Invalid credentials!")

	except DoesNotExist as e:
		return jsonify(code=200, status=False, message="No user found!")
	except Exception as e:
		raise e

@app.route('/signup', methods=['POST'])
def signup():
	data = request.get_json('data',None)

	if data:
		data = data['data']
		print "signup", data
		try:
			new_user=User(username = data['username'], password = sha512.hash(data['password'])).save()
			return redirect(url_for('dashboard'))
		except NotUniqueError as nu:
			return jsonify(code=200, status=False, message='Username already taken, we are sorry! Please try another.')
	else:
		res = jsonify(status = 400, message='Invalid data supplied')
		res.status_code = 400
		return res

@app.route('/logout', methods=['GET'])
def logout():
	logout_user()
	return redirect(url_for('index'))


@app.route('/dashboard')
@login_required
def dashboard():
	print current_user.username
	return render_template("dashboard.html")

@app.route('/dashboard/getData', methods=['GET'])
@login_required
def get_data():
	return jsonify(status=True,message=uuid4())

@app.route('/dashboard/addPhoto', methods=['POST'])
@login_required
def add_photo():
	data = request.get_json('data', None)
	try:
		if data:
			data = data['data']
			new_photo = Photo(name = data['name'], url = data['url'], user=current_user.id)
			new_photo.save()
			return jsonify(status=True)
		else:
			return jsonify(status=False, message="Data not matching")
	except Exception as e:
		raise e

@app.route('/dashboard/getPhotos', methods=['GET'])
@login_required
def get_photos():
	try:
		photos = Photo.objects(user=current_user.id)
		photos_ = [{'name':photo.name, 'url':photo.url} for photo in photos]
		print photos_
		return jsonify(status=True, photos=photos_)
	except Exception as e:
		raise e
	
# @app.errorhandler(404)
# def handle_404(e):
# 	return render_template('404.html')

if __name__ == '__main__':
	app.run(debug=True, port=8000)