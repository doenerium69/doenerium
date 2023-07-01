#!/bin/sh
set -e

case $(uname | tr '[:upper:]' '[:lower:]') in
  *bsd) alias make='gmake';;
  *)
esac

cd "$1/liblzma"
make
make install
