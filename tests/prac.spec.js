const assert = require('assert');

// module.exports = {
//   sayHello: function () {
//     return 'hello';
//   }
// }

describe("pow", function() {
    it("n squared of a given number", function() {
        /**
         * `it` block stops once `assert` faces any kinds of error.
         * Spliting `assert` is recommended just like below by generating another `it` block.
         */
        assert.equal(Math.pow(2,3),8);
        
        /**
         * Below `assert` inside of this same `it` block is not recommended.
         */
        // assert.equal(pow(3, 4),81);
    });

    it("n squared of a given number", function() {
        /**
         * Just like this, One test each. Spliting tests.
         * In addition, seperating non related tests are recommended as well.
         */
        assert.equal(Math.pow(3, 4),81);
    });

});