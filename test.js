import BinaryData from './index.js';

var stats = {
  tests: 0,
  passed: 0,
  failed: 0
};


/**
 * TBA
 */
class Tester {
  constructor() {
    let args = [...arguments];
    let message = args.shift();
    let func = args.shift();
    stats.tests++;
    console.log(`Test: ${message} (${args})...`);
    try {
      if (func(...args)) {
        stats.passed++;
        console.log(`Test: ${message} (Passed)`);
      } else {
        stats.failed++;
        console.error(`Test: ${message} (Failed!)`);
      }
    } catch (error) {
      console.error(`Test: ${message} (Failed!!!)`, error);
      stats.failed++;
    }
    console.log('');
  }
}


//////////////////////////////////

console.log('Executing tests...');
console.log('==================');
console.log('');

//////////////////////////////////


new Tester('Decimal value check', (value) => {
  let _test = new BinaryData(value);

  if (_test.get() !== '0101000101111110') { return false; }
  if (_test.getLength() !== 16) { return false; }
  if (_test.getHex() !== '517E') { return false; }
  if (_test.getDecimal() !== value) { return false; }

  return true;
}, 20862);


new Tester('Binary string check', (value) => {
  let _test = new BinaryData(value);

  if (_test.get() !== '000101100001') { return false; }
  if (_test.getLength() !== 12) { return false; }
  if (_test.getHex() !== '161') { return false; }
  if (_test.getDecimal() !== 353) { return false; }

  return true;
}, '101100001');


new Tester('Binary array check', (value) => {
  let _test = new BinaryData(value);

  if (_test.get() !== '0001000010100000') { return false; }
  if (_test.getLength() !== 16) { return false; }
  if (_test.getHex() !== '10A0') { return false; }
  if (_test.getDecimal() !== 4256) { return false; }

  return true;
}, [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]);


new Tester('Bitwise and check', (a, b) => {
  let _test = new BinaryData(a);

  if (_test.get() !== '1101') { return false; }
  if (_test.getLength() !== 4) { return false; }
  if (_test.getHex() !== 'D') { return false; }
  if (_test.getDecimal() !== 13) { return false; }
  if (_test.and(b) !== '1001') { return false; }

  return true;
}, 13, 11);


new Tester('Bitwise not check', (value) => {
  let _test = new BinaryData(value);

  if (_test.get() !== '0001') { return false; }
  if (_test.getLength() !== 4) { return false; }
  if (_test.getHex() !== '1') { return false; }
  if (_test.getDecimal() !== 1) { return false; }
  if (_test.not() !== '1110') { return false; }

  return true;
}, 1);


new Tester('Bitwise or check', (a, b) => {
  let _test = new BinaryData(a);

  if (_test.get() !== '0001') { return false; }
  if (_test.getLength() !== 4) { return false; }
  if (_test.getHex() !== '1') { return false; }
  if (_test.getDecimal() !== 1) { return false; }
  if (_test.or(b) !== '0011') { return false; }

  return true;
}, 1, 2);


new Tester('Bitwise xor check', (a, b) => {
  let _test = new BinaryData(a);

  if (_test.get() !== '0101') { return false; }
  if (_test.getLength() !== 4) { return false; }
  if (_test.getHex() !== '5') { return false; }
  if (_test.getDecimal() !== 5) { return false; }
  if (_test.xor(b) !== '0110') { return false; }

  return true;
}, 5, 3);


//////////////////////////////////


console.log('=============');
console.log('Testing Stats');
console.log('-------------');
console.log(`Passed: ${stats.passed}`);
console.log(`Failed: ${stats.failed}`);
console.log(`Total:  ${stats.tests}`);
console.log('=============');
console.log('');
