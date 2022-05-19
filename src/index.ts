export let foo = () => undefined;
foo();
console.log("foo");

const visitor = () => {
  console.log("hello world...");
};
visitor();

interface Foo {
  foo: string;
}

const baz: Foo = {
  foo: "bazzz",
};
