import os
from flask import *

app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def index():
  if request.method == "GET":
    return render_template('form.html')
  elif request.method == "POST":
    for i in request.form:
      print i
      print request.form[i]
    return render_template('chart.html')

DATABASE = '/tmp/ninety-nine.db'

def make_database_connection():
  """Returns a new database connection."""
  return sqlite3.connect(app.config['DATABASE'])
  
if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5000))
  app.run(host='0.0.0.0', port=port)
