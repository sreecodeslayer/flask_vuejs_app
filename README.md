# flask_vuejs_app
This is a test/learn application that uses Python Flask and VueJS as server and client side stack respectively

In this app, we can manage users, and their favorite photo album by letting them create their own url listing. (No fancy stuffs yet)  

### Usage  

* clone the repository, `git clone https://github.com/sreecodeslayer/flask_vuejs_app.git`  
* switch into the directory, `cd flask_vuejs_app`
* install the application requirements, `pip install -r requirements.txt`
* serve the application using Gunicorn, `gunicorn app:app`

> NB. The app requires a running MongoDB configured by default as without any auth. If your DB is Secured, please change the `app.config['MONGODB_HOST'] = 'localhost'` to your host, like wise set the `MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_PORT` to your desired settings before launching the application. For further config settings visit: http://docs.mongoengine.org/projects/flask-mongoengine/en/latest/#configuration
