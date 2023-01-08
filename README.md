# BinaryData

A pseudo binary object type class, scripted as an ECMAScript Module, for use within Node based development. 

## Introduction

Internally the **BinaryData** class stores data as an array of integer numbers (0's and 1's), with an array (bit) length padded out to the nearest multiple of 4 (e.g. 1 word), and limited to a maximum of 32 (e.g. 32 bits).

When creating a new **BinaryData** instance, a range of different input data types can be used, including:

* **binaryArray**: an array of 1's and 0's (as numbers), e.g. `[ 1, 0, 0, 1, 1, 0, 1 ]`
* **binaryString**: a binary string of 1's and 0's, e.g. `'1001101'`
* **hexString**: a hexadecimal string (containing uppercase A-F characters), prefixed with `'0x'`, e.g. `'0x4D'`, and
* **decimal**: a decimal value, stored as a number, e.g. `77`
  * *Due to the 32 bit limitations, values are limited to an integer from 0 to 4,294,967,295.*

> **Note:** In the above examples, all types were referencing the same decimal value of 77.

Once you have a new **BinaryData** instance, you are then able to access the base methods to convert the internal binary data into different formats. Or if the binary data requires manipulation, you have access to basic bitwise operations. 

Unlike the default ECMAScript bitwise operators, the **BinaryData** operators will function at the bit depth of the instances value. For example, running the bitwise `not` operation on an initial input **binaryString** value of `'100010'` will return `'11011101'`. This is due to the fact that the initial input was only 6 bits, and therefore padded out nearest word, e.g. 8 bits.

## Prerequisites

* [Node.js](https://nodejs.org/) (^12.x)

## Installation

Nothing complicated here, just a simple npm package, installed with the following command:

```
npm install astro-binarydata
```

## Usage

### Importing into your code

ECMAScript Module usage...

```javascript
import BinaryData from '@tobydeieso/binarydata';
```

CommonJS usage...

```javascript
const BinaryData = require('@tobydeieso/binarydata');
```

### Creating a new BinaryData instance

Using a binary array argument...

```javascript
let myBinary = new BinaryData([1, 0, 1, 1, 1, 0, 1]);
```

Using a binary string argument...

```javascript
let myBinary = new BinaryData('1011101');
```

Using a hexadecimal string argument...

```javascript
let myBinary = new BinaryData('0x5D');
```

Using a decimal number argument...

```javascript
let myBinary = new BinaryData(93);
```

### Accessing BinaryData

Just like when creating a new instance using different input formats, it is possible to convert the internal binary array back into the following types:

> **Note:** All operations were run on the initial binary value of `01011101`

**binaryString**

```javascript
myBinary.get();
// '01011101'
myBinary.getString();
// '01011101'
```

**binaryArray**

```javascript
myBinary.getArray();
// [0, 1, 0, 1, 1, 1, 0, 1]
```

**hexString**

```javascript
myBinary.getHex();
// '0x5D'
```

**decimal**

```javascript
myBinary.getDecimal();
// 93
```

### Bitwise Operations

> **Note:** All operations were run on the initial binary value of `01011101`

**and**

```javascript
myBinary.and('10011');
// '00010001'
```

**not**

```javascript
myBinary.not();
// '10100010'
```

**or**

```javascript
myBinary.or('10011');
// '01011111'
```

**xor**

```javascript
myBinary.xor('10011');
// '01001110'
```

### Other Methods

**set**

To set a new binary value on the BinaryData instance, just call `set` and pass in any of the types supported by the constructor.

```javascript
myBinary.set('110010111010');
// true
```

**getLength**

To access the bit depth of the BinaryData instance, call `getLength`.

```javascript
let myBinary = new BinaryData('1011101');
myBinary.getLength();
// 8
```

**getConversionType**

To find out the internal routine used to generate the internal binaryArray data, call `getConversionType`.

```javascript
let myBinary = new BinaryData('1011101');
myBinary.getConversionType();
// 'binaryString'
```

The possible returned values from `getConversionType` are:

* `'binaryArray'`
* `'binaryString'`
* `'hexString'`
* `'decimal'`
* `'error'`

### Detecting Conversion Errors

If you have just created a new **BinaryData** instance, then check to see if the value returned from `getConversionType` equals 'error'. If it does, that means something went wrong in the conversion process.

```javascript
let myBinary = new BinaryData({});
if (myBinary.getConversionType() === 'error') {
  // You have an error with your provided data and the conversion routines failed to create a binary array.
};
```

If you are changing the value of a **BinaryData** instance, then the `set` method will return `true` if it was successful or `false` if it wasn't.

```javascript
if (!myBinary.set('13110')) {
  // You have an error with your provided data and the conversion routines failed to create a binary array.
};
```

## Documentation

The detailed JSDoc formatted documentation can be created for this project, by;

1. cloning the repository to your local system `git clone https://github.com/tobydeieso/astro-binarydata.git`, then
2. installing the required packages using `npm install` within the projects folder, and finally
3. running the command `npm run docs`

The documentation will now be accessible from with the `./docs` folder, and all you need to do is open the `index.html` file within your chosen browser.

## Testing and Validation

A lightweight testing script has been included for local validation. Similar to the documentation all you need to do is run the command `npm run test` (once the repository is on your local system).

## TODO

* Complete JSDoc code comments.

## Credits

Developed by Toby De Ieso