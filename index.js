'use strict';

(function () {

    var exports = module.exports = Thou;

    function Thou (thou) {
        if ('undefined' === typeof thou || null == thou)
            throw new Error('Thou cannot be ' + (typeof thou));
        return new Commandment(thou);
    };

    var verbs = [ 'shall', 'shalt', 'is' ];
    var negatives = [ 'not', 'shant', 'shallNot', 'shaltNot' ];

    function Terminals () {
    };
    Terminals.prototype.be = function (obj) {
        return obj === this.obj;
    };

    function Commandment (obj, invert) {
        this.invert = !!invert;
        this.obj = obj;

        verbs.forEach(function (verb) {
            this[verb] = this;
        }.bind(this));

        negatives.forEach(function (negative) {
            Object.defineProperty(this, negative, {
                get: function () {
                    return new Commandment(this, true);
                }
            });
        }.bind(this));
    };
    Commandment.prototype = Object.create(Terminals.prototype);
    Commandment.prototype.constructor = Commandment;

})();