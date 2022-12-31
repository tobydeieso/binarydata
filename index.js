class BinaryData {

  #_values;

  #_bits;

  constructor(data, bits = 8) {
    this.#_bits = bits;

    if (typeof data === 'string') {
      this.#_values = data.padStart(this.#_bits, '0').split('');
    } else if (typeof data === 'object' && Array.isArray(data)) {
      this.#_values.fill(0, 0, (data.length - 1));
      data.forEach((value) => {
        this.#_values.push(value ? true : false);
      });
    }

    console.log(this.#_values, this.#_bits);
  }

  set() {

  }

  get(asString = false) {
    
  }

  getHex() {

  }

  getValue() {

  }

}


module.exports = {
  BinaryData,
  default: BinaryData,
}