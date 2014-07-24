var mongo = require('./mongo-config')
  , da = require('./data-access')
  , errors = require('./errors');

module.exports = routes = {
  search: function (req, res, next) {
    opts = {
      search_terms: req.searchTerms,
      limit: req.limit,
      skip: req.skip,
      published_only: req.publishedOnly || false,
      error: function (err) {
        return next(new errors.DatabaseReadError(
          'Error searching for documents'))
      },
      success: function (result) {
        console.log('SEARCH FOR ' + req.searchTerms);
        res.header('Content-Type', 'application/json');
        return res.send(result);
      }
    };
    return da.search(mongo.searchUrl, opts);
  }
};