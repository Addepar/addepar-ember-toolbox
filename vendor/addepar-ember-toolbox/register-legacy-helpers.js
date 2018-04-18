Ember.HTMLBars._registerHelper('concat', Ember.HTMLBars.makeBoundHelper(function(params) {
  return params.join('');
}));

Ember.HTMLBars._registerHelper('hash', Ember.HTMLBars.makeBoundHelper(function(params, hash) {
  return hash;
}));
