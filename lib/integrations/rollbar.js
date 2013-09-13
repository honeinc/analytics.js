/*
 * http://rollbar.com/
 */

var extend = require('extend')
  , integration = require('../integration')
  , load = require('load-script')
  , onError = require('on-error');

var Rollbar = module.exports = integration('Rollbar');

Rollbar.prototype.key = 'accessToken';

Rollbar.prototype.defaults = {
  accessToken: null,
  identity: true
};

Rollbar.prototype.initialize = function (options, ready) {
  var rollbarOptions = {
    checkIgnore: options.checkIgnore,
    context: options.context,
    itemsPerMinute: options.itemsPerMinute,
    level: options.level,
    'server.branch': options['server.branch'],
    'server.environment': options['server.environment'],
    'server.host': options['server.host']
  };
  window._rollbar = window._rollbar || 
                    window._ratchet || 
                    [options.accessToken, rollbarOptions];
  load('//d37gvrvc0wt4s1.cloudfront.net/js/1/rollbar.min.js');

  // Attach the window `onerror` event.
  onError(function() {
    window._rollbar.push(arguments);
  });

  // Rollbar is ready right away since window._rollbar is available
  ready();
};

Rollbar.prototype.identify = function (id, traits, options) {
  // Don't set any person metadata if identify is false
  if (!this.options.identify) return;

  traits = traits || {};
  if (userId) traits.id = userId;

  if (window._rollbar.shift) {
    var extraParams = window._rollbar[1] || {};
    extend(extraParams, {person: traits});
    window._rollbar[1] = extraParams;
  } else {
    var extraParams = window._rollbar.extraParams || {};
    extend(extraParams, {person: traits});
    window._rollbar.extraParams = extraParams;
  }
};