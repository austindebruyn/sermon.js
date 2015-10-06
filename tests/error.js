
var Thou = require('..');
var expect = require('expect');

describe('error mode', function () {

    before(function () {
        Thou.shaltThrowErrors();
    });

    after(function () {
        Thou.shaltReturnBool();
    });

    it('should throw an error on failure', function () {
        expect(function () {
            Thou(2).shalt.eql(20);
        }).toThrow(Error);

        expect(function () {
            Thou({ name: 'Job' }).shalt.eql({ name: 'Job' });
        }).toNotThrow(Error);
    });

});
