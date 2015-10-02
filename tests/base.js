
var Thou = require('..');
var expect = require('expect');

describe('Thou', function () {

    describe('shall', function () {
        it('should test equality in a few different ways', function () {
            expect( Thou(2).shall.be(2) ).toEqual(true);
            expect( Thou(2).shall.be(3) ).toEqual(false);
            expect( Thou(2).shall.be('2') ).toEqual(false);
        });
    });

    describe('negatives', function () {
        it('should chain in all sorts of ways', function () {
            expect( Thou(2).shall.not.be(3) ).toEqual(true);
            expect( Thou(2).shallNot.be(3) ).toEqual(true);
            expect( Thou(2).shalt.not.do(function (a) { return a - 2; }) ).toEqual(true);
        });
    });

    describe('regular expressions', function () {
        it('should match regex and string', function () {
            expect( Thou('he3llo').shalt.be(/he\dllo/) ).toEqual(true);
            expect( Thou(/abc/).shalt.be('abcdef') ).toEqual(true);
            expect( Thou('he3llo').shalt.not.be(/he\dlla/) ).toEqual(true);
        });
        it('should test equality', function () {
            //expect( Thou(/^\.abc[.+]!$/ig).shall.not.equal(/^\.abc[.+]!$/) ).toEqual(true);
            expect( Thou(/^\.abc[.+]!$/ig).shalt.equal(/^\.abc[.+]!$/ig) ).toEqual(true);
        });
    });

});
