const winston = require('winston');

const logger = winston.createLogger({
  format:  winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`;
    })
  ),
  transports: [ 
    new winston.transports.File({ filename: 'error.log', level: 'error'}),
    new winston.transports.Console({level: 'info'})
  ]
});

logger.info("This is an info message");
logger.warn("this is a warining");
logger.error("this is an error message");