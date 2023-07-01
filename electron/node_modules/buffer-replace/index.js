'use strict';

const replace = (buf, a, b) => {
  if (!Buffer.isBuffer(buf)) buf = Buffer(buf);
  const idx = buf.indexOf(a);
  if (idx === -1) return buf;
  if (!Buffer.isBuffer(b)) b = Buffer(b);

  const before = buf.slice(0, idx);
  const after = replace(buf.slice(idx + a.length), a, b);

  return Buffer.concat([
    before,
    b,
    after
  ], idx + b.length + after.length);
}

module.exports = replace;

