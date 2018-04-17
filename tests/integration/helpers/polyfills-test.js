import Component from '@ember/component';
import { observer } from '@ember/object';
import { on } from '@ember/object/evented';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { find } from 'ember-native-dom-helpers';

moduleForComponent('helper polyfills', { integration: true });

test('concat works', function(assert) {
  this.register('component:foo-bar', Component.extend());
  this.register('template:components/foo-bar', hbs`{{concat 'foo' bar}}`);

  this.render(hbs`{{foo-bar bar=baz class="foo"}}`);

  assert.equal(find('.foo').textContent, 'foo');

  this.set('baz', 'bar');

  assert.equal(find('.foo').textContent, 'foobar');
});

test('hash works', function(assert) {
  let context = this;

  assert.expect(2);

  this.register(
    'component:foo-bar',
    Component.extend({
      // eslint-disable-next-line
      hashObserver: on(
        'init',

        // eslint-disable-next-line
        observer('hash', function() {
          assert.equal(this.get('hash.baz'), context.get('baz'), 'hash set successfully');
        })
      ),
    })
  );

  this.register('template:components/foo-bar', hbs`Hello, world!`);

  this.render(hbs`{{foo-bar hash=(hash baz=baz) class="foo"}}`);

  this.set('baz', 123);
});
