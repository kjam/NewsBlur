// Generated by CoffeeScript 2.5.1
(function() {
  var DEV, Mercury, app, log, server;

  Mercury = require('@postlight/mercury-parser');

  app = require('express')();

  server = require('http').Server(app);

  log = require('./log.js');

  DEV = process.env.NODE_ENV === 'development';

  log.debug("Starting NewsBlur Original Text Fetcher / Mercury Parser...");

  if (!DEV && !process.env.NODE_ENV) {
    log.debug("Specify NODE_ENV=<development,production>");
    return;
  } else if (DEV) {
    log.debug("Running as development server");
  } else {
    log.debug("Running as production server");
  }

  app.get(/\/rss_feeds\/original_text_fetcher\/?/, (req, res) => {
    var api_key, url;
    res.setHeader('Content-Type', 'application/json');
    if (req.query.test) {
      return res.end("OK");
    }
    url = req.query.url;
    if (!url) {
      log.debug("Missing url");
      return res.end(JSON.stringify({
        error: "Missing `url` query parameter."
      }));
    }
    api_key = req.header('x-api-key') || req.query.apikey;
    if (!DEV && (!api_key || api_key.indexOf("djtXZrSIEfDa3Dex9FQ9AR") === -1)) {
      log.debug(`Mismatched API key: ${url} / ${api_key}`);
      return res.end(JSON.stringify({
        error: "Invalid API key. You need to set up your own Original Text server."
      }));
    }
    return Mercury.parse(url).then((result) => {
      log.debug(`Fetched: ${url}`);
      return res.end(JSON.stringify(result));
    });
  });

  app.listen(4040);

}).call(this);
