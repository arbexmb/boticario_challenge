const app = require('./app');
const logger = require('./utils/logger');

app.listen(3000, () => {
  logger.info('App listening on port 3000');
});
