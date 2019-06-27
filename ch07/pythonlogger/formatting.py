import logging

FORMAT = '[{asctime}] {levelname}: {message} ({filename}:{funcName}:{lineno})'

logging.basicConfig(
  filename='app.log',
  filemode='w',
  level=logging.INFO,
  style='{',
  format=FORMAT
  )

def test_logging():
  logging.info('Info message')

test_logging()
