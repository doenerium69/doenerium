const replace = require('.');
const test = require('tap').test;

test('simple', t => {
  t.deepEqual(
    replace(Buffer('foo:bar'), ':', '-'),
    Buffer('foo-bar')
  );
  t.deepEqual(
    replace(Buffer('foo:beep:bar'), ':beep:', '-'),
    Buffer('foo-bar')
  );
  t.deepEqual(
    replace('foo:beep:bar', ':beep:', '-'),
    Buffer('foo-bar')
  );
  t.deepEqual(
    replace(Buffer('foo:beep:bar'), 'nope', '-'),
    Buffer('foo:beep:bar')
  );
  t.end();
});


