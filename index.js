'use strict';

(function () {

    var _ = require('lodash');

    var mode = 'bool'

    var exports = module.exports = Thou;

    function Thou (thou) {
        if ('undefined' !== typeof thou)
            setSubject(thou);
        return new Commandment(thou || Thou._subject || noSubject());
    }

    var intros = [ 'AndTheLordSaidUnto', 'AndGodSaidUnto' ];
    var verbs = [ 'shall', 'shalt', 'is', 'are', 'should' ];
    var negatives = [ 'not', 'shallNot', 'shaltNot', 'shant', 'shouldNot' ];
    var terminals = ['be', 'eq', 'eql', 'equal', 'equals', 'eqTo', 'eqlTo', 'equalTo', 'match', 'do'];

    var satisfactory = function satisfactory (thou, target) {
        if ('undefined' === typeof target) {
            return !!thou;
        }
        else if ('function' === typeof target) {
            return !!target.bind(thou)(thou);
        }
        else if ('string' === typeof thou && target instanceof RegExp) {
            return !!thou.match(target);
        }
        else if ('string' === typeof target && thou instanceof RegExp) {
            return !!target.match(thou);
        }
        else if (target instanceof Array && thou instanceof Array) {
            if (target.length !== thou.length) return false;
            for (let i = 0; i < target.length; i++) {
                if (!satisfactory(target[i], thou[i])) return false;
            }
            return true;
        }
        else if (thou instanceof RegExp && target instanceof RegExp) {
            return (
                (thou.source === target.source) &&
                (thou.global === target.global) && 
                (thou.ignoreCase === target.ignoreCase) &&
                (thou.multiline === target.multiline)
            );
        }
        return _.isEqual(thou, target);
    };

    var terminal = function terminal (target) {
        if ('function' === typeof target)
            return !!(target(this.thou) || this.invert);
        var satisfiesCommandment = satisfactory(this.thou, target) || this.invert;
        return evaluate(satisfiesCommandment);
    };
    var assignTerminalToKey = function assignTerminalToKey (key) {
        this[key] = terminal;
    };
    var Terminal = function Terminal () {};
    terminals.forEach(assignTerminalToKey.bind(Terminal.prototype));

    // This is special... we want to allow chaining to the end of
    // just the word 'be'... ie. shalt.be.equal where 'be' === a 
    // terminal, but so is 'equal'.
    terminals.forEach(function (key) {
        if ('be' !== key) assignTerminalToKey.bind(Terminal.prototype.be)(key);
    });

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
    Commandment.prototype.have = function derefProperty (key) {
        return new Commandment(this.thou[key], this.invert);
    };

    if ('undefined' !== typeof global) {
        intros.forEach(function (intro) {
            if (global[intro]) {
                console.warn('global.' + intro + ' already defined...');
            }
            else {
                global[intro] = setSubject;
            }
        });
    }

    function setSubject (thou) {
        if ('undefined' === typeof thou || null == thou)
            throw new Error('Thou cannot be ' + (typeof thou));
        Thou._subject = thou;
    }

    function noSubject () {
        throw new Error('No subject was defined!');
    }

    verbs.forEach(function (key) {
        Object.defineProperty(Thou, key, {
            get: function () {
                return Thou();
            }
        });
    });

    // Janky global setters.
    exports.shaltThrowErrors = function () { mode = 'error'; }.bind(exports);
    exports.shaltReturnBool  = function () { mode = 'bool'; }.bind(exports);

    // Based on the mode sermon.js is running in, evaluate what to do
    // with the passing/not-passing commandment by checking the
    // mode we are running in.
    var evaluate = function evaluate(satisfies, message) {
        if (mode == 'bool') return satisfies;
        if (mode == 'error' && !satisfies) {
            throw new Error(message);
        }
    };

    var Judgment = global.Judgment = function Judgment () {

    };

})();
