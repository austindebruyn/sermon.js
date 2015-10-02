'use strict';

(function () {

    var exports = module.exports = Thou;

    function Thou (thou) {
        if ('undefined' === typeof thou || null == thou)
            throw new Error('Thou cannot be ' + (typeof thou));
        return new Commandment(thou);
    };

    var verbs = [ 'shall', 'shalt', 'is', 'are' ];
    var negatives = [ 'not', 'shallNot', 'shaltNot', 'shant' ];

    var satisfactory = function (thou, target) {
        if ('undefined' === typeof target) {
            return !!thou;
        }
        else if ('function' === typeof target) {
            return !!target(thou);
        }
        else if ('string' === typeof thou && target instanceof RegExp) {
            return !!thou.match(target);
        }
        else if ('string' === typeof target && thou instanceof RegExp) {
            return !!target.match(thou);
        }
        else if (thou instanceof RegExp && target instanceof RegExp) {
            return (
                (thou.source === target.source) &&
                (thou.global === target.global) && 
                (thou.ignoreCase === target.ignoreCase) &&
                (thou.multiline === target.multiline)
            );
        }
        return thou === target;
    };

    function Terminal () {
    };
    Terminal.prototype.be = 
    Terminal.prototype.eq = 
    Terminal.prototype.eql = 
    Terminal.prototype.equals = 
    Terminal.prototype.equal = 
    Terminal.prototype.do = 
    function (target) {
        if ('function' === typeof target)
            return !!(target(this.thou) || this.invert);
        return satisfactory(this.thou, target) || this.invert;
    };

    function Commandment (thou, invert) {
        this.invert = !!invert;
        this.thou = thou;

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
    Commandment.prototype = Object.create(Terminal.prototype);
    Commandment.prototype.constructor = Commandment;

})();