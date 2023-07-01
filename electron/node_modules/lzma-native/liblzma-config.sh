#!/bin/sh
set -e

SRC_TARBALL="$2"
TARGET_DIR="$1/liblzma"

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

tar xvjf "$SRC_TARBALL" >node_liblzma_config.log 2>&1

export CFLAGS="-fPIC $CFLAGS"

# Fix build on Apple Silicon
if [ $(uname) = "Darwin" -a $(uname -m) = "arm64" ]; then
    XZ_SRC_DIR=$(ls | grep xz-*)
    sed -i '' 's/\tnone)/\tarm64-*)\n\t\tbasic_machine=$(echo $basic_machine | sed "s\/arm64\/aarch64\/")\n\t\t;;\n\t\tnone)/g' $XZ_SRC_DIR/build-aux/config.sub
fi

sh xz-*/configure --enable-static --disable-shared --disable-scripts --disable-lzmainfo \
    --disable-lzma-links --disable-lzmadec --disable-xzdec --disable-xz --disable-rpath \
    --prefix="$TARGET_DIR/build" CFLAGS="$CFLAGS" >>node_liblzma_config.log 2>&1
