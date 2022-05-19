"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foo = void 0;
let foo = () => undefined;
exports.foo = foo;
(0, exports.foo)();
console.log("foo");
const visitor = () => {
    console.log("hello world...");
};
visitor();
const baz = {
    foo: "bazzz",
};
