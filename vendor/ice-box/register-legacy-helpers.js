Ember.HTMLBars._registerHelper('concat', Ember.HTMLBars.makeBoundHelper((params) => {
  return params.join('');
}));

Ember.HTMLBars._registerHelper('hash', Ember.HTMLBars.makeBoundHelper((params, hash) => {
  return hash;
}));
