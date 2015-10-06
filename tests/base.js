
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

});

describe('#satisfactory', function () {

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

    describe('arays', function () {
        it('should iterate', function () {
            expect( Thou([2, 3]).shalt.equal([2, 3]) ).toEqual(true);
            expect( Thou([2, 3, 'a', /b6a$/]).shalt.be([2, 3, 'a', /b6a$/]) ).toEqual(true);
            expect( Thou([2, 3, 'A', /b6a$/]).shalt.be([2, 3, 'a', /b6a$/]) ).toEqual(false);
        });
        it('should deep search', function () {
            expect( Thou([2, [{key: 'val'}, 'a']]).shalt.equal([2, [{key: 'val'}, 'a']]) ).toEqual(true);
            expect( Thou([[], [], [undefined]]).shalt.be([[], [], [[]]]) ).toEqual(false);
        });
    });

    describe('objects', function () {
        it('should iterate', function () {
            expect( Thou({key: 'val', hey: [2, 3]}).shalt.be({key: 'val', hey: [2, 3]}) ).toEqual(true);
            expect( Thou({key: 'a', hey: [1, 1, 1]}).shalt.be({key: 'a', hey: [1, [], 1]}) ).toEqual(false);
        });
        it('should dereference properties', function () {
            expect( Thou({ age: 20 }).shalt.have('age').equal(20) ).toEqual(true);
            expect( Thou({ h: /^okay$/, i: /^okaya$/ }).shalt.have('h').equal(/^okay$/) ).toEqual(true);
            expect( Thou({}).shall.have('money').equal(100) ).toEqual(false);
            expect( Thou({ money: 50 }).shalt.not.have('money').equal(100) ).toEqual(true);
        });
    });

});
