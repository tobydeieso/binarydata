/*!
 * @tobydeieso / BinaryData
 * Copyright (C) 2023  Toby De Ieso
 */


/**
 * A binary number represented in string format, containing only the characters 1 and 0.
 * @typedef {string} binaryString
 * @example
 * '1001101' // The decimal value of 77
 */

/**
 * A binary number represented in string format, containing only the characters 0-9 and A-F.
 * @typedef {string} hexString
 * @example
 * '0x4D' // The decimal value of 77
 */

/**
 * A binary number represented as an array of numbers with either the value of 1 or 0.
 * @typedef {number[]} binaryArray
 * @example
 * [1, 1, 0, 1, 0, 0, 1] // The decimal value of 77
 */

/**
 * An Object representing a single binay value in 3 different ways.
 * @typedef {Object} word
 * @property {binaryString} binary - A string that represents a binary value, consisting of 1's and 0's.
 * @property {hexString} hex - A string that represents a hexadecimal value, consisting of the characters 0-9 and A-F.
 * @property {decimal} decimal - A decimal number value.
 */

/**
 * A integer number value, anywhere from 0 to 4,294,967,295.
 * @typedef {number} decimal
 */


/**
 * Astro's BinaryData Module
 * @module astro-binarydata
 */

/**
 * A custom binary data type, where the binary data is stored as an array of 
 * integer numbers (0's and 1's) with a bit length rounded up to the nearest 4 bit (word).
 * The class has methods to return the binary value in other formats, including 
 * a {@link binaryString}, {@link hexString} or {@link decimal} number value.
 */
class BinaryData {

  /**
   * A quick access table for word objects (e.g. 4 bit binary values), from 0000 to 1111.
   * @type {word[]}
   * @static
   */
  static #wordTable = [
    { binary: '0000', hex: '0', decimal: 0 },
    { binary: '0001', hex: '1', decimal: 1 },
    { binary: '0010', hex: '2', decimal: 2 },
    { binary: '0011', hex: '3', decimal: 3 },
    { binary: '0100', hex: '4', decimal: 4 },
    { binary: '0101', hex: '5', decimal: 5 },
    { binary: '0110', hex: '6', decimal: 6 },
    { binary: '0111', hex: '7', decimal: 7 },
    { binary: '1000', hex: '8', decimal: 8 },
    { binary: '1001', hex: '9', decimal: 9 },
    { binary: '1010', hex: 'A', decimal: 10 },
    { binary: '1011', hex: 'B', decimal: 11 },
    { binary: '1100', hex: 'C', decimal: 12 },
    { binary: '1101', hex: 'D', decimal: 13 },
    { binary: '1110', hex: 'E', decimal: 14 },
    { binary: '1111', hex: 'F', decimal: 15 }
  ];

  /**
   * An array of bit values for each position upto 32 bit.
   * @type {number[]}
   * @static
   */
  static #bitTable = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296 ];

  /**
   * TBA
   * @type {string}
   * @static
   */
  static #validBinaryChars = '01';

  /**
   * TBA
   * @type {string}
   * @static
   */
  static #validHexChars = '0123456789ABCDEF';

  /**
   * TBA
   * @type {string}
   * @static
   */
  static #hexPrefix = '0x';

  /**
   * A copy of the raw data passed into the constructor.
   * @type {decimal|binaryString|binaryArray}
   */
  #_raw;

  /**
   * The detected type of data that was passed into the constructor, represented as a string.
   * It can be one of the following 3 values:
   * * 'decimal' : {@link decimal}
   * * 'binaryString' : {@link binaryString}
   * * 'binaryArray' : {@link binaryArray}
   * @type {string}
   */
  #_type;

  /**
   * The binary value that all internal methods will be run from.
   * @type {binaryArray}
   */
  #_value;

  /**
   * The minimum bit resolution for all internal binary objects.
   * @type {number}
   */
  #resolution = 4;


  //////////////////
  // External API //
  //////////////////

  /**
   * TBA
   * @param {decimal|binaryString|binaryArray} data
   */
  constructor(data) {
    this.set(data);
  }


  /**
   * TBA
   * @param {decimal|binaryString|binaryArray} data
   * @returns {boolean}
   */
  set(data) {
    this.#_raw = Array.isArray(data) ? data.slice() : data;
    this.#_value = [];

    if (typeof data === 'number') {

      // Convert a decimal number
      this.#_type = 'decimal';
      this.#_value = this.#decimalToBinary(data);

      if (!this.#_value) {
        // Error
        console.error(`Invalid decimal number (input: ${this.#_raw})`);
        this.#_type = 'error';
        return false;
      }

    } else if (typeof data === 'string') {
      // Trim the string so that it doesn't effect the transform
      data = data.trim();

      if (data.startsWith(BinaryData.#hexPrefix)) {

        // Convert a hexadecimal string, beginging with '0x'
        this.#_type = 'hexString';
        this.#_value = this.#hexStringToBinary(data);

        if (!this.#_value) {
          // Error
          console.error(`Invalid hexadecimal string (input: ${this.#_raw})`);
          this.#_type = 'error';
          return false;
        }

      } else {

        // Convert a string of 1's and 0's
        this.#_type = 'binaryString';
        this.#_value = this.#binaryStringToBinary(data);

        if (!this.#_value) {
          // Error
          console.error(`Invalid binary string (input: ${this.#_raw})`);
          this.#_type = 'error';
          return false;
        }

      }
    } else if (Array.isArray(data)) {

      // Convert an array of 0's and 1's
      this.#_type = 'binaryArray';
      this.#_value = this.#binaryArrayToBinary(data);

      if (!this.#_value) {
        // Error
        console.error(`Invalid binary array (input: ${this.#_raw})`);
        this.#_type = 'error';
        return false;
      }

    } else {

      // Error
      console.error(`Invalid data type, must be a 'number', 'string' or 'array' (type: ${typeof data})`);
      this.#_type = 'error';
      return false;

    }

    return true;
  }


  /**
   * Returns the bit length of the value stored
   * @returns {number}
   */
  getLength() {
    if (this.#_type !== 'error') {
      return this.#_value.length;
    }
    return 0;
  }


  /**
   * TBA
   * @returns {decimal|binaryString|binaryArray}
   */
  getRaw() {
    return this.#_raw;
  }


  /**
   * TBA
   * @returns {string}
   */
  getConversionType() {
    return this.#_type;
  }


  /**
   * TBA
   * @returns {binaryString|boolean}
   */
  getString() {
    if (this.#_type !== 'error') {
      return this.#_value.join('');
    }
    return false;
  }

  /**
   * TBA
   * @returns {binaryString|boolean}
   */
  get() {
    if (this.#_type !== 'error') {
      return this.#_value.join('');
    }
    return false;
  }


  /**
   * TBA
   * @returns {binaryArray|boolean}
   */
  getArray() {
    if (this.#_type !== 'error') {
      return this.#_value.slice();
    }
    return false;
  }


  /**
   * TBA
   * @returns {hexString|boolean}
   */
  getHex() {
    if (this.#_type !== 'error') {
      let hex = BinaryData.#hexPrefix;
      let binaryArray = this.getArray();

      while (binaryArray.length) {
        hex += this.#getWordFromBinary(binaryArray.splice(0, 4).join('')).hex;
      }

      return hex;
    }
    return false;
  }


  /**
   * TBA
   * @returns {decimal|boolean}
   */
  getDecimal() {
    if (this.#_type !== 'error') {
      return this.#getDecimalInternal(this.#_value);
    }
    return false;
  }
  

  ////////////////////////
  // Bitwise Operations //
  ////////////////////////

  // TODO: Needs limits to fix operations to the bit depth in use (currently swaps to the
  // system depth due to using the core ECMA Script Bitwise operators

  /**
   * TBA
   * @returns {string|undefined}
   */
  and(data) {
    if (this.#_type !== 'error') {
      this.set(this.#convertToDecimal(data) & this.getDecimal());
      return this.get();
    }
    return undefined;
  }


  /**
   * TBA
   * @returns {string|undefined}
   */
  not() {
    if (this.#_type !== 'error') {
      let bitValues = this.getArray();
      bitValues.forEach((value, index) => {
        bitValues[index] = value ? 0 : 1;
      });
      this.set(bitValues);
      return this.get();
    }
    return undefined;
  }


  /**
   * TBA
   * @returns {string|undefined}
   */
  or(data) {
    if (this.#_type !== 'error') {
      this.set(this.#convertToDecimal(data) | this.getDecimal());
      return this.get();
    }
    return undefined;
  }


  /**
   * TBA
   * @returns {string|undefined}
   */
  xor(data) {
    if (this.#_type !== 'error') {
      this.set(this.#convertToDecimal(data) ^ this.getDecimal());
      return this.get();
    }
    return undefined;
  }


  /////////////////////////////////
  // Internal binary conversions //
  /////////////////////////////////

  /**
   * TBA
   * @param {string} binary 
   * @returns {word}
   */
  #getWordFromBinary(binary) {
    // TODO: Add support for partial words (e.g. less than 4 bits)
    return BinaryData.#wordTable.find(cell => binary === cell.binary) || BinaryData.#wordTable[0];
  }

  /**
   * TBA
   * @param {string} hex 
   * @returns {word}
   */
  #getWordFromHex(hex) {
    return BinaryData.#wordTable.find(cell => hex === cell.hex) || BinaryData.#wordTable[0];
  }

  /**
   * TBA
   * @param {decimal} data 
   * @returns {binaryArray}
   */
  #decimalToBinary(data) {
    let realBits = 0;
    let precisionBits = 0;
    let bitValues = [];

    // Find largest bit value
    for (let index = 0; index < BinaryData.#bitTable.length; index++) {
      if ((data >= BinaryData.#bitTable[index]) && (data < BinaryData.#bitTable[index + 1])) {
        realBits = index;
        break;
      }
    }

    // Convert TRUE bits to 1's and FALSE to 0's and append to bit array
    while (realBits >= 0) {
      let bitValue = BinaryData.#bitTable[realBits];
      if (data >= bitValue) {
        data -= bitValue;
        bitValues.push(1);
      } else {
        bitValues.push(0);
      }
      realBits--;
    }

    // Pad the bit array to the required precision
    precisionBits = Math.ceil(bitValues.length / this.#resolution) * this.#resolution;
    while (bitValues.length < precisionBits) {
      bitValues.unshift(0);
    }

    return bitValues;
  }

  /**
   * TBA
   * @param {hexString} data 
   * @returns {binaryArray}
   */
  #hexStringToBinary(data) {
    let success = true;
    let bitValues = [];

    // Convert to uppercase to prevent issues going forward
    data = data.toUpperCase();

    // Check for valid hex values, find relevant word object, then create bit array from the binaryString split
    data.substring(2, data.length).split('').forEach((str) => {
      if (BinaryData.#validHexChars.includes(str)) {
        this.#getWordFromHex(str).binary.split('').forEach((value) => {
          bitValues.push(parseInt(value, 2));
        });
      } else {
        success = false;
      }
    });

    if (success) { return bitValues; }
    return false;
  }

  /**
   * TBA
   * @param {binaryString} data 
   * @returns {binaryArray}
   */
  #binaryStringToBinary(data) {
    let success = true;
    let realBits = 0;
    let precisionBits = 0;
    let bitValues = [];

    realBits = data.length;

    // Pad the string to the required precision, then create bit array from the split
    precisionBits = Math.ceil(realBits / this.#resolution) * this.#resolution;
    data.padStart(precisionBits, '0').split('').forEach((str) => {
      if (BinaryData.#validBinaryChars.includes(str)) {
        bitValues.push(parseInt(str, 2));
      } else {
        success = false;
      }
    });

    if (success) { return bitValues; }
    return false;
  }

  /**
   * TBA
   * @param {binaryArray} data 
   * @returns {binaryArray}
   */
  #binaryArrayToBinary(data) {
    let success = true;
    let realBits = 0;
    let precisionBits = 0;
    let bitValues = [];

    realBits = data.length;

    // Pad the incomming array to the required precision
    precisionBits = Math.ceil(realBits / this.#resolution) * this.#resolution;
    while (data.length < precisionBits) {
      data.unshift(0);
    }

    // Create bit array from data, checking f0r 1's and 0's
    data.forEach((value) => {
      if (value === 1 || value === 0) {
        bitValues.push(value);
      } else {
        success = false;
      }
    });

    if (success) { return bitValues; }
    return false;
  }

  //////////////////////////////////
  // Internal decimal conversions //
  //////////////////////////////////

  /**
   * TBA
   * @param {binaryArray} data 
   * @returns {decimal}
   */
  #getDecimalInternal(data) {
    let decimal = 0;

    data.slice().reverse().forEach((value, bit) => {
      if (value) { decimal += Math.pow(2, bit); }
    });

    return decimal;
  }

  /**
   * TBA
   * @param {decimal|binaryArray|binaryString} data 
   * @returns {decimal}
   */
  #convertToDecimal(data) {
    if (typeof data === 'number') {

      // Return the raw decimal number
      return data;

    } else if (typeof data === 'string') {

      // Convert a string of 1's and 0's
      return this.#getDecimalInternal(this.#binaryStringToBinary(data));

    } else if (Array.isArray(data)) {

      // Convert an array of 0's and 1's
      return this.#getDecimalInternal(this.#binaryArrayToBinary(data));

    }

    return 0;
  }
}


export { BinaryData as default };
