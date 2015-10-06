
# sermon.js

Test suites blessed by the almighty.

### contact_test.js
```
let Thou = require('sermon');
let austin = new Contact('Austin', { age: 20 });

AndTheLordSaidUnto(austin);

Thou.shalt.have('age').equal(20);
Thou.shalt.not.have('name').match(/Moses/i);
Thou.shalt.do(function () {
    return this.validateName();
});
```

## 

### other_examples.js
```
let Thou = require('sermon');

Thou(3).shalt.be(1 + 2);
Thou(controller).shall.not.do(function callback(thou) { ... });
Thou('he3llo').shalt.be(/he\dllo/);
```

### Judgment
Call `Judgment()` at the bottom of your test file to print the results
of your commandment suite.

## Using with another test framework

You can tell Sermon to throw errors instead of storing results or returning bools.
Include `Thou.shaltThrowErrors()` at the top of your file.
You can revert to the default mode with `Thou.shaltReturnBool()`.

### some_mocha_test.js
```
var Thou = require('sermon');
Thou.shaltThrowErrors();

describe('addition', function () {
    it('should add big numbers', function () {
        AndGodSaidUnto(1000 + 1000);
        Thou.shalt.be(2000);
    })
});

# $ mocha some_mocha_test.js
# addition
#   ✓ should add big numbers
# 1 passing (14ms)
```
