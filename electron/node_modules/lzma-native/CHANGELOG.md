# Changelog for lzma-native

## 8.0.6, Jan 18 2022

* [[`5bdb4b047c`](https://github.com/addaleax/lzma-native/commit/5bdb4b047c)] - **ci**: use npm instead of yarn (Anna Henningsen)
* [[`204dfca905`](https://github.com/addaleax/lzma-native/commit/204dfca905)] - *Revert* "*Revert* "**ci**: set llvm_version to 0.0 on non-macOS hosts for prebuilds"" (Anna Henningsen)
* [[`8c324b2672`](https://github.com/addaleax/lzma-native/commit/8c324b2672)] - *Revert* "**ci**: set llvm_version to 0.0 on non-macOS hosts for prebuilds" (Anna Henningsen)
* [[`4639d45d73`](https://github.com/addaleax/lzma-native/commit/4639d45d73)] - **ci**: set llvm_version to 0.0 on non-macOS hosts for prebuilds (Anna Henningsen)
* [[`d5164b3ded`](https://github.com/addaleax/lzma-native/commit/d5164b3ded)] - **test**: bump mocha timeout (Anna Henningsen)
* [[`0ddd17aed8`](https://github.com/addaleax/lzma-native/commit/0ddd17aed8)] - **build**: fix dyld load error on Apple Silicon (#128) (tylinux)

## 8.0.5, Jan 11 2022

* [[`2ee1daa361`](https://github.com/addaleax/lzma-native/commit/2ee1daa361)] - fix(build): remove bash-isms (Anna Henningsen)
* [[`da5832b0c4`](https://github.com/addaleax/lzma-native/commit/da5832b0c4)] - **ci**: replace Travis CI/AppVeyor with GitHub Actions, prebuild for macOS/arm64 (#126) (Mark Lee)
* [[`8af909b058`](https://github.com/addaleax/lzma-native/commit/8af909b058)] - **build**: fix build on Apple Silicon (#123) (tylinux)

## 8.0.1, May 13 2021

* [[`5b724c30c1`](https://github.com/addaleax/lzma-native/commit/5b724c30c1)] - More prebuild updates (Anna Henningsen)
* [[`43f11c229b`](https://github.com/addaleax/lzma-native/commit/43f11c229b)] - Try switching to prebuildify (Anna Henningsen)

## 7.0.1, Mar 11 2021

* [[`d9b0b90b66`](https://github.com/addaleax/lzma-native/commit/d9b0b90b66)] - Upgrade to @mapbox/node-pre-gyp (Luis Solorzano)

## 6.0.1, Apr 23 2020

* [[`d90d2fc354`](https://github.com/addaleax/lzma-native/commit/d90d2fc354)] - **build**: fix package filename for N-API (Anna Henningsen)

## 6.0.0, Jan 1 2020

* [[`f33038b345`](https://github.com/addaleax/lzma-native/commit/f33038b345)] - **ci**: update platform list (Anna Henningsen) [#72](https://github.com/addaleax/lzma-native/pull/72)
* [[`66499a02b6`](https://github.com/addaleax/lzma-native/commit/66499a02b6)] - **build**: remove cflags.sh build step (Anna Henningsen) [#72](https://github.com/addaleax/lzma-native/pull/72)
* [[`8bea0ff0cf`](https://github.com/addaleax/lzma-native/commit/8bea0ff0cf)] - **src**: convert to N-API (Anna Henningsen) [#72](https://github.com/addaleax/lzma-native/pull/72)

## 5.0.1, Dec 19 2019

* [[`56ff7693a8`](https://github.com/addaleax/lzma-native/commit/56ff7693a8)] - **ci**: revert back to using gcc 4.9 (Anna Henningsen)

## 5.0.0, Nov 23 2019

* [[`607c4f450c`](https://github.com/addaleax/lzma-native/commit/607c4f450c)] - **ci**: remove Node.js 6, 11 (Anna Henningsen) [#87](https://github.com/addaleax/lzma-native/pull/87)

## 4.0.6, Nov 22 2019

* [[`6ebced9b57`](https://github.com/addaleax/lzma-native/commit/6ebced9b57)] - Fix compatibility with Node 13 (Christian Moritz) [#86](https://github.com/addaleax/lzma-native/pull/86)

## 4.0.5, May 24 2019

* [[`dfd9098c85`](https://github.com/addaleax/lzma-native/commit/dfd9098c85)] - Ignore .git when publishing to npm (Juan Cruz Viotti) [#83](https://github.com/addaleax/lzma-native/pull/83)

## 4.0.4, May 23 2019

* [[`0dc31e34de`](https://github.com/addaleax/lzma-native/commit/0dc31e34de)] - Enable compilation for Node 12 (Gergely Imreh) [#81](https://github.com/addaleax/lzma-native/pull/81)

## 4.0.3, Nov 14 2018

* [[`d07d5f5571`](https://github.com/addaleax/lzma-native/commit/d07d5f5571)] - **ci**: update platform list with Node 11 (Anna Henningsen)
* [[`8bbfb0a4d1`](https://github.com/addaleax/lzma-native/commit/8bbfb0a4d1)] - **ci**: fix Node 8 version at 8.10 (Anna Henningsen)

## 4.0.2, Oct 26 2018

* [[`bb6bfe0988`](https://github.com/addaleax/lzma-native/commit/bb6bfe0988)] - **package**: update node-pre-gyp to 0.11.0 (webcarrot) [#68](https://github.com/addaleax/lzma-native/pull/68)

## 4.0.1, Jul 26 2018

* [[`93b50cc2f7`](https://github.com/addaleax/lzma-native/commit/93b50cc2f7)] - **package**: fix rimraf invocation in install script (webcarrot) [#63](https://github.com/addaleax/lzma-native/pull/63)

## 4.0.0, Jul 26 2018

There are no breaking changes to the API provided by this module.

This drops pre-built binaries and testing for officially unsupported Node.js
versions. Those versions have known security issues and should not be used
anymore.

This also updates node-pre-gyp to a more recent version. In the past,
this has caused trouble for some users, so this considered
is a semver-major change as well.

* [[`b625b3e525`](https://github.com/addaleax/lzma-native/commit/b625b3e525)] - **package**: stop bundling dependencies (Anna Henningsen)
* [[`98155a8179`](https://github.com/addaleax/lzma-native/commit/98155a8179)] - **ci**: drop unsupported Node.js versions (4, 5, 7, 9) (Anna Henningsen)
* [[`d59574481f`](https://github.com/addaleax/lzma-native/commit/d59574481f)] - **package**: update bl to 2.0.1 (Anna Henningsen)
* [[`f2c6e84d2c`](https://github.com/addaleax/lzma-native/commit/f2c6e84d2c)] - **package**: update node-pre-gyp to 0.10.3 (simlu) [#61](https://github.com/addaleax/lzma-native/pull/61)

## 3.0.8, May 12 2018

* [[`8c18848609`](https://github.com/addaleax/lzma-native/commit/8c18848609)] - **ci**: add Node.js 10 to matrix (Anna Henningsen)

## 3.0.7, Mar 26 2018

This likely fixed a regression related to node-pre-gyp.

* [[`430a440276`](https://github.com/addaleax/lzma-native/commit/430a440276)] - **package**: pin node-pre-gyp to 0.6.39 (Anna Henningsen)

## 3.0.6, Mar 26 2018

* [[`484c53577f`](https://github.com/addaleax/lzma-native/commit/484c53577f)] - **package**: update dependencies (Anna Henningsen)
* [[`6513708704`](https://github.com/addaleax/lzma-native/commit/6513708704)] - **lib**: use `Buffer.*` instead of deprecated Buffer constructor (Anna Henningsen)

## 3.0.5, Feb 21 2018

* [[`c03299db13`](https://github.com/addaleax/lzma-native/commit/c03299db13)] - **ci**: remove OS X from coverage (Anna Henningsen)
* [[`5f640416e0`](https://github.com/addaleax/lzma-native/commit/5f640416e0)] - **lib**: fix issue with invalid input (Anna Henningsen)

## 3.0.4, Nov 27 2017

* [[`669ee5098b`](https://github.com/addaleax/lzma-native/commit/669ee5098b)] - **package**: replace unavailable host to node-pre-gyp.addaleax.net (JianyingLi) [#48](https://github.com/addaleax/lzma-native/pull/48)

## 3.0.3, Nov 26 2017

* [[`fcba77ebe0`](https://github.com/addaleax/lzma-native/commit/fcba77ebe0)] - **ci**: include Node 9 support (Anna Henningsen)

## 3.0.2, Nov 07 2017

* [[`82b97dd94f`](https://github.com/addaleax/lzma-native/commit/82b97dd94f)] - **package**: update dependencies (Anna Henningsen)

## 3.0.1, Jul 04 2017

* [[`9e2ee5129f`](https://github.com/addaleax/lzma-native/commit/9e2ee5129f)] - **ci**: fix CI on Windows (Anna Henningsen)
* [[`8d75757031`](https://github.com/addaleax/lzma-native/commit/8d75757031)] - **lib**: fix race condition (Alexander Sagen) [#40](https://github.com/addaleax/lzma-native/pull/40)

## 3.0.0, Jun 26 2017

This is unlikely to break anybody’s code, but removing the build files after install might qualify as semver-major.

* [[`d5a252e3de`](https://github.com/addaleax/lzma-native/commit/d5a252e3de)] - **build**: rimraf build/ after install (Anna Henningsen)
* [[`fd2165e2ae`](https://github.com/addaleax/lzma-native/commit/fd2165e2ae)] - **ci**: add electron prebuilts again (Anna Henningsen)
* [[`039ac523d0`](https://github.com/addaleax/lzma-native/commit/039ac523d0)] - **lib**: explicit util.promisify() compat (Anna Henningsen)

## 2.0.4, Jun 25 2017

* [[`0cc00000b3`](https://github.com/addaleax/lzma-native/commit/0cc00000b3)] - **ci**: fix macOS prebuild binaries (Anna Henningsen)

## 2.0.3, Jun 21 2017

* [[`621628abac`](https://github.com/addaleax/lzma-native/commit/621628abac)] - **ci**: add Node 8 to CI matrix (Anna Henningsen)

## 2.0.2, May 18 2017

* [[`39bd6a2dc0`](https://github.com/addaleax/lzma-native/commit/39bd6a2dc0)] - **package**: pin nan to 2.5.1 (Anna Henningsen)

## 2.0.1, March 24 2017

* [[`c0491a0a07`](https://github.com/addaleax/lzma-native/commit/c0491a0a07)] - refactored binding.gyp (Refael Ackermann)
* [[`70883635b7`](https://github.com/addaleax/lzma-native/commit/70883635b7)] - **ci**: skip artifact encryption setup for non-tag builds (Anna Henningsen)

## 2.0.0, March 19 2017

Changes since 1.5.2

Notable changes:

* Dropped support for Node 0.10 and 0.12, which includes dropping `any-promise` and `util-extend` as dependencies.
* A changed path for the prebuilt binaries, which now includes versioning information.

* [[`83e0007061`](https://github.com/addaleax/lzma-native/commit/83e0007061)] - Bump version to 1.5.3
* [[`8021673b5d`](https://github.com/addaleax/lzma-native/commit/8021673b5d)] - Silence warnings about deprecated `NewInstance` usage
* [[`061933c4c7`](https://github.com/addaleax/lzma-native/commit/061933c4c7)] - **bin**: drop `commander` dependency
* [[`d752f96be4`](https://github.com/addaleax/lzma-native/commit/d752f96be4)] - **ci**: don’t use -flto for now
* [[`92188bee5e`](https://github.com/addaleax/lzma-native/commit/92188bee5e)] - **ci**: fix AppVeyor allocation failures
* [[`b79fa969d4`](https://github.com/addaleax/lzma-native/commit/b79fa969d4)] - **ci**: fix AppVeyor indexparser failures
* [[`5fcc17e54f`](https://github.com/addaleax/lzma-native/commit/5fcc17e54f)] - **ci**: fix Travis gcc CI failures
* [[`3f5d2609bd`](https://github.com/addaleax/lzma-native/commit/3f5d2609bd)] - **ci**: drop Node v0.10/v0.12 support
* [[`48e48ea25a`](https://github.com/addaleax/lzma-native/commit/48e48ea25a)] - **ci**: ci file housekeeping
* [[`c2d06b5e09`](https://github.com/addaleax/lzma-native/commit/c2d06b5e09)] - **ci**: work around node-gyp build failures
* [[`f94287f711`](https://github.com/addaleax/lzma-native/commit/f94287f711)] - **ci,test**: drop explicit nw.js testing
* [[`c61355984f`](https://github.com/addaleax/lzma-native/commit/c61355984f)] - **deps**: update xz to 5.2.3
* [[`b07f501e26`](https://github.com/addaleax/lzma-native/commit/b07f501e26)] - **doc**: leave blank lines around headings in README
* [[`dea30f3f20`](https://github.com/addaleax/lzma-native/commit/dea30f3f20)] - **lib**: drop util-extend dependency
* [[`0988b8d360`](https://github.com/addaleax/lzma-native/commit/0988b8d360)] - **lib**: refactor js-facing Stream into class
* [[`18bbdfc220`](https://github.com/addaleax/lzma-native/commit/18bbdfc220)] - **lib**: always use ES6 promises
* [[`f5030e027e`](https://github.com/addaleax/lzma-native/commit/f5030e027e)] - **lib**: fix unhandled Promise rejections
* [[`6e887ca52c`](https://github.com/addaleax/lzma-native/commit/6e887ca52c)] - **meta**: package.json housekeeping
* [[`e884b2e7c1`](https://github.com/addaleax/lzma-native/commit/e884b2e7c1)] - **prebuild**: add versioning to the binding file path
* [[`e8660b3728`](https://github.com/addaleax/lzma-native/commit/e8660b3728)] - **src**: use Nan::MakeCallback() for calling into JS
* [[`bd7ee7ce3f`](https://github.com/addaleax/lzma-native/commit/bd7ee7ce3f)] - **test**: use `fs.unlinkSync` for synchronous unlinking

