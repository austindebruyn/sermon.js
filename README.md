
# sermon.js

Test suites blessed by the almighty.

```
#contact_test.js
var austin = new Contact('Austin', { age: 20 });

AndTheLordSaidUnto(austin);

Thou.shalt.have('age').equal(20);
Thou.shalt.not.have('name').match(/Moses/i);
Thou.shalt.do(function () {
    return this.validateName();
});
```

```
#other_examples.js
Thou(3).shalt.be(1 + 2);
Thou(controller).shall.not.do(function callback(thou) { ... });
Thou('he3llo').shalt.be(/he\dllo/);
```
