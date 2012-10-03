(function() {

  global.chai = require('chai');

  global.assert = chai.assert;

  global.expect = chai.expect;

  global.test = it;

  global.sinon = require('sinon');

  global.async = require('async');

}).call(this);
