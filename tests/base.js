
var Thou = require('..');
var expect = require('expect');

describe('Thou', function () {

    describe('shall', function () {

        it('should test equality in a few different ways', function () {
            expect( Thou(2).shall.be(2) ).toEqual(true);
            expect( Thou(2).shall.be(3) ).toEqual(false);
            expect( Thou(2).shall.be('2') ).toEqual(false);
        })

    });

});
