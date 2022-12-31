/**
 * TBA
 */

const { BinaryData } = require('./index.js');

var stats = {
  tests: 0,
  passed: 0,
  failed: 0
};

class Tester {
  constructor(message, func, value) {
    stats.tests++;
    console.log(`Running test: ${message}...`);
    try {
      if (func(value)) {
        stats.passed++;
        console.log(`Test passed: ${message}!`);
      } else {
        stats.failed++;
        console.error(`Failed test: ${message}!!!`);
      }
    } catch (error) {
      console.error(`Failed test: ${message}!!!`, error);
      stats.failed++;
    }
  }
}

//////////////////////////////////


new Tester('Decimal value check', (value) => {
  let _test = new BinaryData(value);

  if (_test.get() !== '0101000101111110') { return false; }
  if (_test.getLength() !== 16) { return false; }
  if (_test.getHex() !== '517E') { return false; }
  if (_test.getDcimal() !== value) { return false; }

  return true;
}, 20862);


new Tester('Binary string check', (value) => {
  let _test = new BinaryData(value);

  if (_test.get() !== '0001000101111110') { return false; }
  if (_test.getLength() !== 16) { return false; }
  if (_test.getHex() !== '117E') { return false; }
  if (_test.getDcimal() !== 4478) { return false; }

  return true;
}, '1000101111110');


new Tester('Binary array check', (value) => {
  let _test = new BinaryData(value);

  if (_test.get() !== '0001000010100000') { return false; }
  if (_test.getLength() !== 16) { return false; }
  if (_test.getHex() !== '10A0') { return false; }
  if (_test.getDcimal() !== 4256) { return false; }

  return true;
}, [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]);

//////////////////////////////////

console.log(`Tests Passed: ${stats.passed}`);
console.log(`Tests Failed: ${stats.failed}`);
console.log(`Total Test: ${stats.tests}`);

console.log('Testing complete!');
