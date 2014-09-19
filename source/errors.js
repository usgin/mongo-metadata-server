function NotFoundError (msg) {
  this.msg = msg;
  this.name = 'NotFound';
  this.status = 404;
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotFoundError.prototype = new Error;

function NotImplementedError (msg) {
  this.msg = msg;
  this.name = 'NotImplemented';
  this.status = 501;
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotImplementedError.prototype = new Error;

function ValidationError (msg) {
  this.msg = msg;
  this.name = 'ValidationError';
  this.status = 400;
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

ValidationError.prototype = new Error;

function ArgumentError (msg) {
  this.msg = msg;
  this.name = 'ArgumentError';
  this.status = 400;
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

ArgumentError.prototype = new Error;

function RequestError (msg) {
  this.msg = msg;
  this.name = 'RequestError';
  this.status = 400;
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

RequestError.prototype = new Error;

function DatabaseReadError (msg) {
  this.msg = msg;
  this.name = 'DatabaseReadError';
  this.status = 500;
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

DatabaseReadError.prototype = new Error;

function DatabaseWriteError (msg) {
  this.msg = msg;
  this.name = 'DatabaseWriteError';
  this.status = 500;
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

DatabaseWriteError.prototype = new Error;

exports.NotFoundError = NotFoundError;
exports.NotImplementedError = NotImplementedError;
exports.ValidatorError = ValidationError;
exports.ArgumentError = ArgumentError;
exports.RequestError = RequestError;
exports.DatabaseReadError = DatabaseReadError;
exports.DatabaseWriteError = DatabaseWriteError;