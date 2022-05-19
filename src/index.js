"use strict";
exports.__esModule = true;
exports.foo = void 0;
var foo = function () { return undefined; };
exports.foo = foo;
(0, exports.foo)();
console.log("foo");
var visitor = function () {
    console.log("hello world...");
};
visitor();
var baz = {
    foo: "bazzz"
};
