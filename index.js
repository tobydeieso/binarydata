/**
 * A word type
 * @typedef {Object} word
 * @property {string} binary
 * @property {string} hex
 * @property {number} decimal 
 */


/**
 * A custom binary data type, where it's stored as an array of numbers.
 */
class BinaryData {

  /**
   * TBA
   * @type {number|string|Array}
   */
  #_raw;

  /**
   * TBA
   * @type {string}
   */
  #_type;

  /**
   * TBA
   * @type {Array}
   */
  #_value;

  /**
   * TBA
   * @type {word[]}
   */
  #wordTable = [
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
   * TBA
   * @type {number[]}
   */
  #bitTable = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296 ]

  /**
   * TBA
   * @type {number[]}
   */
  #resolution = 4;

  /**
   * TBA
   * @param {number|string|Array} data
   */
  constructor(data) {
    this.set(data);
  }

  //////////////////
  // External API //
  //////////////////

  /**
   * TBA
   * @param {number|string|Array} data
   * @returns {boolean}
   */
  set(data) {
    this.#_raw = data;
    this.#_value = [];

    if (typeof data === 'number') {

      // Convert a decimal number
      this.#_type = 'decimal';
      this.#_value = this.#decimalToBinary(data);

    } else if (typeof data === 'string') {

      // Convert a string of 1's and 0's
      this.#_type = 'binaryString';
      this.#_value = this.#binaryStringToBinary(data);

    } else if (typeof data === 'object' && Array.isArray(data)) {

      // Convert an array of 0's and 1's
      this.#_type = 'binaryArray';
      this.#_value = this.#binaryArrayToBinary(data);

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
    return this.#_value.length;
  }

  /**
   * TBA
   * @returns {number|string|Array}
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
   * @param {string} binary 
   * @returns {word}
   */
  getWord(binary) {
    // TODO: Add support for partial words (e.g. less than 4 bits)
    return this.#wordTable.find(cell => binary === cell.binary) || this.#wordTable[0];
  }

  /**
   * TBA
   * @param {boolean} [asArra=false]
   * @returns {string|boolean[]}
   */
  get(asArray = false) {
    if (asArray) {
      return this.#_value.slice();
    }
    return this.#_value.join('');
  }

  /**
   * TBA
   * @returns {string}
   */
  getHex() {
    let hex = '';
    let binary = this.get();
    let word = (binary.length / 4) - 1;

    while (word >= 0) {
      hex = this.getWord(binary.slice(word * 4, (word * 4) + 4)).hex + hex;
      word--;
    }

    return hex;
  }

  /**
   * TBA
   * @returns {number}
   */
  getDecimal() {
    return this.#getDecimalInternal(this.#_value);
  }
  
  ////////////////////////
  // Bitwise Operations //
  ////////////////////////

  // TODO: Needs limits to fix operations to the bit depth in use (currently swaps to the
  // system depth due to using the core ECMA Script Bitwise operators

  /**
   * TBA
   * @returns {string}
   */
  and(data) {
    this.set(this.#convertToDecimal(data) & this.getDecimal());
    return this.get();
  }

  /**
   * TBA
   * @returns {string}
   */
  not() {
    let bitValues = this.get(true);
    bitValues.forEach((value, index) => {
      bitValues[index] = value ? 0 : 1;
    });
    this.set(bitValues);
    return this.get();
  }

  /**
   * TBA
   * @returns {string}
   */
  or(data) {
    this.set(this.#convertToDecimal(data) | this.getDecimal());
    return this.get();
  }

  /**
   * TBA
   * @returns {string}
   */
  xor(data) {
    this.set(this.#convertToDecimal(data) ^ this.getDecimal());
    return this.get();
  }

  /////////////////////////////////
  // Internal binary conversions //
  /////////////////////////////////

  #decimalToBinary(data) {
    let realBits = 0;
    let precisionBits = 0;
    let bitValues = [];

    // Find largest bit value
    for (let index = 0; index < this.#bitTable.length; index++) {
      if ((data >= this.#bitTable[index]) && (data < this.#bitTable[index + 1])) {
        realBits = index;
        break;
      }
    }

    // Convert TRUE bits to 1's and FALSE to 0's and append to bit array
    while (realBits >= 0) {
      let bitValue = this.#bitTable[realBits];
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

  #binaryStringToBinary(data) {
    let realBits = 0;
    let precisionBits = 0;
    let bitValues = [];

    // Trim the string so that it doesn't effect the precision
    data = data.trim();
    realBits = data.length;

    // Pad the string to the required precision, then create bit array from the split
    precisionBits = Math.ceil(realBits / this.#resolution) * this.#resolution;
    data.padStart(precisionBits, '0').split('').forEach((str) => {
      if ('01'.includes(str)) { bitValues.push(parseInt(str, 2)); }
    });

    return bitValues;
  }

  #binaryArrayToBinary(data) {
    let realBits = 0;
    let precisionBits = 0;
    let bitValues = [];

    realBits = data.length;

    // Pad the incomming array to the required precision
    precisionBits = Math.ceil(realBits / this.#resolution) * this.#resolution;
    while (data.length < precisionBits) {
      data.unshift(0);
    }

    // Create bit array from data, converting to 1's and 0's
    data.forEach((value) => {
      bitValues.push(value ? 1 : 0)
    });

    return bitValues;
  }

  //////////////////////////////////
  // Internal decimal conversions //
  //////////////////////////////////

  #getDecimalInternal(binaryList) {
    let decimal = 0;

    binaryList.slice().reverse().forEach((value, bit) => {
      if (value) { decimal += Math.pow(2, bit); }
    });

    return decimal;
  }

  #convertToDecimal(data) {
    if (typeof data === 'number') {

      // Return the raw decimal number
      return data;

    } else if (typeof data === 'string') {

      // Convert a string of 1's and 0's
      return this.#getDecimalInternal(this.#binaryStringToBinary(data));

    } else if (typeof data === 'object' && Array.isArray(data)) {

      // Convert an array of 0's and 1's
      return this.#getDecimalInternal(this.#binaryArrayToBinary(data));

    }

    return 0;
  }
}


module.exports = {
  BinaryData
};