const replace = require('.');

console.log(replace(Buffer('foo:bar'), ':', '-').toString());
console.log(replace(Buffer('foo-beep-bar'), '-beep-', '-').toString());
console.log(replace('foo-beep-bar', '-beep-', '-').toString());

