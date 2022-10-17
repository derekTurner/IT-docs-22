## Arrow functions

Arrow functions are a compact way of writing anonymous functions and attaching them to a constant object. Functions attached to constants need to be defined before they are used.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
// standard syntax
l1 = [1, 2];
l2 = [3, 4];

var old = function (l1, l2) {
    let a = [l1[0] + l2[0], l1[1] + l2[1]];
    return a;
};
l3 = old(l1, l2);
console.log(l3);

// arrow syntax
var arrow = (l1, l2) => {
    let a = [l1[0] + l2[0], l1[1] + l2[1]];
    return a;
};
l4 = arrow(l2, l3);
console.log(l4);
```

</div>

Arrow functions will be useful with arrays

### Array.find()

The 'find()' method finds the first element in an array which is returned by a test function

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const hero = ["flash", 2000, "generate lightening"];
let number = hero.find((value, index, array) => {
    console.log(Number.isInteger(value));
    return Number.isInteger(value);
});

console.log(number);
```

</div>

### Array.findIndex()

The 'findIndex()' method finds the index of first element in an array which is returned by a test function

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const hero = ["flash", 2000, "generate lightening"];
let number = hero.findIndex((value, index, array) => {
    console.log(Number.isInteger(value));
    return Number.isInteger(value);
});

console.log(number);
```

</div>

### Array.filter()

The `array.filter()` method returns an array of all the elements where a test function returns true.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const hero = ["flash", 2000, "generate lightening"];
let words = hero.filter((value, index, array) => {
    console.log(Number.isInteger(value));
    return !Number.isInteger(value);
});

console.log(words);
```

</div>

### Array.map()

The map method allows the values of an array to be passed to a function and a new array to be formed from the returned values.

Syntax to pass an argument into the function works when the function is anonymous and the argument after the {} is passed in as this. So here you can change the value of modula to see different results.  Note that `this` is not used in the function.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const data = [1, 2, 3, 4, 5, 6];
let modula = 2;

let modn = data.map((value) => {
    let a = value % modula;
    return a;
}, modula);

console.log(modn);
```

</div>

### Array.reduce()

This function returns a single value which is the result of a function applied to all the array elements

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const data = [1, -2, 3, -4, 5, -6, 7, -8, 9, -10];
var initial = 100;

let calc = data.reduce((total, currentValue) => {
    return total + currentValue ** 2;
}, initial);

console.log(calc);
```
</div>


### Reference

[MDN array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#instance_methods)
