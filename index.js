'use strict';

(function () {

    var _ = require('lodash');
    var util = require('util');
    require('colors');

    var mode = 'bool'

    var exports = module.exports = Thou;

    function Thou (thou) {
        if ('undefined' !== typeof thou)
            setSubject(thou);
        return new Commandment(thou || Thou._subject || noSubject());
    }

    var intros = [ 'AndTheLordSaidUnto', 'AndGodSaidUnto' ];
    var verbs = [ 'shall', 'shalt', 'is', 'are', 'should', 'that' ];
    var negatives = [ 'not', 'shallNot', 'shaltNot', 'shant', 'shouldNot' ];
    var terminals = ['be', 'is', 'eq', 'eql', 'equal', 'equals', 'eqTo',
        'eqlTo', 'equalTo', 'match', 'matching', 'matches', 'do', 'does'];

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
        return evaluate(satisfiesCommandment, this.buildMessage(target));
    };
    var assignTerminalToKey = function assignTerminalToKey (key) {
        this[key] = terminal;
    };
    var Terminal = function Terminal () {};
    Terminal.prototype.buildMessage = function buildMessage (target) {
        var msg = '';
        msg += 'Thou shalt ';
        if (this.invert) msg += 'not '
        switch (typeof target) {
            case 'function':
                msg += 'satisfy the given function.';
                break;
            case 'object':
                msg += 'be equal to ' + _(util.inspect(target)).trunc(10) + '.';
                break;
            case 'string':
                msg += 'be equal to "' + _(target).trunc(10) + '."';
                break;
            case 'number':
                msg += 'be equal to ' + target + '.';
                break;
            default:
                msg += 'be ' + _(util.inspect(target)).trunc(10);
        }

        return msg;
    };

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
        if (mode === 'judge')
            _tests.push({ thou: thou });
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
    exports.shaltJudge  = function () { mode = 'judge'; }.bind(exports);

    // Based on the mode sermon.js is running in, evaluate what to do
    // with the passing/not-passing commandment by checking the
    // mode we are running in.
    var evaluate = function evaluate(satisfies, message) {
        if (mode === 'bool') return satisfies;
        if (mode === 'error' && !satisfies) {
            throw new Error(message);
        }
        //if (mode === 'judge')
        _tests.push({ pass: satisfies, message: message });
    };

    var _tests = [];

    var Judgment = global.Judgment = function Judgment () {
        if (Judgment.called) {
            return console.warn('Don\'t call judgment twice!')
        }
        Judgment.called = true;
        if (mode === 'error') {
            console.warn('Judgment should really only be called in shaltReturnBool mode.');
        }

        var passing = _(_tests).reduce(function (count, test) {
            return count + (test.pass ? 1 : 0);
        }, 0);

        console.log(passing + '/' + _tests.length + ' tests passed.');

        var tokens = ['ଡ','ଢ','ଣ','ତ','ଦ','କ','ଚ','ଇ','ଊ'];
        var sample = (array) => array[Math.floor(Math.random() * array.length)];
        var i = 1;
        var j = 0;
        _tests.forEach(function (test) {
            if (test.thou) {
                i = 1;
                j++;
                console.log((j == 1 ? 'The':'Then the') + ` lord said unto ${_(util.inspect(test.thou)).trunc(30).yellow}.`);
            }
            else if (test.pass) {
                let token = sample(tokens);
                console.log(`  ${`${i++}.`.grey} ${token.green}  ${test.message}`);
            }
            else {
                console.log(`  ${`${i++}.`.grey}    ${test.message.red}`);
            }
        });
    };

})();
