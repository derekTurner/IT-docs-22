## Arrays

Array methods to be aware of include: from, keys, find, findIndex and map 

Arrays can be iterated around using for/of loop structure

Destructuring is the process of drawing items from an array structure into individual variables.


### Array.from()

This allows an array to be created from an object with a length or which is iterable.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
var notes = Array.from("ABCDEFG");
console.log(notes);
```
</div>

A JSON object itself is not iterable, but the iterable keys or values can be generated from it and these can be used with Array.from()

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const box = {material:"metal", width:10, height:6, depth:3}
// array of object keys
var keyArray = Array.from(Object.keys(box));
console.log(keyArray);

// array of object values
var valueArray = Array.from(Object.values(box));
console.log(valueArray);
```
</div>

### Array.keys() with for/of loop

An array is an object so the keys and values can be extracted from it in a similar way to the above object.  

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const hero = ["flash",2000, "generate lightening"];

const heroIterator = hero.keys();
for (var key of heroIterator){console.log(key)};
```
</div>


This points to a difference between arrays and objects, arrays are always indexed by number while objects are indexed by strings

### Array.find()

The 'find()' method finds the first element in an array which is returned by a test function

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const hero = ["flash",2000, "generate lightening"];
let number = hero.find(testFunction);


function testFunction(value, index, array) {
  console.log(Number.isInteger(value));
  return Number.isInteger(value);
} 

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
const hero = ["flash",2000, "generate lightening"];
let number = hero.findIndex(testFunction);


function testFunction(value, index, array) {
  console.log(Number.isInteger(value));
  return Number.isInteger(value);
} 

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
const hero = ["flash",2000, "generate lightening"];
let words = hero.filter(testFunction);


function testFunction(value, index, array) {
  console.log(Number.isInteger(value));
  return !Number.isInteger(value);
} 

console.log(words);
```
</div>

### Array.map()

The map method allows the values of an array to be passed to a function and a new array to be formed from the returned values.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const data = [1,2,3,4,5,6];
let mod3 = data.map(mod);


function mod (value) {
  let a = value % 3;
  return a;
} 

console.log(mod3);
```
</div>
Syntax to pass an argument into the function works when the function is anonymous and the argument after the {} is passed in as this.  So here you can change tohe value of modula to see different results.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const data = [1,2,3,4,5,6];
let modula = 4;

let modn = data.map(function (value) {
  let a = value % this;
  return a;
},modula);

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
const data = [1,-2,3,-4,5,-6,7,-8,9,-10];
let calc = data.reduce(reducerFunction, 0);

function reducerFunction(total, currentValue) {
  return total + currentValue**2;
} 

console.log(calc);
```
</div>

If the initial value is passed in to an anonymous function the calculation can start from a non-zero value.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const data = [1,-2,3,-4,5,-6,7,-8,9,-10];
var initial = 100;

let calc = data.reduce(function (total, currentValue) {
  return total + currentValue**2;
} , initial);


console.log(calc);
```
</div>



### Reference

[MDN array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#instance_methods)