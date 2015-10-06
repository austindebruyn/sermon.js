
var Thou = require('..');
var expect = require('expect');

describe('implicit thou', function () {

    it('should assign the subject', function () {
        var Noah = { age: 32 };
        AndTheLordSaidUnto(Noah);
        Thou.shalt.have('age').be.equalTo(32);
    });

});
