import logging
import logging.handlers

FORMAT='[{asctime}.{msecs:0>3.0f}] {levelname}: {message} ({filename}:{funcName}:{lineno})'
DATEFMT = '%Y-%m-%d %H:%M:%S'

formatter = logging.Formatter(
  fmt=FORMAT,#'<{asctime}> {name} {levelname}: {message}',
  datefmt=DATEFMT,
  style='{'
  )
handler = logging.handlers.WatchedFileHandler('/var/log/weather/fans.log')
handler.setFormatter(formatter)

logger = logging.getLogger('app').getChild('fans')
logger.addHandler(handler)

logger.propagate = False


class Fans:
  def __init__(self):
    pass
  def test(self):
    logger.info('testing module')
