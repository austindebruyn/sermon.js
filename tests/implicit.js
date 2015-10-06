
var Thou = require('..');
var expect = require('expect');

describe('implicit thou', function () {

    it('should assign the subject', function () {
        var Noah = { age: 32 };
        AndTheLordSaidUnto(Noah);
        Thou.shalt.have('age').be.equalTo(32);
    });

    it('should be able to change subject', function () {
        var Noah = { age: 32 };
        var Jesus = { age: 2015 };

        AndTheLordSaidUnto(Noah);
        Thou.shalt.have('age').be.equalTo(32);
        
        AndTheLordSaidUnto(Jesus);
        Thou.shalt.have('age').be.equalTo(2015);
    });

});
