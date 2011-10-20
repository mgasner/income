import os
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
  return render_template('income.html')
  
DATABASE = '/tmp/ninety-nine.db'

def make_database_connection():
  """Returns a new database connection."""
  return sqlite3.connect(app.config['DATABASE'])
  
if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5000))
  app.run(host='0.0.0.0', port=port)
