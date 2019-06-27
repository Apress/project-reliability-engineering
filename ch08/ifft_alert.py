import urllib.request
import urllib.parse

MY_KEY = 'nWwXuR2SarCqzc07Rcq10O9-fNIu-AufsaJ4MsKXUke'
ALERT_EVENT = 'page'
ERROR_TEXT = 'project lost power'
PLAYBOOK_URL = 'https://tinyurl.com/pre-playbook1'

params = urllib.parse.urlencode({
	'value1': ERROR_TEXT,
	'value2': PLAYBOOK_URL
	})
data = params.encode('ascii')
url = 'https://maker.ifttt.com/trigger/{}/with/key/{}'
url = url.format(ALERT_EVENT, MY_KEY)
with urllib.request.urlopen(url, data) as f:
	print(f.read().decode('utf-8'))