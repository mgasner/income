import os
from flask import *
from flaskext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)
db.create_all()

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == "GET":
        #log_access(request)
        return render_template('form.html')
    elif request.method == "POST":
        log_form(request)
        return render_template('chart.html', income=request.form['income'])

def log_access(request):
    entry = Entry(request.environ['REMOTE_ADDR'],
                  request.environ['HTTP_USER_AGENT'],
                  time.gmtime())
    db.session.add(entry)
    db.session.commit()

def log_form(request):
    entry = Entry(request.environ['REMOTE_ADDR'],
                  request.environ['HTTP_USER_AGENT'],
                  time.gmtime(),
                  request.form['zip'],
                  request.form['income'],
                  request.form['pct'])
    db.session.add(entry)
    db.session.commit()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

class Entry(db.Model):
    id = db.Column(db.Integer, db.Sequence('id_seq'), primary_key=True)
    ip = db.Column(db.String(80))
    user_agent = db.Column(db.Text)
    zip = db.Column(db.Integer)
    income = db.Column(db.Integer)
    guess = db.Column(db.Integer)
    time = db.Column(db.DateTime)

    def __init__(self, ip, user_agent, time, zip=Null, income=Null, guess=Null):
        self.ip = ip
        self.user_agent = user_agent
        self.zip = zip
        self.income = income
        self.guess = guess
        self.time = time
