echo off

echo NOTE: Make sure you have NodeJS and Visual Studio with all C++ prequisites installed. Otherwise this won't work

call npm install .
call npm install -g pkg
call npm install node-gyp
call npm install win-dpapi
call npm rebuild
