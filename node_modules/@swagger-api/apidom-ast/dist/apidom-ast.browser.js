(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.apidomAst = {}));
})(this, (function (exports) { 'use strict';

  var __defProp$E = Object.defineProperty;
  var __defNormalProp$E = (obj, key, value) => key in obj ? __defProp$E(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$D = (obj, key, value) => __defNormalProp$E(obj, typeof key !== "symbol" ? key + "" : key, value);
  class Node {
    constructor({
      children = [],
      isMissing = false,
      startPositionRow,
      startPositionColumn,
      startIndex,
      endPositionRow,
      endPositionColumn,
      endIndex
    } = {}) {
      __publicField$D(this, "type", "node");
      __publicField$D(this, "isMissing");
      __publicField$D(this, "children");
      __publicField$D(this, "startPositionRow");
      __publicField$D(this, "startPositionColumn");
      __publicField$D(this, "startIndex");
      __publicField$D(this, "endPositionRow");
      __publicField$D(this, "endPositionColumn");
      __publicField$D(this, "endIndex");
      this.type = this.constructor.type;
      this.isMissing = isMissing;
      this.children = children;
      this.startPositionRow = startPositionRow;
      this.startPositionColumn = startPositionColumn;
      this.startIndex = startIndex;
      this.endPositionRow = endPositionRow;
      this.endPositionColumn = endPositionColumn;
      this.endIndex = endIndex;
    }
    // creates shallow clone of node
    clone() {
      const copy = Object.create(Object.getPrototypeOf(this));
      Object.getOwnPropertyNames(this).forEach((propKey) => {
        const descriptor = Object.getOwnPropertyDescriptor(this, propKey);
        Object.defineProperty(copy, propKey, descriptor);
      });
      return copy;
    }
  }
  __publicField$D(Node, "type", "node");

  class JsonNode extends Node {
  }

  function _isPlaceholder(a) {
    return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
  }

  /**
   * Optimized internal one-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  /**
   * Optimized internal two-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
            return fn(a, _b);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
            return fn(_a, b);
          }) : _isPlaceholder(b) ? _curry1(function (_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }

  /**
   * Private `concat` function to merge two array-like objects.
   *
   * @private
   * @param {Array|Arguments} [set1=[]] An array-like object.
   * @param {Array|Arguments} [set2=[]] An array-like object.
   * @return {Array} A new, merged array.
   * @example
   *
   *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
   */
  function _concat(set1, set2) {
    set1 = set1 || [];
    set2 = set2 || [];
    var idx;
    var len1 = set1.length;
    var len2 = set2.length;
    var result = [];
    idx = 0;
    while (idx < len1) {
      result[result.length] = set1[idx];
      idx += 1;
    }
    idx = 0;
    while (idx < len2) {
      result[result.length] = set2[idx];
      idx += 1;
    }
    return result;
  }

  function _arity(n, fn) {
    /* eslint-disable no-unused-vars */
    switch (n) {
      case 0:
        return function () {
          return fn.apply(this, arguments);
        };
      case 1:
        return function (a0) {
          return fn.apply(this, arguments);
        };
      case 2:
        return function (a0, a1) {
          return fn.apply(this, arguments);
        };
      case 3:
        return function (a0, a1, a2) {
          return fn.apply(this, arguments);
        };
      case 4:
        return function (a0, a1, a2, a3) {
          return fn.apply(this, arguments);
        };
      case 5:
        return function (a0, a1, a2, a3, a4) {
          return fn.apply(this, arguments);
        };
      case 6:
        return function (a0, a1, a2, a3, a4, a5) {
          return fn.apply(this, arguments);
        };
      case 7:
        return function (a0, a1, a2, a3, a4, a5, a6) {
          return fn.apply(this, arguments);
        };
      case 8:
        return function (a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.apply(this, arguments);
        };
      case 9:
        return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.apply(this, arguments);
        };
      case 10:
        return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.apply(this, arguments);
        };
      default:
        throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
    }
  }

  /**
   * Internal curryN function.
   *
   * @private
   * @category Function
   * @param {Number} length The arity of the curried function.
   * @param {Array} received An array of arguments received thus far.
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curryN(length, received, fn) {
    return function () {
      var combined = [];
      var argsIdx = 0;
      var left = length;
      var combinedIdx = 0;
      var hasPlaceholder = false;
      while (combinedIdx < received.length || argsIdx < arguments.length) {
        var result;
        if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments[argsIdx];
          argsIdx += 1;
        }
        combined[combinedIdx] = result;
        if (!_isPlaceholder(result)) {
          left -= 1;
        } else {
          hasPlaceholder = true;
        }
        combinedIdx += 1;
      }
      return !hasPlaceholder && left <= 0 ? fn.apply(this, combined) : _arity(Math.max(0, left), _curryN(length, combined, fn));
    };
  }

  /**
   * Returns a curried equivalent of the provided function, with the specified
   * arity. The curried function has two unusual capabilities. First, its
   * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
   * following are equivalent:
   *
   *   - `g(1)(2)(3)`
   *   - `g(1)(2, 3)`
   *   - `g(1, 2)(3)`
   *   - `g(1, 2, 3)`
   *
   * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
   * "gaps", allowing partial application of any combination of arguments,
   * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
   * the following are equivalent:
   *
   *   - `g(1, 2, 3)`
   *   - `g(_, 2, 3)(1)`
   *   - `g(_, _, 3)(1)(2)`
   *   - `g(_, _, 3)(1, 2)`
   *   - `g(_, 2)(1)(3)`
   *   - `g(_, 2)(1, 3)`
   *   - `g(_, 2)(_, 3)(1)`
   *
   * @func
   * @memberOf R
   * @since v0.5.0
   * @category Function
   * @sig Number -> (* -> a) -> (* -> a)
   * @param {Number} length The arity for the returned function.
   * @param {Function} fn The function to curry.
   * @return {Function} A new, curried function.
   * @see R.curry
   * @example
   *
   *      const sumArgs = (...args) => R.sum(args);
   *
   *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
   *      const f = curriedAddFourNumbers(1, 2);
   *      const g = f(3);
   *      g(4); //=> 10
   */
  var curryN = /*#__PURE__*/_curry2(function curryN(length, fn) {
    if (length === 1) {
      return _curry1(fn);
    }
    return _arity(length, _curryN(length, [], fn));
  });

  /**
   * Optimized internal three-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry3(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;
        case 1:
          return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          });
        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1(function (_c) {
            return fn(a, b, _c);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder(a) ? _curry1(function (_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder(b) ? _curry1(function (_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder(c) ? _curry1(function (_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }

  /**
   * Tests whether or not an object is an array.
   *
   * @private
   * @param {*} val The object to test.
   * @return {Boolean} `true` if `val` is an array, `false` otherwise.
   * @example
   *
   *      _isArray([]); //=> true
   *      _isArray(null); //=> false
   *      _isArray({}); //=> false
   */
  const _isArray = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
  };

  function _isTransformer(obj) {
    return obj != null && typeof obj['@@transducer/step'] === 'function';
  }

  /**
   * Returns a function that dispatches with different strategies based on the
   * object in list position (last argument). If it is an array, executes [fn].
   * Otherwise, if it has a function with one of the given method names, it will
   * execute that function (functor case). Otherwise, if it is a transformer,
   * uses transducer created by [transducerCreator] to return a new transformer
   * (transducer case).
   * Otherwise, it will default to executing [fn].
   *
   * @private
   * @param {Array} methodNames properties to check for a custom implementation
   * @param {Function} transducerCreator transducer factory if object is transformer
   * @param {Function} fn default ramda implementation
   * @return {Function} A function that dispatches on object in list position
   */
  function _dispatchable(methodNames, transducerCreator, fn) {
    return function () {
      if (arguments.length === 0) {
        return fn();
      }
      var obj = arguments[arguments.length - 1];
      if (!_isArray(obj)) {
        var idx = 0;
        while (idx < methodNames.length) {
          if (typeof obj[methodNames[idx]] === 'function') {
            return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
          }
          idx += 1;
        }
        if (_isTransformer(obj)) {
          var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
          return transducer(obj);
        }
      }
      return fn.apply(this, arguments);
    };
  }

  const _xfBase = {
    init: function () {
      return this.xf['@@transducer/init']();
    },
    result: function (result) {
      return this.xf['@@transducer/result'](result);
    }
  };

  function _arrayFromIterator(iter) {
    var list = [];
    var next;
    while (!(next = iter.next()).done) {
      list.push(next.value);
    }
    return list;
  }

  function _includesWith(pred, x, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      if (pred(x, list[idx])) {
        return true;
      }
      idx += 1;
    }
    return false;
  }

  function _functionName(f) {
    // String(x => x) evaluates to "x => x", so the pattern may not match.
    var match = String(f).match(/^function (\w*)/);
    return match == null ? '' : match[1];
  }

  function _has(prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  function _objectIs(a, b) {
    // SameValue algorithm
    if (a === b) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return a !== 0 || 1 / a === 1 / b;
    } else {
      // Step 6.a: NaN == NaN
      return a !== a && b !== b;
    }
  }
  const _objectIs$1 = typeof Object.is === 'function' ? Object.is : _objectIs;

  var toString$2 = Object.prototype.toString;
  var _isArguments = /*#__PURE__*/function () {
    return toString$2.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
      return toString$2.call(x) === '[object Arguments]';
    } : function _isArguments(x) {
      return _has('callee', x);
    };
  }();

  // cover IE < 9 keys issues
  var hasEnumBug = ! /*#__PURE__*/{
    toString: null
  }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  // Safari bug
  var hasArgsEnumBug = /*#__PURE__*/function () {

    return arguments.propertyIsEnumerable('length');
  }();
  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };

  /**
   * Returns a list containing the names of all the enumerable own properties of
   * the supplied object.
   * Note that the order of the output array is not guaranteed to be consistent
   * across different JS platforms.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Object
   * @sig {k: v} -> [k]
   * @param {Object} obj The object to extract properties from
   * @return {Array} An array of the object's own properties.
   * @see R.keysIn, R.values, R.toPairs
   * @example
   *
   *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
   */
  var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? /*#__PURE__*/_curry1(function keys(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) : /*#__PURE__*/_curry1(function keys(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    var prop, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
    for (prop in obj) {
      if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
        ks[ks.length] = prop;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;
      while (nIdx >= 0) {
        prop = nonEnumerableProps[nIdx];
        if (_has(prop, obj) && !contains(ks, prop)) {
          ks[ks.length] = prop;
        }
        nIdx -= 1;
      }
    }
    return ks;
  });

  /**
   * Gives a single-word string description of the (native) type of a value,
   * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
   * attempt to distinguish user Object types any further, reporting them all as
   * 'Object'.
   *
   * @func
   * @memberOf R
   * @since v0.8.0
   * @category Type
   * @sig * -> String
   * @param {*} val The value to test
   * @return {String}
   * @example
   *
   *      R.type({}); //=> "Object"
   *      R.type(1); //=> "Number"
   *      R.type(false); //=> "Boolean"
   *      R.type('s'); //=> "String"
   *      R.type(null); //=> "Null"
   *      R.type([]); //=> "Array"
   *      R.type(/[A-z]/); //=> "RegExp"
   *      R.type(() => {}); //=> "Function"
   *      R.type(async () => {}); //=> "AsyncFunction"
   *      R.type(undefined); //=> "Undefined"
   *      R.type(BigInt(123)); //=> "BigInt"
   */
  var type = /*#__PURE__*/_curry1(function type(val) {
    return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
  });

  /**
   * private _uniqContentEquals function.
   * That function is checking equality of 2 iterator contents with 2 assumptions
   * - iterators lengths are the same
   * - iterators values are unique
   *
   * false-positive result will be returned for comparison of, e.g.
   * - [1,2,3] and [1,2,3,4]
   * - [1,1,1] and [1,2,3]
   * */

  function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
    var a = _arrayFromIterator(aIterator);
    var b = _arrayFromIterator(bIterator);
    function eq(_a, _b) {
      return _equals(_a, _b, stackA.slice(), stackB.slice());
    }

    // if *a* array contains any element that is not included in *b*
    return !_includesWith(function (b, aItem) {
      return !_includesWith(eq, aItem, b);
    }, b, a);
  }
  function _equals(a, b, stackA, stackB) {
    if (_objectIs$1(a, b)) {
      return true;
    }
    var typeA = type(a);
    if (typeA !== type(b)) {
      return false;
    }
    if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
      return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
    }
    if (typeof a.equals === 'function' || typeof b.equals === 'function') {
      return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
    }
    switch (typeA) {
      case 'Arguments':
      case 'Array':
      case 'Object':
        if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
          return a === b;
        }
        break;
      case 'Boolean':
      case 'Number':
      case 'String':
        if (!(typeof a === typeof b && _objectIs$1(a.valueOf(), b.valueOf()))) {
          return false;
        }
        break;
      case 'Date':
        if (!_objectIs$1(a.valueOf(), b.valueOf())) {
          return false;
        }
        break;
      case 'Error':
        return a.name === b.name && a.message === b.message;
      case 'RegExp':
        if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
          return false;
        }
        break;
    }
    var idx = stackA.length - 1;
    while (idx >= 0) {
      if (stackA[idx] === a) {
        return stackB[idx] === b;
      }
      idx -= 1;
    }
    switch (typeA) {
      case 'Map':
        if (a.size !== b.size) {
          return false;
        }
        return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
      case 'Set':
        if (a.size !== b.size) {
          return false;
        }
        return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
      case 'Arguments':
      case 'Array':
      case 'Object':
      case 'Boolean':
      case 'Number':
      case 'String':
      case 'Date':
      case 'Error':
      case 'RegExp':
      case 'Int8Array':
      case 'Uint8Array':
      case 'Uint8ClampedArray':
      case 'Int16Array':
      case 'Uint16Array':
      case 'Int32Array':
      case 'Uint32Array':
      case 'Float32Array':
      case 'Float64Array':
      case 'ArrayBuffer':
        break;
      default:
        // Values of other types are only equal if identical.
        return false;
    }
    var keysA = keys(a);
    if (keysA.length !== keys(b).length) {
      return false;
    }
    var extendedStackA = stackA.concat([a]);
    var extendedStackB = stackB.concat([b]);
    idx = keysA.length - 1;
    while (idx >= 0) {
      var key = keysA[idx];
      if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
        return false;
      }
      idx -= 1;
    }
    return true;
  }

  /**
   * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
   * cyclical data structures.
   *
   * Dispatches symmetrically to the `equals` methods of both arguments, if
   * present.
   *
   * @func
   * @memberOf R
   * @since v0.15.0
   * @category Relation
   * @sig a -> b -> Boolean
   * @param {*} a
   * @param {*} b
   * @return {Boolean}
   * @example
   *
   *      R.equals(1, 1); //=> true
   *      R.equals(1, '1'); //=> false
   *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
   *
   *      const a = {}; a.v = a;
   *      const b = {}; b.v = b;
   *      R.equals(a, b); //=> true
   */
  var equals = /*#__PURE__*/_curry2(function equals(a, b) {
    return _equals(a, b, [], []);
  });

  function _indexOf(list, a, idx) {
    var inf, item;
    // Array.prototype.indexOf doesn't exist below IE9
    if (typeof list.indexOf === 'function') {
      switch (typeof a) {
        case 'number':
          if (a === 0) {
            // manually crawl the list to distinguish between +0 and -0
            inf = 1 / a;
            while (idx < list.length) {
              item = list[idx];
              if (item === 0 && 1 / item === inf) {
                return idx;
              }
              idx += 1;
            }
            return -1;
          } else if (a !== a) {
            // NaN
            while (idx < list.length) {
              item = list[idx];
              if (typeof item === 'number' && item !== item) {
                return idx;
              }
              idx += 1;
            }
            return -1;
          }
          // non-zero numbers can utilise Set
          return list.indexOf(a, idx);

        // all these types can utilise Set
        case 'string':
        case 'boolean':
        case 'function':
        case 'undefined':
          return list.indexOf(a, idx);
        case 'object':
          if (a === null) {
            // null can utilise Set
            return list.indexOf(a, idx);
          }
      }
    }
    // anything else not covered above, defer to R.equals
    while (idx < list.length) {
      if (equals(list[idx], a)) {
        return idx;
      }
      idx += 1;
    }
    return -1;
  }

  function _includes(a, list) {
    return _indexOf(list, a, 0) >= 0;
  }

  function _map(fn, functor) {
    var idx = 0;
    var len = functor.length;
    var result = Array(len);
    while (idx < len) {
      result[idx] = fn(functor[idx]);
      idx += 1;
    }
    return result;
  }

  function _quote(s) {
    var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b') // \b matches word boundary; [\b] matches backspace
    .replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
    return '"' + escaped.replace(/"/g, '\\"') + '"';
  }

  /**
   * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
   */
  var pad = function pad(n) {
    return (n < 10 ? '0' : '') + n;
  };
  var _toISOString = typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
    return d.toISOString();
  } : function _toISOString(d) {
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
  };

  function _complement(f) {
    return function () {
      return !f.apply(this, arguments);
    };
  }

  function _arrayReduce(reducer, acc, list) {
    var index = 0;
    var length = list.length;
    while (index < length) {
      acc = reducer(acc, list[index]);
      index += 1;
    }
    return acc;
  }

  function _filter(fn, list) {
    var idx = 0;
    var len = list.length;
    var result = [];
    while (idx < len) {
      if (fn(list[idx])) {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  }

  function _isObject(x) {
    return Object.prototype.toString.call(x) === '[object Object]';
  }

  var XFilter = /*#__PURE__*/function () {
    function XFilter(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XFilter.prototype['@@transducer/init'] = _xfBase.init;
    XFilter.prototype['@@transducer/result'] = _xfBase.result;
    XFilter.prototype['@@transducer/step'] = function (result, input) {
      return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
    };
    return XFilter;
  }();
  function _xfilter(f) {
    return function (xf) {
      return new XFilter(f, xf);
    };
  }

  /**
   * Takes a predicate and a `Filterable`, and returns a new filterable of the
   * same type containing the members of the given filterable which satisfy the
   * given predicate. Filterable objects include plain objects or any object
   * that has a filter method such as `Array`.
   *
   * Dispatches to the `filter` method of the second argument, if present.
   *
   * Acts as a transducer if a transformer is given in list position.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @category Object
   * @sig Filterable f => (a -> Boolean) -> f a -> f a
   * @param {Function} pred
   * @param {Array} filterable
   * @return {Array} Filterable
   * @see R.reject, R.transduce, R.addIndex
   * @example
   *
   *      const isEven = n => n % 2 === 0;
   *
   *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
   *
   *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
   */
  var filter = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['fantasy-land/filter', 'filter'], _xfilter, function (pred, filterable) {
    return _isObject(filterable) ? _arrayReduce(function (acc, key) {
      if (pred(filterable[key])) {
        acc[key] = filterable[key];
      }
      return acc;
    }, {}, keys(filterable)) :
    // else
    _filter(pred, filterable);
  }));

  /**
   * The complement of [`filter`](#filter).
   *
   * Acts as a transducer if a transformer is given in list position. Filterable
   * objects include plain objects or any object that has a filter method such
   * as `Array`.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig Filterable f => (a -> Boolean) -> f a -> f a
   * @param {Function} pred
   * @param {Array} filterable
   * @return {Array}
   * @see R.filter, R.transduce, R.addIndex
   * @example
   *
   *      const isOdd = (n) => n % 2 !== 0;
   *
   *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
   *
   *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
   */
  var reject = /*#__PURE__*/_curry2(function reject(pred, filterable) {
    return filter(_complement(pred), filterable);
  });

  function _toString(x, seen) {
    var recur = function recur(y) {
      var xs = seen.concat([x]);
      return _includes(y, xs) ? '<Circular>' : _toString(y, xs);
    };

    //  mapPairs :: (Object, [String]) -> [String]
    var mapPairs = function (obj, keys) {
      return _map(function (k) {
        return _quote(k) + ': ' + recur(obj[k]);
      }, keys.slice().sort());
    };
    switch (Object.prototype.toString.call(x)) {
      case '[object Arguments]':
        return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
      case '[object Array]':
        return '[' + _map(recur, x).concat(mapPairs(x, reject(function (k) {
          return /^\d+$/.test(k);
        }, keys(x)))).join(', ') + ']';
      case '[object Boolean]':
        return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
      case '[object Date]':
        return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
      case '[object Map]':
        return 'new Map(' + recur(Array.from(x)) + ')';
      case '[object Null]':
        return 'null';
      case '[object Number]':
        return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
      case '[object Set]':
        return 'new Set(' + recur(Array.from(x).sort()) + ')';
      case '[object String]':
        return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
      case '[object Undefined]':
        return 'undefined';
      default:
        if (typeof x.toString === 'function') {
          var repr = x.toString();
          if (repr !== '[object Object]') {
            return repr;
          }
        }
        return '{' + mapPairs(x, keys(x)).join(', ') + '}';
    }
  }

  /**
   * Returns the string representation of the given value. `eval`'ing the output
   * should result in a value equivalent to the input value. Many of the built-in
   * `toString` methods do not satisfy this requirement.
   *
   * If the given value is an `[object Object]` with a `toString` method other
   * than `Object.prototype.toString`, this method is invoked with no arguments
   * to produce the return value. This means user-defined constructor functions
   * can provide a suitable `toString` method. For example:
   *
   *     function Point(x, y) {
   *       this.x = x;
   *       this.y = y;
   *     }
   *
   *     Point.prototype.toString = function() {
   *       return 'new Point(' + this.x + ', ' + this.y + ')';
   *     };
   *
   *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
   *
   * @func
   * @memberOf R
   * @since v0.14.0
   * @category String
   * @sig * -> String
   * @param {*} val
   * @return {String}
   * @example
   *
   *      R.toString(42); //=> '42'
   *      R.toString('abc'); //=> '"abc"'
   *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
   *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
   *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
   */
  var toString$1 = /*#__PURE__*/_curry1(function toString(val) {
    return _toString(val, []);
  });

  /**
   * Returns the larger of its two arguments.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Relation
   * @sig Ord a => a -> a -> a
   * @param {*} a
   * @param {*} b
   * @return {*}
   * @see R.maxBy, R.min
   * @example
   *
   *      R.max(789, 123); //=> 789
   *      R.max('a', 'b'); //=> 'b'
   */
  var max = /*#__PURE__*/_curry2(function max(a, b) {
    if (a === b) {
      return b;
    }
    function safeMax(x, y) {
      if (x > y !== y > x) {
        return y > x ? y : x;
      }
      return undefined;
    }
    var maxByValue = safeMax(a, b);
    if (maxByValue !== undefined) {
      return maxByValue;
    }
    var maxByType = safeMax(typeof a, typeof b);
    if (maxByType !== undefined) {
      return maxByType === typeof a ? a : b;
    }
    var stringA = toString$1(a);
    var maxByStringValue = safeMax(stringA, toString$1(b));
    if (maxByStringValue !== undefined) {
      return maxByStringValue === stringA ? a : b;
    }
    return b;
  });

  var XMap = /*#__PURE__*/function () {
    function XMap(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XMap.prototype['@@transducer/init'] = _xfBase.init;
    XMap.prototype['@@transducer/result'] = _xfBase.result;
    XMap.prototype['@@transducer/step'] = function (result, input) {
      return this.xf['@@transducer/step'](result, this.f(input));
    };
    return XMap;
  }();
  var _xmap = function _xmap(f) {
    return function (xf) {
      return new XMap(f, xf);
    };
  };

  /**
   * Takes a function and
   * a [functor](https://github.com/fantasyland/fantasy-land#functor),
   * applies the function to each of the functor's values, and returns
   * a functor of the same shape.
   *
   * Ramda provides suitable `map` implementations for `Array` and `Object`,
   * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
   *
   * Dispatches to the `map` method of the second argument, if present.
   *
   * Acts as a transducer if a transformer is given in list position.
   *
   * Also treats functions as functors and will compose them together.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig Functor f => (a -> b) -> f a -> f b
   * @param {Function} fn The function to be called on every element of the input `list`.
   * @param {Array} list The list to be iterated over.
   * @return {Array} The new list.
   * @see R.transduce, R.addIndex, R.pluck, R.project
   * @example
   *
   *      const double = x => x * 2;
   *
   *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
   *
   *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
   * @symb R.map(f, [a, b]) = [f(a), f(b)]
   * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
   * @symb R.map(f, functor_o) = functor_o.map(f)
   */
  var map = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
    switch (Object.prototype.toString.call(functor)) {
      case '[object Function]':
        return curryN(functor.length, function () {
          return fn.call(this, functor.apply(this, arguments));
        });
      case '[object Object]':
        return _arrayReduce(function (acc, key) {
          acc[key] = fn(functor[key]);
          return acc;
        }, {}, keys(functor));
      default:
        return _map(fn, functor);
    }
  }));

  /**
   * Determine if the passed argument is an integer.
   *
   * @private
   * @param {*} n
   * @category Type
   * @return {Boolean}
   */
  const _isInteger = Number.isInteger || function _isInteger(n) {
    return n << 0 === n;
  };

  function _isString(x) {
    return Object.prototype.toString.call(x) === '[object String]';
  }

  function _nth(offset, list) {
    var idx = offset < 0 ? list.length + offset : offset;
    return _isString(list) ? list.charAt(idx) : list[idx];
  }

  /**
   * Returns a function that when supplied an object returns the indicated
   * property of that object, if it exists.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Object
   * @typedefn Idx = String | Int | Symbol
   * @sig Idx -> {s: a} -> a | Undefined
   * @param {String|Number} p The property name or array index
   * @param {Object} obj The object to query
   * @return {*} The value at `obj.p`.
   * @see R.path, R.props, R.pluck, R.project, R.nth
   * @example
   *
   *      R.prop('x', {x: 100}); //=> 100
   *      R.prop('x', {}); //=> undefined
   *      R.prop(0, [100]); //=> 100
   *      R.compose(R.inc, R.prop('x'))({ x: 3 }) //=> 4
   */

  var prop = /*#__PURE__*/_curry2(function prop(p, obj) {
    if (obj == null) {
      return;
    }
    return _isInteger(p) ? _nth(p, obj) : obj[p];
  });

  /**
   * Returns a new list by plucking the same named property off all objects in
   * the list supplied.
   *
   * `pluck` will work on
   * any [functor](https://github.com/fantasyland/fantasy-land#functor) in
   * addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig Functor f => k -> f {k: v} -> f v
   * @param {Number|String} key The key name to pluck off of each object.
   * @param {Array} f The array or functor to consider.
   * @return {Array} The list of values for the given key.
   * @see R.project, R.prop, R.props
   * @example
   *
   *      var getAges = R.pluck('age');
   *      getAges([{name: 'fred', age: 29}, {name: 'wilma', age: 27}]); //=> [29, 27]
   *
   *      R.pluck(0, [[1, 2], [3, 4]]);               //=> [1, 3]
   *      R.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}
   * @symb R.pluck('x', [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]) = [1, 3, 5]
   * @symb R.pluck(0, [[1, 2], [3, 4], [5, 6]]) = [1, 3, 5]
   */
  var pluck = /*#__PURE__*/_curry2(function pluck(p, list) {
    return map(prop(p), list);
  });

  /**
   * Tests whether or not an object is similar to an array.
   *
   * @private
   * @category Type
   * @category List
   * @sig * -> Boolean
   * @param {*} x The object to test.
   * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
   * @example
   *
   *      _isArrayLike([]); //=> true
   *      _isArrayLike(true); //=> false
   *      _isArrayLike({}); //=> false
   *      _isArrayLike({length: 10}); //=> false
   *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
   *      _isArrayLike({nodeType: 1, length: 1}) // => false
   */
  var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
    if (_isArray(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if (typeof x !== 'object') {
      return false;
    }
    if (_isString(x)) {
      return false;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
  });

  var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
  function _createReduce(arrayReduce, methodReduce, iterableReduce) {
    return function _reduce(xf, acc, list) {
      if (_isArrayLike(list)) {
        return arrayReduce(xf, acc, list);
      }
      if (list == null) {
        return acc;
      }
      if (typeof list['fantasy-land/reduce'] === 'function') {
        return methodReduce(xf, acc, list, 'fantasy-land/reduce');
      }
      if (list[symIterator] != null) {
        return iterableReduce(xf, acc, list[symIterator]());
      }
      if (typeof list.next === 'function') {
        return iterableReduce(xf, acc, list);
      }
      if (typeof list.reduce === 'function') {
        return methodReduce(xf, acc, list, 'reduce');
      }
      throw new TypeError('reduce: list must be array or iterable');
    };
  }

  function _xArrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  /**
   * Creates a function that is bound to a context.
   * Note: `R.bind` does not provide the additional argument-binding capabilities of
   * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
   *
   * @func
   * @memberOf R
   * @since v0.6.0
   * @category Function
   * @category Object
   * @sig (* -> *) -> {*} -> (* -> *)
   * @param {Function} fn The function to bind to context
   * @param {Object} thisObj The context to bind `fn` to
   * @return {Function} A function that will execute in the context of `thisObj`.
   * @see R.partial
   * @example
   *
   *      const log = R.bind(console.log, console);
   *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
   *      // logs {a: 2}
   * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
   */
  var bind = /*#__PURE__*/_curry2(function bind(fn, thisObj) {
    return _arity(fn.length, function () {
      return fn.apply(thisObj, arguments);
    });
  });

  function _xIterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }
  function _xMethodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
  }
  var _xReduce = /*#__PURE__*/_createReduce(_xArrayReduce, _xMethodReduce, _xIterableReduce);

  var XWrap = /*#__PURE__*/function () {
    function XWrap(fn) {
      this.f = fn;
    }
    XWrap.prototype['@@transducer/init'] = function () {
      throw new Error('init not implemented on XWrap');
    };
    XWrap.prototype['@@transducer/result'] = function (acc) {
      return acc;
    };
    XWrap.prototype['@@transducer/step'] = function (acc, x) {
      return this.f(acc, x);
    };
    return XWrap;
  }();
  function _xwrap(fn) {
    return new XWrap(fn);
  }

  /**
   * Returns a single item by iterating through the list, successively calling
   * the iterator function and passing it an accumulator value and the current
   * value from the array, and then passing the result to the next call.
   *
   * The iterator function receives two values: *(acc, value)*. It may use
   * [`R.reduced`](#reduced) to shortcut the iteration.
   *
   * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
   * is *(value, acc)*.
   *
   * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
   * arrays), unlike the native `Array.prototype.reduce` method. For more details
   * on this behavior, see:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
   *
   * Be cautious of mutating and returning the accumulator. If you reuse it across
   * invocations, it will continue to accumulate onto the same value. The general
   * recommendation is to always return a new value. If you can't do so for
   * performance reasons, then be sure to reinitialize the accumulator on each
   * invocation.
   *
   * Dispatches to the `reduce` method of the third argument, if present. When
   * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
   * shortcuting, as this is not implemented by `reduce`.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig ((a, b) -> a) -> a -> [b] -> a
   * @param {Function} fn The iterator function. Receives two values, the accumulator and the
   *        current element from the array.
   * @param {*} acc The accumulator value.
   * @param {Array} list The list to iterate over.
   * @return {*} The final, accumulated value.
   * @see R.reduced, R.addIndex, R.reduceRight
   * @example
   *
   *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
   *      //          -               -10
   *      //         / \              / \
   *      //        -   4           -6   4
   *      //       / \              / \
   *      //      -   3   ==>     -3   3
   *      //     / \              / \
   *      //    -   2           -1   2
   *      //   / \              / \
   *      //  0   1            0   1
   *
   * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
   */
  var reduce = /*#__PURE__*/_curry3(function (xf, acc, list) {
    return _xReduce(typeof xf === 'function' ? _xwrap(xf) : xf, acc, list);
  });

  /**
   * Returns a function that always returns the given value. Note that for
   * non-primitives the value returned is a reference to the original value.
   *
   * This function is known as `const`, `constant`, or `K` (for K combinator) in
   * other languages and libraries.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig a -> (* -> a)
   * @param {*} val The value to wrap in a function
   * @return {Function} A Function :: * -> val.
   * @example
   *
   *      const t = R.always('Tee');
   *      t(); //=> 'Tee'
   */
  var always = /*#__PURE__*/_curry1(function always(val) {
    return function () {
      return val;
    };
  });

  /**
   * Returns the first argument if it is falsy, otherwise the second argument.
   * Acts as the boolean `and` statement if both inputs are `Boolean`s.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Logic
   * @sig a -> b -> a | b
   * @param {Any} a
   * @param {Any} b
   * @return {Any}
   * @see R.both, R.or
   * @example
   *
   *      R.and(true, true); //=> true
   *      R.and(true, false); //=> false
   *      R.and(false, true); //=> false
   *      R.and(false, false); //=> false
   */
  var and = /*#__PURE__*/_curry2(function and(a, b) {
    return a && b;
  });

  /**
   * Takes a list of predicates and returns a predicate that returns true for a
   * given list of arguments if at least one of the provided predicates is
   * satisfied by those arguments.
   *
   * The function returned is a curried function whose arity matches that of the
   * highest-arity predicate.
   *
   * @func
   * @memberOf R
   * @since v0.9.0
   * @category Logic
   * @sig [(*... -> Boolean)] -> (*... -> Boolean)
   * @param {Array} predicates An array of predicates to check
   * @return {Function} The combined predicate
   * @see R.allPass, R.either
   * @example
   *
   *      const isClub = R.propEq('♣', 'suit');
   *      const isSpade = R.propEq('♠', 'suit');
   *      const isBlackCard = R.anyPass([isClub, isSpade]);
   *
   *      isBlackCard({rank: '10', suit: '♣'}); //=> true
   *      isBlackCard({rank: 'Q', suit: '♠'}); //=> true
   *      isBlackCard({rank: 'Q', suit: '♦'}); //=> false
   */
  var anyPass = /*#__PURE__*/_curry1(function anyPass(preds) {
    return curryN(reduce(max, 0, pluck('length', preds)), function () {
      var idx = 0;
      var len = preds.length;
      while (idx < len) {
        if (preds[idx].apply(this, arguments)) {
          return true;
        }
        idx += 1;
      }
      return false;
    });
  });

  function _iterableReduce(reducer, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = reducer(acc, step.value);
      step = iter.next();
    }
    return acc;
  }
  function _methodReduce(reducer, acc, obj, methodName) {
    return obj[methodName](reducer, acc);
  }
  var _reduce = /*#__PURE__*/_createReduce(_arrayReduce, _methodReduce, _iterableReduce);

  /**
   * ap applies a list of functions to a list of values.
   *
   * Dispatches to the `ap` method of the first argument, if present. Also
   * treats curried functions as applicatives.
   *
   * @func
   * @memberOf R
   * @since v0.3.0
   * @category Function
   * @sig [a -> b] -> [a] -> [b]
   * @sig Apply f => f (a -> b) -> f a -> f b
   * @sig (r -> a -> b) -> (r -> a) -> (r -> b)
   * @param {*} applyF
   * @param {*} applyX
   * @return {*}
   * @example
   *
   *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
   *      R.ap([R.concat('tasty '), R.toUpper], ['pizza', 'salad']); //=> ["tasty pizza", "tasty salad", "PIZZA", "SALAD"]
   *
   *      // R.ap can also be used as S combinator
   *      // when only two functions are passed
   *      R.ap(R.concat, R.toUpper)('Ramda') //=> 'RamdaRAMDA'
   * @symb R.ap([f, g], [a, b]) = [f(a), f(b), g(a), g(b)]
   */
  var ap = /*#__PURE__*/_curry2(function ap(applyF, applyX) {
    return typeof applyX['fantasy-land/ap'] === 'function' ? applyX['fantasy-land/ap'](applyF) : typeof applyF.ap === 'function' ? applyF.ap(applyX) : typeof applyF === 'function' ? function (x) {
      return applyF(x)(applyX(x));
    } : _reduce(function (acc, f) {
      return _concat(acc, map(f, applyX));
    }, [], applyF);
  });

  /**
   * Returns a curried equivalent of the provided function. The curried function
   * has two unusual capabilities. First, its arguments needn't be provided one
   * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
   * following are equivalent:
   *
   *   - `g(1)(2)(3)`
   *   - `g(1)(2, 3)`
   *   - `g(1, 2)(3)`
   *   - `g(1, 2, 3)`
   *
   * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
   * "gaps", allowing partial application of any combination of arguments,
   * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
   * the following are equivalent:
   *
   *   - `g(1, 2, 3)`
   *   - `g(_, 2, 3)(1)`
   *   - `g(_, _, 3)(1)(2)`
   *   - `g(_, _, 3)(1, 2)`
   *   - `g(_, 2)(1)(3)`
   *   - `g(_, 2)(1, 3)`
   *   - `g(_, 2)(_, 3)(1)`
   *
   * Please note that default parameters don't count towards a [function arity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
   * and therefore `curry` won't work well with those.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig (* -> a) -> (* -> a)
   * @param {Function} fn The function to curry.
   * @return {Function} A new, curried function.
   * @see R.curryN, R.partial
   * @example
   *
   *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
   *      const curriedAddFourNumbers = R.curry(addFourNumbers);
   *      const f = curriedAddFourNumbers(1, 2);
   *      const g = f(3);
   *      g(4); //=> 10
   *
   *      // R.curry not working well with default parameters
   *      const h = R.curry((a, b, c = 2) => a + b + c);
   *      h(1)(2)(7); //=> Error! (`3` is not a function!)
   */
  var curry = /*#__PURE__*/_curry1(function curry(fn) {
    return curryN(fn.length, fn);
  });

  function _isFunction(x) {
    var type = Object.prototype.toString.call(x);
    return type === '[object Function]' || type === '[object AsyncFunction]' || type === '[object GeneratorFunction]' || type === '[object AsyncGeneratorFunction]';
  }

  /**
   * "lifts" a function to be the specified arity, so that it may "map over" that
   * many lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
   *
   * @func
   * @memberOf R
   * @since v0.7.0
   * @category Function
   * @sig Number -> (*... -> *) -> ([*]... -> [*])
   * @param {Function} fn The function to lift into higher context
   * @return {Function} The lifted function.
   * @see R.lift, R.ap
   * @example
   *
   *      const madd3 = R.liftN(3, (...args) => R.sum(args));
   *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
   */
  var liftN = /*#__PURE__*/_curry2(function liftN(arity, fn) {
    var lifted = curryN(arity, fn);
    return curryN(arity, function () {
      return _arrayReduce(ap, map(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
    });
  });

  /**
   * "lifts" a function of arity >= 1 so that it may "map over" a list, Function or other
   * object that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
   *
   * @func
   * @memberOf R
   * @since v0.7.0
   * @category Function
   * @sig (*... -> *) -> ([*]... -> [*])
   * @param {Function} fn The function to lift into higher context
   * @return {Function} The lifted function.
   * @see R.liftN
   * @example
   *
   *      const madd3 = R.lift((a, b, c) => a + b + c);
   *
   *      madd3([100, 200], [30, 40], [5, 6, 7]); //=> [135, 136, 137, 145, 146, 147, 235, 236, 237, 245, 246, 247]
   *
   *      const madd5 = R.lift((a, b, c, d, e) => a + b + c + d + e);
   *
   *      madd5([10, 20], [1], [2, 3], [4], [100, 200]); //=> [117, 217, 118, 218, 127, 227, 128, 228]
   */
  var lift = /*#__PURE__*/_curry1(function lift(fn) {
    return liftN(fn.length, fn);
  });

  /**
   * A function which calls the two provided functions and returns the `&&`
   * of the results.
   * It returns the result of the first function if it is false-y and the result
   * of the second function otherwise. Note that this is short-circuited,
   * meaning that the second function will not be invoked if the first returns a
   * false-y value.
   *
   * In addition to functions, `R.both` also accepts any fantasy-land compatible
   * applicative functor.
   *
   * @func
   * @memberOf R
   * @since v0.12.0
   * @category Logic
   * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
   * @param {Function} f A predicate
   * @param {Function} g Another predicate
   * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
   * @see R.either, R.allPass, R.and
   * @example
   *
   *      const gt10 = R.gt(R.__, 10)
   *      const lt20 = R.lt(R.__, 20)
   *      const f = R.both(gt10, lt20);
   *      f(15); //=> true
   *      f(30); //=> false
   *
   *      R.both(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(false)
   *      R.both([false, false, 'a'], [11]); //=> [false, false, 11]
   */
  var both = /*#__PURE__*/_curry2(function both(f, g) {
    return _isFunction(f) ? function _both() {
      return f.apply(this, arguments) && g.apply(this, arguments);
    } : lift(and)(f, g);
  });

  /**
   * A function that returns the `!` of its argument. It will return `true` when
   * passed false-y value, and `false` when passed a truth-y one.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Logic
   * @sig * -> Boolean
   * @param {*} a any value
   * @return {Boolean} the logical inverse of passed argument.
   * @see R.complement
   * @example
   *
   *      R.not(true); //=> false
   *      R.not(false); //=> true
   *      R.not(0); //=> true
   *      R.not(1); //=> false
   */
  var not = /*#__PURE__*/_curry1(function not(a) {
    return !a;
  });

  /**
   * Takes a function `f` and returns a function `g` such that if called with the same arguments
   * when `f` returns a "truthy" value, `g` returns `false` and when `f` returns a "falsy" value `g` returns `true`.
   *
   * `R.complement` may be applied to any functor
   *
   * @func
   * @memberOf R
   * @since v0.12.0
   * @category Logic
   * @sig (*... -> *) -> (*... -> Boolean)
   * @param {Function} f
   * @return {Function}
   * @see R.not
   * @example
   *
   *      const isNotNil = R.complement(R.isNil);
   *      R.isNil(null); //=> true
   *      isNotNil(null); //=> false
   *      R.isNil(7); //=> false
   *      isNotNil(7); //=> true
   */
  var complement = /*#__PURE__*/lift(not);

  function _pipe(f, g) {
    return function () {
      return g.call(this, f.apply(this, arguments));
    };
  }

  /**
   * This checks whether a function has a [methodname] function. If it isn't an
   * array it will execute that function otherwise it will default to the ramda
   * implementation.
   *
   * @private
   * @param {Function} fn ramda implementation
   * @param {String} methodname property to check for a custom implementation
   * @return {Object} Whatever the return value of the method is.
   */
  function _checkForMethod(methodname, fn) {
    return function () {
      var length = arguments.length;
      if (length === 0) {
        return fn();
      }
      var obj = arguments[length - 1];
      return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
    };
  }

  /**
   * Returns the elements of the given list or string (or object with a `slice`
   * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
   *
   * Dispatches to the `slice` method of the third argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.4
   * @category List
   * @sig Number -> Number -> [a] -> [a]
   * @sig Number -> Number -> String -> String
   * @param {Number} fromIndex The start index (inclusive).
   * @param {Number} toIndex The end index (exclusive).
   * @param {*} list
   * @return {*}
   * @example
   *
   *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
   *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
   *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
   *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
   *      R.slice(0, 3, 'ramda');                     //=> 'ram'
   */
  var slice = /*#__PURE__*/_curry3( /*#__PURE__*/_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex);
  }));

  /**
   * Returns all but the first element of the given list or string (or object
   * with a `tail` method).
   *
   * Dispatches to the `slice` method of the first argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig [a] -> [a]
   * @sig String -> String
   * @param {*} list
   * @return {*}
   * @see R.head, R.init, R.last
   * @example
   *
   *      R.tail([1, 2, 3]);  //=> [2, 3]
   *      R.tail([1, 2]);     //=> [2]
   *      R.tail([1]);        //=> []
   *      R.tail([]);         //=> []
   *
   *      R.tail('abc');  //=> 'bc'
   *      R.tail('ab');   //=> 'b'
   *      R.tail('a');    //=> ''
   *      R.tail('');     //=> ''
   */
  var tail = /*#__PURE__*/_curry1( /*#__PURE__*/_checkForMethod('tail', /*#__PURE__*/slice(1, Infinity)));

  /**
   * Performs left-to-right function composition. The first argument may have
   * any arity; the remaining arguments must be unary.
   *
   * In some libraries this function is named `sequence`.
   *
   * **Note:** The result of pipe is not automatically curried.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
   * @param {...Function} functions
   * @return {Function}
   * @see R.compose
   * @example
   *
   *      const f = R.pipe(Math.pow, R.negate, R.inc);
   *
   *      f(3, 4); // -(3^4) + 1
   * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
   * @symb R.pipe(f, g, h)(a)(b) = h(g(f(a)))(b)
   */
  function pipe() {
    if (arguments.length === 0) {
      throw new Error('pipe requires at least one argument');
    }
    return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
  }

  /**
   * Returns a new list or string with the elements or characters in reverse
   * order.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig [a] -> [a]
   * @sig String -> String
   * @param {Array|String} list
   * @return {Array|String}
   * @example
   *
   *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
   *      R.reverse([1, 2]);     //=> [2, 1]
   *      R.reverse([1]);        //=> [1]
   *      R.reverse([]);         //=> []
   *
   *      R.reverse('abc');      //=> 'cba'
   *      R.reverse('ab');       //=> 'ba'
   *      R.reverse('a');        //=> 'a'
   *      R.reverse('');         //=> ''
   */
  var reverse = /*#__PURE__*/_curry1(function reverse(list) {
    return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
  });

  /**
   * Performs right-to-left function composition. The last argument may have
   * any arity; the remaining arguments must be unary.
   *
   * **Note:** The result of compose is not automatically curried.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
   * @param {...Function} ...functions The functions to compose
   * @return {Function}
   * @see R.pipe
   * @example
   *
   *      const classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
   *      const yellGreeting = R.compose(R.toUpper, classyGreeting);
   *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
   *
   *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
   *
   * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
   * @symb R.compose(f, g, h)(a)(b) = f(g(h(a)))(b)
   */
  function compose() {
    if (arguments.length === 0) {
      throw new Error('compose requires at least one argument');
    }
    return pipe.apply(this, reverse(arguments));
  }

  /**
   * Returns the first element of the given list or string. In some libraries
   * this function is named `first`.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig [a] -> a | Undefined
   * @sig String -> String | Undefined
   * @param {Array|String} list
   * @return {*}
   * @see R.tail, R.init, R.last
   * @example
   *
   *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
   *      R.head([]); //=> undefined
   *
   *      R.head('abc'); //=> 'a'
   *      R.head(''); //=> undefined
   */
  var head = /*#__PURE__*/_curry1(function (list) {
    return _nth(0, list);
  });

  function _identity(x) {
    return x;
  }

  /**
   * A function that does nothing but return the parameter supplied to it. Good
   * as a default or placeholder function.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig a -> a
   * @param {*} x The value to return.
   * @return {*} The input value, `x`.
   * @example
   *
   *      R.identity(1); //=> 1
   *
   *      const obj = {};
   *      R.identity(obj) === obj; //=> true
   * @symb R.identity(a) = a
   */
  var identity = /*#__PURE__*/_curry1(_identity);

  /**
   * Returns the result of concatenating the given lists or strings.
   *
   * Note: `R.concat` expects both arguments to be of the same type,
   * unlike the native `Array.prototype.concat` method. It will throw
   * an error if you `concat` an Array with a non-Array value.
   *
   * Dispatches to the `concat` method of the first argument, if present.
   * Can also concatenate two members of a [fantasy-land
   * compatible semigroup](https://github.com/fantasyland/fantasy-land#semigroup).
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig [a] -> [a] -> [a]
   * @sig String -> String -> String
   * @param {Array|String} firstList The first list
   * @param {Array|String} secondList The second list
   * @return {Array|String} A list consisting of the elements of `firstList` followed by the elements of
   * `secondList`.
   *
   * @example
   *
   *      R.concat('ABC', 'DEF'); // 'ABCDEF'
   *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
   *      R.concat([], []); //=> []
   */
  var concat = /*#__PURE__*/_curry2(function concat(a, b) {
    if (_isArray(a)) {
      if (_isArray(b)) {
        return a.concat(b);
      }
      throw new TypeError(toString$1(b) + ' is not an array');
    }
    if (_isString(a)) {
      if (_isString(b)) {
        return a + b;
      }
      throw new TypeError(toString$1(b) + ' is not a string');
    }
    if (a != null && _isFunction(a['fantasy-land/concat'])) {
      return a['fantasy-land/concat'](b);
    }
    if (a != null && _isFunction(a.concat)) {
      return a.concat(b);
    }
    throw new TypeError(toString$1(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
  });

  /**
   * Accepts a converging function and a list of branching functions and returns
   * a new function. The arity of the new function is the same as the arity of
   * the longest branching function. When invoked, this new function is applied
   * to some arguments, and each branching function is applied to those same
   * arguments. The results of each branching function are passed as arguments
   * to the converging function to produce the return value.
   *
   * @func
   * @memberOf R
   * @since v0.4.2
   * @category Function
   * @sig ((x1, x2, ...) -> z) -> [((a, b, ...) -> x1), ((a, b, ...) -> x2), ...] -> (a -> b -> ... -> z)
   * @param {Function} after A function. `after` will be invoked with the return values of
   *        `fn1` and `fn2` as its arguments.
   * @param {Array} functions A list of functions.
   * @return {Function} A new function.
   * @see R.useWith
   * @example
   *
   *      const average = R.converge(R.divide, [R.sum, R.length])
   *      average([1, 2, 3, 4, 5, 6, 7]) //=> 4
   *
   *      const strangeConcat = R.converge(R.concat, [R.toUpper, R.toLower])
   *      strangeConcat("Yodel") //=> "YODELyodel"
   *
   * @symb R.converge(f, [g, h])(a, b) = f(g(a, b), h(a, b))
   */
  var converge = /*#__PURE__*/_curry2(function converge(after, fns) {
    return curryN(reduce(max, 0, pluck('length', fns)), function () {
      var args = arguments;
      var context = this;
      return after.apply(context, _map(function (fn) {
        return fn.apply(context, args);
      }, fns));
    });
  });

  /**
   * Returns the second argument if it is not `null`, `undefined` or `NaN`;
   * otherwise the first argument is returned.
   *
   * @func
   * @memberOf R
   * @since v0.10.0
   * @category Logic
   * @sig a -> b -> a | b
   * @param {a} default The default value.
   * @param {b} val `val` will be returned instead of `default` unless `val` is `null`, `undefined` or `NaN`.
   * @return {*} The second value if it is not `null`, `undefined` or `NaN`, otherwise the default value
   * @example
   *
   *      const defaultTo42 = R.defaultTo(42);
   *
   *      defaultTo42(null);  //=> 42
   *      defaultTo42(undefined);  //=> 42
   *      defaultTo42(false);  //=> false
   *      defaultTo42('Ramda');  //=> 'Ramda'
   *      // parseInt('string') results in NaN
   *      defaultTo42(parseInt('string')); //=> 42
   */
  var defaultTo = /*#__PURE__*/_curry2(function defaultTo(d, v) {
    return v == null || v !== v ? d : v;
  });

  var XDropWhile = /*#__PURE__*/function () {
    function XDropWhile(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
    XDropWhile.prototype['@@transducer/result'] = _xfBase.result;
    XDropWhile.prototype['@@transducer/step'] = function (result, input) {
      if (this.f) {
        if (this.f(input)) {
          return result;
        }
        this.f = null;
      }
      return this.xf['@@transducer/step'](result, input);
    };
    return XDropWhile;
  }();
  function _xdropWhile(f) {
    return function (xf) {
      return new XDropWhile(f, xf);
    };
  }

  /**
   * Returns a new list excluding the leading elements of a given list which
   * satisfy the supplied predicate function. It passes each value to the supplied
   * predicate function, skipping elements while the predicate function returns
   * `true`. The predicate function is applied to one argument: *(value)*.
   *
   * Dispatches to the `dropWhile` method of the second argument, if present.
   *
   * Acts as a transducer if a transformer is given in list position.
   *
   * @func
   * @memberOf R
   * @since v0.9.0
   * @category List
   * @sig (a -> Boolean) -> [a] -> [a]
   * @sig (a -> Boolean) -> String -> String
   * @param {Function} fn The function called per iteration.
   * @param {Array} xs The collection to iterate over.
   * @return {Array} A new array.
   * @see R.takeWhile, R.transduce, R.addIndex
   * @example
   *
   *      const lteTwo = x => x <= 2;
   *
   *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
   *
   *      R.dropWhile(x => x !== 'd' , 'Ramda'); //=> 'da'
   */
  var dropWhile = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['dropWhile'], _xdropWhile, function dropWhile(pred, xs) {
    var idx = 0;
    var len = xs.length;
    while (idx < len && pred(xs[idx])) {
      idx += 1;
    }
    return slice(idx, Infinity, xs);
  }));

  /**
   * Returns a new function much like the supplied one, except that the first two
   * arguments' order is reversed.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig ((a, b, c, ...) -> z) -> (b -> a -> c -> ... -> z)
   * @param {Function} fn The function to invoke with its first two parameters reversed.
   * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
   * @example
   *
   *      const mergeThree = (a, b, c) => [].concat(a, b, c);
   *
   *      mergeThree(1, 2, 3); //=> [1, 2, 3]
   *
   *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
   * @symb R.flip(f)(a, b, c) = f(b, a, c)
   */
  var flip = /*#__PURE__*/_curry1(function flip(fn) {
    return curryN(fn.length, function (a, b) {
      var args = Array.prototype.slice.call(arguments, 0);
      args[0] = b;
      args[1] = a;
      return fn.apply(this, args);
    });
  });

  /**
   * Returns `true` if the first argument is greater than the second; `false`
   * otherwise.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Relation
   * @sig Ord a => a -> a -> Boolean
   * @param {*} a
   * @param {*} b
   * @return {Boolean}
   * @see R.lt
   * @example
   *
   *      R.gt(2, 1); //=> true
   *      R.gt(2, 2); //=> false
   *      R.gt(2, 3); //=> false
   *      R.gt('a', 'z'); //=> false
   *      R.gt('z', 'a'); //=> true
   */
  var gt = /*#__PURE__*/_curry2(function gt(a, b) {
    return a > b;
  });

  /**
   * Returns true if its arguments are identical, false otherwise. Values are
   * identical if they reference the same memory. `NaN` is identical to `NaN`;
   * `0` and `-0` are not identical.
   *
   * Note this is merely a curried version of ES6 `Object.is`.
   *
   * `identical` does not support the `__` placeholder.
   *
   * @func
   * @memberOf R
   * @since v0.15.0
   * @category Relation
   * @sig a -> a -> Boolean
   * @param {*} a
   * @param {*} b
   * @return {Boolean}
   * @example
   *
   *      const o = {};
   *      R.identical(o, o); //=> true
   *      R.identical(1, 1); //=> true
   *      R.identical(1, '1'); //=> false
   *      R.identical([], []); //=> false
   *      R.identical(0, -0); //=> false
   *      R.identical(NaN, NaN); //=> true
   */
  var identical = function (a, b) {
    switch (arguments.length) {
      case 0:
        return identical;
      case 1:
        return function () {
          return function unaryIdentical(_b) {
            switch (arguments.length) {
              case 0:
                return unaryIdentical;
              default:
                return _objectIs$1(a, _b);
            }
          };
        }();
      default:
        return _objectIs$1(a, b);
    }
  };

  /**
   * Returns `true` if the specified value is equal, in [`R.equals`](#equals)
   * terms, to at least one element of the given list; `false` otherwise.
   * Also works with strings.
   *
   * @func
   * @memberOf R
   * @since v0.26.0
   * @category List
   * @sig a -> [a] -> Boolean
   * @param {Object} a The item to compare against.
   * @param {Array} list The array to consider.
   * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
   * @see R.any
   * @example
   *
   *      R.includes(3, [1, 2, 3]); //=> true
   *      R.includes(4, [1, 2, 3]); //=> false
   *      R.includes({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true
   *      R.includes([42], [[42]]); //=> true
   *      R.includes('ba', 'banana'); //=>true
   */
  var includes = /*#__PURE__*/_curry2(_includes);

  // Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  function _objectAssign(target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target);
    var idx = 1;
    var length = arguments.length;
    while (idx < length) {
      var source = arguments[idx];
      if (source != null) {
        for (var nextKey in source) {
          if (_has(nextKey, source)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
      idx += 1;
    }
    return output;
  }
  const _objectAssign$1 = typeof Object.assign === 'function' ? Object.assign : _objectAssign;

  /**
   * Given an `arity` (Number) and a `name` (String) the `invoker` function
   * returns a curried function that takes `arity` arguments and a `context`
   * object. It will "invoke" the `name`'d function (a method) on the `context`
   * object.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
   * @param {Number} arity Number of arguments the returned function should take
   *        before the target object.
   * @param {String} method Name of any of the target object's methods to call.
   * @return {Function} A new curried function.
   * @see R.construct
   * @example
   *      // A function with no arguments
   *      const asJson = invoker(0, "json")
   *      // Just like calling .then((response) => response.json())
   *      fetch("http://example.com/index.json").then(asJson)
   *
   *      // A function with one argument
   *      const sliceFrom = invoker(1, 'slice');
   *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
   *
   *      // A function with two arguments
   *      const sliceFrom6 = invoker(2, 'slice')(6);
   *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
   *
   *      // NOTE: You can't simply pass some of the arguments to the initial invoker function.
   *      const firstCreditCardSection = invoker(2, "slice", 0, 4)
   *      firstCreditCardSection("4242 4242 4242 4242") // => Function<...>
   *
   *      // Since invoker returns a curried function, you may partially apply it to create the function you need.
   *      const firstCreditCardSection = invoker(2, "slice")(0, 4)
   *      firstCreditCardSection("4242 4242 4242 4242") // => "4242"
   *
   * @symb R.invoker(0, 'method')(o) = o['method']()
   * @symb R.invoker(1, 'method')(a, o) = o['method'](a)
   * @symb R.invoker(2, 'method')(a, b, o) = o['method'](a, b)
   */
  var invoker = /*#__PURE__*/_curry2(function invoker(arity, method) {
    return curryN(arity + 1, function () {
      var target = arguments[arity];
      if (target != null && _isFunction(target[method])) {
        return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
      }
      throw new TypeError(toString$1(target) + ' does not have a method named "' + method + '"');
    });
  });

  /**
   * Returns a string made by inserting the `separator` between each element and
   * concatenating all the elements into a single string.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig String -> [a] -> String
   * @param {Number|String} separator The string used to separate the elements.
   * @param {Array} xs The elements to join into a string.
   * @return {String} str The string made by concatenating `xs` with `separator`.
   * @see R.split
   * @example
   *
   *      const spacer = R.join(' ');
   *      spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
   *      R.join('|', [1, 2, 3]);    //=> '1|2|3'
   */
  var join = /*#__PURE__*/invoker(1, 'join');

  function _path(pathAr, obj) {
    var val = obj;
    for (var i = 0; i < pathAr.length; i += 1) {
      if (val == null) {
        return undefined;
      }
      var p = pathAr[i];
      if (_isInteger(p)) {
        val = _nth(p, val);
      } else {
        val = val[p];
      }
    }
    return val;
  }

  /**
   * Create a new object with the own properties of the first object merged with
   * the own properties of the second object. If a key exists in both objects,
   * the value from the second object will be used.
   *
   * @func
   * @memberOf R
   * @since v0.26.0
   * @category Object
   * @sig {k: v} -> {k: v} -> {k: v}
   * @param {Object} l
   * @param {Object} r
   * @return {Object}
   * @see R.mergeLeft, R.mergeDeepRight, R.mergeWith, R.mergeWithKey
   * @example
   *
   *      R.mergeRight({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
   *      //=> { 'name': 'fred', 'age': 40 }
   *
   *      const withDefaults = R.mergeRight({x: 0, y: 0});
   *      withDefaults({y: 2}); //=> {x: 0, y: 2}
   * @symb R.mergeRight(a, b) = {...a, ...b}
   */
  var mergeRight = /*#__PURE__*/_curry2(function mergeRight(l, r) {
    return _objectAssign$1({}, l, r);
  });

  /**
   * If the given, non-null object has a value at the given path, returns the
   * value at that path. Otherwise returns the provided default value.
   *
   * @func
   * @memberOf R
   * @since v0.18.0
   * @category Object
   * @typedefn Idx = String | Int | Symbol
   * @sig a -> [Idx] -> {a} -> a
   * @param {*} d The default value.
   * @param {Array} p The path to use.
   * @param {Object} obj The object to retrieve the nested property from.
   * @return {*} The data at `path` of the supplied object or the default value.
   * @example
   *
   *      R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
   *      R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
   */
  var pathOr = /*#__PURE__*/_curry3(function pathOr(d, p, obj) {
    return defaultTo(d, _path(p, obj));
  });

  /**
   * Replace a substring or regex match in a string with a replacement.
   *
   * The first two parameters correspond to the parameters of the
   * `String.prototype.replace()` function, so the second parameter can also be a
   * function.
   *
   * @func
   * @memberOf R
   * @since v0.7.0
   * @category String
   * @sig RegExp|String -> String -> String -> String
   * @param {RegExp|String} pattern A regular expression or a substring to match.
   * @param {String} replacement The string to replace the matches with.
   * @param {String} str The String to do the search and replacement in.
   * @return {String} The result.
   * @example
   *
   *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
   *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
   *
   *      // Use the "g" (global) flag to replace all occurrences:
   *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
   */
  var replace = /*#__PURE__*/_curry3(function replace(regex, replacement, str) {
    return str.replace(regex, replacement);
  });

  /**
   * Splits a string into an array of strings based on the given
   * separator.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category String
   * @sig (String | RegExp) -> String -> [String]
   * @param {String|RegExp} sep The pattern.
   * @param {String} str The string to separate into an array.
   * @return {Array} The array of strings from `str` separated by `sep`.
   * @see R.join
   * @example
   *
   *      const pathComponents = R.split('/');
   *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
   *
   *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
   */
  var split = /*#__PURE__*/invoker(1, 'split');

  /**
   * Initializes a transducer using supplied iterator function. Returns a single
   * item by iterating through the list, successively calling the transformed
   * iterator function and passing it an accumulator value and the current value
   * from the array, and then passing the result to the next call.
   *
   * The iterator function receives two values: *(acc, value)*. It will be
   * wrapped as a transformer to initialize the transducer. A transformer can be
   * passed directly in place of an iterator function. In both cases, iteration
   * may be stopped early with the [`R.reduced`](#reduced) function.
   *
   * A transducer is a function that accepts a transformer and returns a
   * transformer and can be composed directly.
   *
   * A transformer is an object that provides a 2-arity reducing iterator
   * function, step, 0-arity initial value function, init, and 1-arity result
   * extraction function, result. The step function is used as the iterator
   * function in reduce. The result function is used to convert the final
   * accumulator into the return type and in most cases is
   * [`R.identity`](#identity). The init function can be used to provide an
   * initial accumulator, but is ignored by transduce.
   *
   * The iteration is performed with [`R.reduce`](#reduce) after initializing the transducer.
   *
   * @func
   * @memberOf R
   * @since v0.12.0
   * @category List
   * @sig (c -> c) -> ((a, b) -> a) -> a -> [b] -> a
   * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
   * @param {Function} fn The iterator function. Receives two values, the accumulator and the
   *        current element from the array. Wrapped as transformer, if necessary, and used to
   *        initialize the transducer
   * @param {*} acc The initial accumulator value.
   * @param {Array} list The list to iterate over.
   * @return {*} The final, accumulated value.
   * @see R.reduce, R.reduced, R.into
   * @example
   *
   *      const numbers = [1, 2, 3, 4];
   *      const transducer = R.compose(R.map(R.add(1)), R.take(2));
   *      R.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]
   *
   *      const isOdd = (x) => x % 2 !== 0;
   *      const firstOddTransducer = R.compose(R.filter(isOdd), R.take(1));
   *      R.transduce(firstOddTransducer, R.flip(R.append), [], R.range(0, 100)); //=> [1]
   */
  var transduce = /*#__PURE__*/curryN(4, function transduce(xf, fn, acc, list) {
    return _xReduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
  });

  var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
  var zeroWidth = '\u200b';
  var hasProtoTrim = typeof String.prototype.trim === 'function';
  /**
   * Removes (strips) whitespace from both ends of the string.
   *
   * @func
   * @memberOf R
   * @since v0.6.0
   * @category String
   * @sig String -> String
   * @param {String} str The string to trim.
   * @return {String} Trimmed version of `str`.
   * @example
   *
   *      R.trim('   xyz  '); //=> 'xyz'
   *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
   */
  var trim = !hasProtoTrim || /*#__PURE__*/ws.trim() || ! /*#__PURE__*/zeroWidth.trim() ? /*#__PURE__*/_curry1(function trim(str) {
    var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
    var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
    return str.replace(beginRx, '').replace(endRx, '');
  }) : /*#__PURE__*/_curry1(function trim(str) {
    return str.trim();
  });

  var __defProp$D = Object.defineProperty;
  var __defNormalProp$D = (obj, key, value) => key in obj ? __defProp$D(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$C = (obj, key, value) => __defNormalProp$D(obj, key + "" , value);
  class JsonDocument extends JsonNode {
    get child() {
      return head(this.children);
    }
  }
  __publicField$C(JsonDocument, "type", "document");

  const isNodeType = (type, node) => node != null && typeof node === "object" && "type" in node && node.type === type;
  const isLiteral = (node) => isNodeType("literal", node);
  const isParseResult = (node) => isNodeType("parseResult", node);

  const isDocument$1 = (node) => isNodeType("document", node);
  const isString = (node) => isNodeType("string", node);
  const isFalse = (node) => isNodeType("false", node);
  const isTrue = (node) => isNodeType("true", node);
  const isNull = (node) => isNodeType("null", node);
  const isNumber$1 = (node) => isNodeType("number", node);
  const isArray = (node) => isNodeType("array", node);
  const isObject$1 = (node) => isNodeType("object", node);
  const isStringContent = (node) => isNodeType("stringContent", node);
  const isEscapeSequence = (node) => isNodeType("escapeSequence", node);
  const isProperty = (node) => isNodeType("property", node);
  const isKey = (node) => isNodeType("key", node);

  var __defProp$C = Object.defineProperty;
  var __defNormalProp$C = (obj, key, value) => key in obj ? __defProp$C(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$B = (obj, key, value) => __defNormalProp$C(obj, key + "" , value);
  class JsonObject extends JsonNode {
    get properties() {
      return this.children.filter(isProperty);
    }
  }
  __publicField$B(JsonObject, "type", "object");

  var __defProp$B = Object.defineProperty;
  var __defNormalProp$B = (obj, key, value) => key in obj ? __defProp$B(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$A = (obj, key, value) => __defNormalProp$B(obj, key + "" , value);
  class JsonProperty extends JsonNode {
    get key() {
      return this.children.find(isKey);
    }
    get value() {
      return this.children.find(
        (node) => isFalse(node) || isTrue(node) || isNull(node) || isNumber$1(node) || isString(node) || isArray(node) || isObject$1(node)
      );
    }
  }
  __publicField$A(JsonProperty, "type", "property");

  var __defProp$A = Object.defineProperty;
  var __defNormalProp$A = (obj, key, value) => key in obj ? __defProp$A(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$z = (obj, key, value) => __defNormalProp$A(obj, key + "" , value);
  class JsonArray extends JsonNode {
    get items() {
      return this.children.filter(
        (node) => isFalse(node) || isTrue(node) || isNull(node) || isNumber$1(node) || isString(node) || isArray(node) || isObject$1
      );
    }
  }
  __publicField$z(JsonArray, "type", "array");

  var __defProp$z = Object.defineProperty;
  var __getOwnPropSymbols$b = Object.getOwnPropertySymbols;
  var __hasOwnProp$b = Object.prototype.hasOwnProperty;
  var __propIsEnum$b = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$z = (obj, key, value) => key in obj ? __defProp$z(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$b = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$b.call(b, prop))
        __defNormalProp$z(a, prop, b[prop]);
    if (__getOwnPropSymbols$b)
      for (var prop of __getOwnPropSymbols$b(b)) {
        if (__propIsEnum$b.call(b, prop))
          __defNormalProp$z(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$a = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$b.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$b)
      for (var prop of __getOwnPropSymbols$b(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$b.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$y = (obj, key, value) => __defNormalProp$z(obj, typeof key !== "symbol" ? key + "" : key, value);
  class JsonValue extends JsonNode {
    constructor(_a) {
      var _b = _a, { value } = _b, rest = __objRest$a(_b, ["value"]);
      super(__spreadValues$b({}, rest));
      __publicField$y(this, "value");
      this.value = value;
    }
  }
  __publicField$y(JsonValue, "type", "value");

  var __defProp$y = Object.defineProperty;
  var __defNormalProp$y = (obj, key, value) => key in obj ? __defProp$y(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$x = (obj, key, value) => __defNormalProp$y(obj, key + "" , value);
  class JsonString extends JsonNode {
    get value() {
      if (this.children.length === 1) {
        const onlyChild = this.children[0];
        return onlyChild.value;
      }
      return this.children.filter(
        (node) => isStringContent(node) || isEscapeSequence(node)
      ).reduce((acc, cur) => acc + cur.value, "");
    }
  }
  __publicField$x(JsonString, "type", "string");

  var __defProp$x = Object.defineProperty;
  var __defNormalProp$x = (obj, key, value) => key in obj ? __defProp$x(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$w = (obj, key, value) => __defNormalProp$x(obj, key + "" , value);
  class JsonKey extends JsonString {
  }
  __publicField$w(JsonKey, "type", "key");

  var __defProp$w = Object.defineProperty;
  var __defNormalProp$w = (obj, key, value) => key in obj ? __defProp$w(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$v = (obj, key, value) => __defNormalProp$w(obj, key + "" , value);
  class JsonStringContent extends JsonValue {
  }
  __publicField$v(JsonStringContent, "type", "stringContent");

  var __defProp$v = Object.defineProperty;
  var __defNormalProp$v = (obj, key, value) => key in obj ? __defProp$v(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$u = (obj, key, value) => __defNormalProp$v(obj, key + "" , value);
  class JsonEscapeSequence extends JsonValue {
  }
  __publicField$u(JsonEscapeSequence, "type", "escapeSequence");

  var __defProp$u = Object.defineProperty;
  var __defNormalProp$u = (obj, key, value) => key in obj ? __defProp$u(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$t = (obj, key, value) => __defNormalProp$u(obj, key + "" , value);
  class JsonNumber extends JsonValue {
  }
  __publicField$t(JsonNumber, "type", "number");

  var __defProp$t = Object.defineProperty;
  var __defNormalProp$t = (obj, key, value) => key in obj ? __defProp$t(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$s = (obj, key, value) => __defNormalProp$t(obj, key + "" , value);
  class JsonTrue extends JsonValue {
  }
  __publicField$s(JsonTrue, "type", "true");

  var __defProp$s = Object.defineProperty;
  var __defNormalProp$s = (obj, key, value) => key in obj ? __defProp$s(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$r = (obj, key, value) => __defNormalProp$s(obj, key + "" , value);
  class JsonFalse extends JsonValue {
  }
  __publicField$r(JsonFalse, "type", "false");

  var __defProp$r = Object.defineProperty;
  var __defNormalProp$r = (obj, key, value) => key in obj ? __defProp$r(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$q = (obj, key, value) => __defNormalProp$r(obj, key + "" , value);
  class JsonNull extends JsonValue {
  }
  __publicField$q(JsonNull, "type", "null");

  var __defProp$q = Object.defineProperty;
  var __getOwnPropSymbols$a = Object.getOwnPropertySymbols;
  var __hasOwnProp$a = Object.prototype.hasOwnProperty;
  var __propIsEnum$a = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$q = (obj, key, value) => key in obj ? __defProp$q(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$a = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$a.call(b, prop))
        __defNormalProp$q(a, prop, b[prop]);
    if (__getOwnPropSymbols$a)
      for (var prop of __getOwnPropSymbols$a(b)) {
        if (__propIsEnum$a.call(b, prop))
          __defNormalProp$q(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$9 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$a.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$a)
      for (var prop of __getOwnPropSymbols$a(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$a.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$p = (obj, key, value) => __defNormalProp$q(obj, typeof key !== "symbol" ? key + "" : key, value);
  class YamlAlias extends Node {
    constructor(_a) {
      var _b = _a, { content } = _b, rest = __objRest$9(_b, ["content"]);
      super(__spreadValues$a({}, rest));
      __publicField$p(this, "content");
      this.content = content;
    }
  }
  __publicField$p(YamlAlias, "type", "alias");

  var __defProp$p = Object.defineProperty;
  var __getOwnPropSymbols$9 = Object.getOwnPropertySymbols;
  var __hasOwnProp$9 = Object.prototype.hasOwnProperty;
  var __propIsEnum$9 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$p = (obj, key, value) => key in obj ? __defProp$p(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$9 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$9.call(b, prop))
        __defNormalProp$p(a, prop, b[prop]);
    if (__getOwnPropSymbols$9)
      for (var prop of __getOwnPropSymbols$9(b)) {
        if (__propIsEnum$9.call(b, prop))
          __defNormalProp$p(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$8 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$9.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$9)
      for (var prop of __getOwnPropSymbols$9(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$9.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$o = (obj, key, value) => __defNormalProp$p(obj, typeof key !== "symbol" ? key + "" : key, value);
  class YamlNode extends Node {
    constructor(_a) {
      var _b = _a, { anchor, tag, style, styleGroup } = _b, rest = __objRest$8(_b, ["anchor", "tag", "style", "styleGroup"]);
      super(__spreadValues$9({}, rest));
      __publicField$o(this, "anchor");
      __publicField$o(this, "tag");
      __publicField$o(this, "style");
      __publicField$o(this, "styleGroup");
      this.anchor = anchor;
      this.tag = tag;
      this.style = style;
      this.styleGroup = styleGroup;
    }
  }

  class YamlCollection extends YamlNode {
  }

  var __defProp$o = Object.defineProperty;
  var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
  var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
  var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$o = (obj, key, value) => key in obj ? __defProp$o(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$8 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$8.call(b, prop))
        __defNormalProp$o(a, prop, b[prop]);
    if (__getOwnPropSymbols$8)
      for (var prop of __getOwnPropSymbols$8(b)) {
        if (__propIsEnum$8.call(b, prop))
          __defNormalProp$o(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$7 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$8.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$8)
      for (var prop of __getOwnPropSymbols$8(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$8.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$n = (obj, key, value) => __defNormalProp$o(obj, typeof key !== "symbol" ? key + "" : key, value);
  class YamlComment extends Node {
    constructor(_a) {
      var _b = _a, { content } = _b, rest = __objRest$7(_b, ["content"]);
      super(__spreadValues$8({}, rest));
      __publicField$n(this, "content");
      this.content = content;
    }
  }
  __publicField$n(YamlComment, "type", "comment");

  var __defProp$n = Object.defineProperty;
  var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
  var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
  var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$n = (obj, key, value) => key in obj ? __defProp$n(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$7 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$7.call(b, prop))
        __defNormalProp$n(a, prop, b[prop]);
    if (__getOwnPropSymbols$7)
      for (var prop of __getOwnPropSymbols$7(b)) {
        if (__propIsEnum$7.call(b, prop))
          __defNormalProp$n(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$6 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$7.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$7)
      for (var prop of __getOwnPropSymbols$7(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$7.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$m = (obj, key, value) => __defNormalProp$n(obj, typeof key !== "symbol" ? key + "" : key, value);
  class YamlDirective extends Node {
    constructor(_a) {
      var _b = _a, { name, parameters } = _b, rest = __objRest$6(_b, ["name", "parameters"]);
      super(__spreadValues$7({}, rest));
      __publicField$m(this, "name");
      __publicField$m(this, "parameters");
      this.name = name;
      this.parameters = mergeRight(
        {
          version: void 0,
          handle: void 0,
          prefix: void 0
        },
        parameters
      );
    }
  }
  __publicField$m(YamlDirective, "type", "directive");

  var __defProp$m = Object.defineProperty;
  var __defNormalProp$m = (obj, key, value) => key in obj ? __defProp$m(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$l = (obj, key, value) => __defNormalProp$m(obj, key + "" , value);
  class YamlDocument extends Node {
  }
  __publicField$l(YamlDocument, "type", "document");

  const isStream = (node) => isNodeType("stream", node);
  const isDocument = (node) => isNodeType("document", node);
  const isMapping = (node) => isNodeType("mapping", node);
  const isSequence = (node) => isNodeType("sequence", node);
  const isKeyValuePair = (node) => isNodeType("keyValuePair", node);
  const isTag = (node) => isNodeType("tag", node);
  const isAnchor = (node) => isNodeType("anchor", node);
  const isScalar = (node) => isNodeType("scalar", node);
  const isAlias = (node) => isNodeType("alias", node);
  const isDirective = (node) => isNodeType("directive", node);
  const isComment = (node) => isNodeType("comment", node);

  var __defProp$l = Object.defineProperty;
  var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
  var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
  var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$l = (obj, key, value) => key in obj ? __defProp$l(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$6 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$6.call(b, prop))
        __defNormalProp$l(a, prop, b[prop]);
    if (__getOwnPropSymbols$6)
      for (var prop of __getOwnPropSymbols$6(b)) {
        if (__propIsEnum$6.call(b, prop))
          __defNormalProp$l(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$5 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$6.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$6)
      for (var prop of __getOwnPropSymbols$6(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$6.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$k = (obj, key, value) => __defNormalProp$l(obj, typeof key !== "symbol" ? key + "" : key, value);
  class YamlKeyValuePair extends Node {
    constructor(_a) {
      var _b = _a, { styleGroup } = _b, rest = __objRest$5(_b, ["styleGroup"]);
      super(__spreadValues$6({}, rest));
      __publicField$k(this, "styleGroup");
      this.styleGroup = styleGroup;
    }
  }
  __publicField$k(YamlKeyValuePair, "type", "keyValuePair");
  Object.defineProperties(YamlKeyValuePair.prototype, {
    key: {
      get() {
        return this.children.filter(
          (node) => isScalar(node) || isMapping(node) || isSequence(node)
        )[0];
      },
      enumerable: true
    },
    value: {
      get() {
        const { key, children } = this;
        const excludeKeyPredicate = (node) => node !== key;
        const valuePredicate = (node) => isScalar(node) || isMapping(node) || isSequence(node) || isAlias(node);
        return children.filter((node) => excludeKeyPredicate(node) && valuePredicate(node))[0];
      },
      enumerable: true
    }
  });

  var __defProp$k = Object.defineProperty;
  var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$j = (obj, key, value) => __defNormalProp$k(obj, key + "" , value);
  class YamlMapping extends YamlCollection {
  }
  __publicField$j(YamlMapping, "type", "mapping");
  Object.defineProperty(YamlMapping.prototype, "content", {
    get() {
      return Array.isArray(this.children) ? this.children.filter(isKeyValuePair) : [];
    },
    enumerable: true
  });

  var __defProp$j = Object.defineProperty;
  var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
  var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
  var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$5 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$5.call(b, prop))
        __defNormalProp$j(a, prop, b[prop]);
    if (__getOwnPropSymbols$5)
      for (var prop of __getOwnPropSymbols$5(b)) {
        if (__propIsEnum$5.call(b, prop))
          __defNormalProp$j(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$4 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$5.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$5)
      for (var prop of __getOwnPropSymbols$5(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$5.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$i = (obj, key, value) => __defNormalProp$j(obj, typeof key !== "symbol" ? key + "" : key, value);
  class YamlScalar extends YamlNode {
    constructor(_a) {
      var _b = _a, { content } = _b, rest = __objRest$4(_b, ["content"]);
      super(__spreadValues$5({}, rest));
      __publicField$i(this, "content");
      this.content = content;
    }
  }
  __publicField$i(YamlScalar, "type", "scalar");

  var __defProp$i = Object.defineProperty;
  var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$h = (obj, key, value) => __defNormalProp$i(obj, key + "" , value);
  class YamlSequence extends YamlCollection {
  }
  __publicField$h(YamlSequence, "type", "sequence");
  Object.defineProperty(YamlSequence.prototype, "content", {
    get() {
      const { children } = this;
      return Array.isArray(children) ? children.filter(
        (node) => isSequence(node) || isMapping(node) || isScalar(node) || isAlias(node)
      ) : [];
    },
    enumerable: true
  });

  var __defProp$h = Object.defineProperty;
  var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$g = (obj, key, value) => __defNormalProp$h(obj, key + "" , value);
  class YamlStream extends Node {
  }
  __publicField$g(YamlStream, "type", "stream");
  Object.defineProperty(YamlStream.prototype, "content", {
    get() {
      return Array.isArray(this.children) ? this.children.filter((node) => isDocument(node) || isComment(node)) : [];
    },
    enumerable: true
  });

  var __defProp$g = Object.defineProperty;
  var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
  var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
  var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$4 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$4.call(b, prop))
        __defNormalProp$g(a, prop, b[prop]);
    if (__getOwnPropSymbols$4)
      for (var prop of __getOwnPropSymbols$4(b)) {
        if (__propIsEnum$4.call(b, prop))
          __defNormalProp$g(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$3 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$4.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$4)
      for (var prop of __getOwnPropSymbols$4(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$4.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$f = (obj, key, value) => __defNormalProp$g(obj, typeof key !== "symbol" ? key + "" : key, value);
  var YamlNodeKind = /* @__PURE__ */ ((YamlNodeKind2) => {
    YamlNodeKind2["Scalar"] = "Scalar";
    YamlNodeKind2["Sequence"] = "Sequence";
    YamlNodeKind2["Mapping"] = "Mapping";
    return YamlNodeKind2;
  })(YamlNodeKind || {});
  class YamlTag extends Node {
    constructor(_a) {
      var _b = _a, { explicitName, kind } = _b, rest = __objRest$3(_b, ["explicitName", "kind"]);
      super(__spreadValues$4({}, rest));
      __publicField$f(this, "explicitName");
      __publicField$f(this, "kind");
      this.explicitName = explicitName;
      this.kind = kind;
    }
  }
  __publicField$f(YamlTag, "type", "tag");

  var __defProp$f = Object.defineProperty;
  var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
  var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
  var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$3 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$3.call(b, prop))
        __defNormalProp$f(a, prop, b[prop]);
    if (__getOwnPropSymbols$3)
      for (var prop of __getOwnPropSymbols$3(b)) {
        if (__propIsEnum$3.call(b, prop))
          __defNormalProp$f(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$2 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$3.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$3)
      for (var prop of __getOwnPropSymbols$3(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$3.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$e = (obj, key, value) => __defNormalProp$f(obj, typeof key !== "symbol" ? key + "" : key, value);
  class YamlAnchor extends Node {
    constructor(_a) {
      var _b = _a, { name } = _b, rest = __objRest$2(_b, ["name"]);
      super(__spreadValues$3({}, rest));
      __publicField$e(this, "name");
      this.name = name;
    }
  }
  __publicField$e(YamlAnchor, "type", "anchor");

  var YamlStyle = /* @__PURE__ */ ((YamlStyle2) => {
    YamlStyle2["Plain"] = "Plain";
    YamlStyle2["SingleQuoted"] = "SingleQuoted";
    YamlStyle2["DoubleQuoted"] = "DoubleQuoted";
    YamlStyle2["Literal"] = "Literal";
    YamlStyle2["Folded"] = "Folded";
    YamlStyle2["Explicit"] = "Explicit";
    YamlStyle2["SinglePair"] = "SinglePair";
    YamlStyle2["NextLine"] = "NextLine";
    YamlStyle2["InLine"] = "InLine";
    return YamlStyle2;
  })(YamlStyle || {});
  var YamlStyleGroup = /* @__PURE__ */ ((YamlStyleGroup2) => {
    YamlStyleGroup2["Flow"] = "Flow";
    YamlStyleGroup2["Block"] = "Block";
    return YamlStyleGroup2;
  })(YamlStyleGroup || {});

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var esnext_aggregateError = {};

  var es_aggregateError = {};

  var es_aggregateError_constructor = {};

  var globalThis_1;
  var hasRequiredGlobalThis;

  function requireGlobalThis () {
  	if (hasRequiredGlobalThis) return globalThis_1;
  	hasRequiredGlobalThis = 1;
  	var check = function (it) {
  	  return it && it.Math === Math && it;
  	};

  	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  	globalThis_1 =
  	  // eslint-disable-next-line es/no-global-this -- safe
  	  check(typeof globalThis == 'object' && globalThis) ||
  	  check(typeof window == 'object' && window) ||
  	  // eslint-disable-next-line no-restricted-globals -- safe
  	  check(typeof self == 'object' && self) ||
  	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  	  check(typeof globalThis_1 == 'object' && globalThis_1) ||
  	  // eslint-disable-next-line no-new-func -- fallback
  	  (function () { return this; })() || Function('return this')();
  	return globalThis_1;
  }

  var fails;
  var hasRequiredFails;

  function requireFails () {
  	if (hasRequiredFails) return fails;
  	hasRequiredFails = 1;
  	fails = function (exec) {
  	  try {
  	    return !!exec();
  	  } catch (error) {
  	    return true;
  	  }
  	};
  	return fails;
  }

  var functionBindNative;
  var hasRequiredFunctionBindNative;

  function requireFunctionBindNative () {
  	if (hasRequiredFunctionBindNative) return functionBindNative;
  	hasRequiredFunctionBindNative = 1;
  	var fails = /*@__PURE__*/ requireFails();

  	functionBindNative = !fails(function () {
  	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  	  var test = (function () { /* empty */ }).bind();
  	  // eslint-disable-next-line no-prototype-builtins -- safe
  	  return typeof test != 'function' || test.hasOwnProperty('prototype');
  	});
  	return functionBindNative;
  }

  var functionApply;
  var hasRequiredFunctionApply;

  function requireFunctionApply () {
  	if (hasRequiredFunctionApply) return functionApply;
  	hasRequiredFunctionApply = 1;
  	var NATIVE_BIND = /*@__PURE__*/ requireFunctionBindNative();

  	var FunctionPrototype = Function.prototype;
  	var apply = FunctionPrototype.apply;
  	var call = FunctionPrototype.call;

  	// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
  	functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  	  return call.apply(apply, arguments);
  	});
  	return functionApply;
  }

  var functionUncurryThis;
  var hasRequiredFunctionUncurryThis;

  function requireFunctionUncurryThis () {
  	if (hasRequiredFunctionUncurryThis) return functionUncurryThis;
  	hasRequiredFunctionUncurryThis = 1;
  	var NATIVE_BIND = /*@__PURE__*/ requireFunctionBindNative();

  	var FunctionPrototype = Function.prototype;
  	var call = FunctionPrototype.call;
  	// eslint-disable-next-line es/no-function-prototype-bind -- safe
  	var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

  	functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  	  return function () {
  	    return call.apply(fn, arguments);
  	  };
  	};
  	return functionUncurryThis;
  }

  var classofRaw;
  var hasRequiredClassofRaw;

  function requireClassofRaw () {
  	if (hasRequiredClassofRaw) return classofRaw;
  	hasRequiredClassofRaw = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();

  	var toString = uncurryThis({}.toString);
  	var stringSlice = uncurryThis(''.slice);

  	classofRaw = function (it) {
  	  return stringSlice(toString(it), 8, -1);
  	};
  	return classofRaw;
  }

  var functionUncurryThisClause;
  var hasRequiredFunctionUncurryThisClause;

  function requireFunctionUncurryThisClause () {
  	if (hasRequiredFunctionUncurryThisClause) return functionUncurryThisClause;
  	hasRequiredFunctionUncurryThisClause = 1;
  	var classofRaw = /*@__PURE__*/ requireClassofRaw();
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();

  	functionUncurryThisClause = function (fn) {
  	  // Nashorn bug:
  	  //   https://github.com/zloirock/core-js/issues/1128
  	  //   https://github.com/zloirock/core-js/issues/1130
  	  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
  	};
  	return functionUncurryThisClause;
  }

  var isCallable;
  var hasRequiredIsCallable;

  function requireIsCallable () {
  	if (hasRequiredIsCallable) return isCallable;
  	hasRequiredIsCallable = 1;
  	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
  	var documentAll = typeof document == 'object' && document.all;

  	// `IsCallable` abstract operation
  	// https://tc39.es/ecma262/#sec-iscallable
  	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
  	isCallable = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  	  return typeof argument == 'function' || argument === documentAll;
  	} : function (argument) {
  	  return typeof argument == 'function';
  	};
  	return isCallable;
  }

  var objectGetOwnPropertyDescriptor = {};

  var descriptors;
  var hasRequiredDescriptors;

  function requireDescriptors () {
  	if (hasRequiredDescriptors) return descriptors;
  	hasRequiredDescriptors = 1;
  	var fails = /*@__PURE__*/ requireFails();

  	// Detect IE8's incomplete defineProperty implementation
  	descriptors = !fails(function () {
  	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
  	});
  	return descriptors;
  }

  var functionCall;
  var hasRequiredFunctionCall;

  function requireFunctionCall () {
  	if (hasRequiredFunctionCall) return functionCall;
  	hasRequiredFunctionCall = 1;
  	var NATIVE_BIND = /*@__PURE__*/ requireFunctionBindNative();

  	var call = Function.prototype.call;
  	// eslint-disable-next-line es/no-function-prototype-bind -- safe
  	functionCall = NATIVE_BIND ? call.bind(call) : function () {
  	  return call.apply(call, arguments);
  	};
  	return functionCall;
  }

  var objectPropertyIsEnumerable = {};

  var hasRequiredObjectPropertyIsEnumerable;

  function requireObjectPropertyIsEnumerable () {
  	if (hasRequiredObjectPropertyIsEnumerable) return objectPropertyIsEnumerable;
  	hasRequiredObjectPropertyIsEnumerable = 1;
  	var $propertyIsEnumerable = {}.propertyIsEnumerable;
  	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  	// Nashorn ~ JDK8 bug
  	var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  	// `Object.prototype.propertyIsEnumerable` method implementation
  	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  	  var descriptor = getOwnPropertyDescriptor(this, V);
  	  return !!descriptor && descriptor.enumerable;
  	} : $propertyIsEnumerable;
  	return objectPropertyIsEnumerable;
  }

  var createPropertyDescriptor;
  var hasRequiredCreatePropertyDescriptor;

  function requireCreatePropertyDescriptor () {
  	if (hasRequiredCreatePropertyDescriptor) return createPropertyDescriptor;
  	hasRequiredCreatePropertyDescriptor = 1;
  	createPropertyDescriptor = function (bitmap, value) {
  	  return {
  	    enumerable: !(bitmap & 1),
  	    configurable: !(bitmap & 2),
  	    writable: !(bitmap & 4),
  	    value: value
  	  };
  	};
  	return createPropertyDescriptor;
  }

  var indexedObject;
  var hasRequiredIndexedObject;

  function requireIndexedObject () {
  	if (hasRequiredIndexedObject) return indexedObject;
  	hasRequiredIndexedObject = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();
  	var fails = /*@__PURE__*/ requireFails();
  	var classof = /*@__PURE__*/ requireClassofRaw();

  	var $Object = Object;
  	var split = uncurryThis(''.split);

  	// fallback for non-array-like ES3 and non-enumerable old V8 strings
  	indexedObject = fails(function () {
  	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  	  // eslint-disable-next-line no-prototype-builtins -- safe
  	  return !$Object('z').propertyIsEnumerable(0);
  	}) ? function (it) {
  	  return classof(it) === 'String' ? split(it, '') : $Object(it);
  	} : $Object;
  	return indexedObject;
  }

  var isNullOrUndefined;
  var hasRequiredIsNullOrUndefined;

  function requireIsNullOrUndefined () {
  	if (hasRequiredIsNullOrUndefined) return isNullOrUndefined;
  	hasRequiredIsNullOrUndefined = 1;
  	// we can't use just `it == null` since of `document.all` special case
  	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
  	isNullOrUndefined = function (it) {
  	  return it === null || it === undefined;
  	};
  	return isNullOrUndefined;
  }

  var requireObjectCoercible;
  var hasRequiredRequireObjectCoercible;

  function requireRequireObjectCoercible () {
  	if (hasRequiredRequireObjectCoercible) return requireObjectCoercible;
  	hasRequiredRequireObjectCoercible = 1;
  	var isNullOrUndefined = /*@__PURE__*/ requireIsNullOrUndefined();

  	var $TypeError = TypeError;

  	// `RequireObjectCoercible` abstract operation
  	// https://tc39.es/ecma262/#sec-requireobjectcoercible
  	requireObjectCoercible = function (it) {
  	  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  	  return it;
  	};
  	return requireObjectCoercible;
  }

  var toIndexedObject;
  var hasRequiredToIndexedObject;

  function requireToIndexedObject () {
  	if (hasRequiredToIndexedObject) return toIndexedObject;
  	hasRequiredToIndexedObject = 1;
  	// toObject with fallback for non-array-like ES3 strings
  	var IndexedObject = /*@__PURE__*/ requireIndexedObject();
  	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible();

  	toIndexedObject = function (it) {
  	  return IndexedObject(requireObjectCoercible(it));
  	};
  	return toIndexedObject;
  }

  var isObject;
  var hasRequiredIsObject;

  function requireIsObject () {
  	if (hasRequiredIsObject) return isObject;
  	hasRequiredIsObject = 1;
  	var isCallable = /*@__PURE__*/ requireIsCallable();

  	isObject = function (it) {
  	  return typeof it == 'object' ? it !== null : isCallable(it);
  	};
  	return isObject;
  }

  var path;
  var hasRequiredPath;

  function requirePath () {
  	if (hasRequiredPath) return path;
  	hasRequiredPath = 1;
  	path = {};
  	return path;
  }

  var getBuiltIn;
  var hasRequiredGetBuiltIn;

  function requireGetBuiltIn () {
  	if (hasRequiredGetBuiltIn) return getBuiltIn;
  	hasRequiredGetBuiltIn = 1;
  	var path = /*@__PURE__*/ requirePath();
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var isCallable = /*@__PURE__*/ requireIsCallable();

  	var aFunction = function (variable) {
  	  return isCallable(variable) ? variable : undefined;
  	};

  	getBuiltIn = function (namespace, method) {
  	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(globalThis[namespace])
  	    : path[namespace] && path[namespace][method] || globalThis[namespace] && globalThis[namespace][method];
  	};
  	return getBuiltIn;
  }

  var objectIsPrototypeOf;
  var hasRequiredObjectIsPrototypeOf;

  function requireObjectIsPrototypeOf () {
  	if (hasRequiredObjectIsPrototypeOf) return objectIsPrototypeOf;
  	hasRequiredObjectIsPrototypeOf = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();

  	objectIsPrototypeOf = uncurryThis({}.isPrototypeOf);
  	return objectIsPrototypeOf;
  }

  var environmentUserAgent;
  var hasRequiredEnvironmentUserAgent;

  function requireEnvironmentUserAgent () {
  	if (hasRequiredEnvironmentUserAgent) return environmentUserAgent;
  	hasRequiredEnvironmentUserAgent = 1;
  	var globalThis = /*@__PURE__*/ requireGlobalThis();

  	var navigator = globalThis.navigator;
  	var userAgent = navigator && navigator.userAgent;

  	environmentUserAgent = userAgent ? String(userAgent) : '';
  	return environmentUserAgent;
  }

  var environmentV8Version;
  var hasRequiredEnvironmentV8Version;

  function requireEnvironmentV8Version () {
  	if (hasRequiredEnvironmentV8Version) return environmentV8Version;
  	hasRequiredEnvironmentV8Version = 1;
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var userAgent = /*@__PURE__*/ requireEnvironmentUserAgent();

  	var process = globalThis.process;
  	var Deno = globalThis.Deno;
  	var versions = process && process.versions || Deno && Deno.version;
  	var v8 = versions && versions.v8;
  	var match, version;

  	if (v8) {
  	  match = v8.split('.');
  	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  	  // but their correct versions are not interesting for us
  	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  	}

  	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
  	// so check `userAgent` even if `.v8` exists, but 0
  	if (!version && userAgent) {
  	  match = userAgent.match(/Edge\/(\d+)/);
  	  if (!match || match[1] >= 74) {
  	    match = userAgent.match(/Chrome\/(\d+)/);
  	    if (match) version = +match[1];
  	  }
  	}

  	environmentV8Version = version;
  	return environmentV8Version;
  }

  var symbolConstructorDetection;
  var hasRequiredSymbolConstructorDetection;

  function requireSymbolConstructorDetection () {
  	if (hasRequiredSymbolConstructorDetection) return symbolConstructorDetection;
  	hasRequiredSymbolConstructorDetection = 1;
  	/* eslint-disable es/no-symbol -- required for testing */
  	var V8_VERSION = /*@__PURE__*/ requireEnvironmentV8Version();
  	var fails = /*@__PURE__*/ requireFails();
  	var globalThis = /*@__PURE__*/ requireGlobalThis();

  	var $String = globalThis.String;

  	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  	symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
  	  var symbol = Symbol('symbol detection');
  	  // Chrome 38 Symbol has incorrect toString conversion
  	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  	  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  	  // of course, fail.
  	  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
  	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
  	    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
  	});
  	return symbolConstructorDetection;
  }

  var useSymbolAsUid;
  var hasRequiredUseSymbolAsUid;

  function requireUseSymbolAsUid () {
  	if (hasRequiredUseSymbolAsUid) return useSymbolAsUid;
  	hasRequiredUseSymbolAsUid = 1;
  	/* eslint-disable es/no-symbol -- required for testing */
  	var NATIVE_SYMBOL = /*@__PURE__*/ requireSymbolConstructorDetection();

  	useSymbolAsUid = NATIVE_SYMBOL &&
  	  !Symbol.sham &&
  	  typeof Symbol.iterator == 'symbol';
  	return useSymbolAsUid;
  }

  var isSymbol;
  var hasRequiredIsSymbol;

  function requireIsSymbol () {
  	if (hasRequiredIsSymbol) return isSymbol;
  	hasRequiredIsSymbol = 1;
  	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn();
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf();
  	var USE_SYMBOL_AS_UID = /*@__PURE__*/ requireUseSymbolAsUid();

  	var $Object = Object;

  	isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  	  return typeof it == 'symbol';
  	} : function (it) {
  	  var $Symbol = getBuiltIn('Symbol');
  	  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
  	};
  	return isSymbol;
  }

  var tryToString;
  var hasRequiredTryToString;

  function requireTryToString () {
  	if (hasRequiredTryToString) return tryToString;
  	hasRequiredTryToString = 1;
  	var $String = String;

  	tryToString = function (argument) {
  	  try {
  	    return $String(argument);
  	  } catch (error) {
  	    return 'Object';
  	  }
  	};
  	return tryToString;
  }

  var aCallable;
  var hasRequiredACallable;

  function requireACallable () {
  	if (hasRequiredACallable) return aCallable;
  	hasRequiredACallable = 1;
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var tryToString = /*@__PURE__*/ requireTryToString();

  	var $TypeError = TypeError;

  	// `Assert: IsCallable(argument) is true`
  	aCallable = function (argument) {
  	  if (isCallable(argument)) return argument;
  	  throw new $TypeError(tryToString(argument) + ' is not a function');
  	};
  	return aCallable;
  }

  var getMethod;
  var hasRequiredGetMethod;

  function requireGetMethod () {
  	if (hasRequiredGetMethod) return getMethod;
  	hasRequiredGetMethod = 1;
  	var aCallable = /*@__PURE__*/ requireACallable();
  	var isNullOrUndefined = /*@__PURE__*/ requireIsNullOrUndefined();

  	// `GetMethod` abstract operation
  	// https://tc39.es/ecma262/#sec-getmethod
  	getMethod = function (V, P) {
  	  var func = V[P];
  	  return isNullOrUndefined(func) ? undefined : aCallable(func);
  	};
  	return getMethod;
  }

  var ordinaryToPrimitive;
  var hasRequiredOrdinaryToPrimitive;

  function requireOrdinaryToPrimitive () {
  	if (hasRequiredOrdinaryToPrimitive) return ordinaryToPrimitive;
  	hasRequiredOrdinaryToPrimitive = 1;
  	var call = /*@__PURE__*/ requireFunctionCall();
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var isObject = /*@__PURE__*/ requireIsObject();

  	var $TypeError = TypeError;

  	// `OrdinaryToPrimitive` abstract operation
  	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
  	ordinaryToPrimitive = function (input, pref) {
  	  var fn, val;
  	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  	  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  	  throw new $TypeError("Can't convert object to primitive value");
  	};
  	return ordinaryToPrimitive;
  }

  var sharedStore = {exports: {}};

  var isPure;
  var hasRequiredIsPure;

  function requireIsPure () {
  	if (hasRequiredIsPure) return isPure;
  	hasRequiredIsPure = 1;
  	isPure = true;
  	return isPure;
  }

  var defineGlobalProperty;
  var hasRequiredDefineGlobalProperty;

  function requireDefineGlobalProperty () {
  	if (hasRequiredDefineGlobalProperty) return defineGlobalProperty;
  	hasRequiredDefineGlobalProperty = 1;
  	var globalThis = /*@__PURE__*/ requireGlobalThis();

  	// eslint-disable-next-line es/no-object-defineproperty -- safe
  	var defineProperty = Object.defineProperty;

  	defineGlobalProperty = function (key, value) {
  	  try {
  	    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  	  } catch (error) {
  	    globalThis[key] = value;
  	  } return value;
  	};
  	return defineGlobalProperty;
  }

  var hasRequiredSharedStore;

  function requireSharedStore () {
  	if (hasRequiredSharedStore) return sharedStore.exports;
  	hasRequiredSharedStore = 1;
  	var IS_PURE = /*@__PURE__*/ requireIsPure();
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var defineGlobalProperty = /*@__PURE__*/ requireDefineGlobalProperty();

  	var SHARED = '__core-js_shared__';
  	var store = sharedStore.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

  	(store.versions || (store.versions = [])).push({
  	  version: '3.42.0',
  	  mode: IS_PURE ? 'pure' : 'global',
  	  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
  	  license: 'https://github.com/zloirock/core-js/blob/v3.42.0/LICENSE',
  	  source: 'https://github.com/zloirock/core-js'
  	});
  	return sharedStore.exports;
  }

  var shared;
  var hasRequiredShared;

  function requireShared () {
  	if (hasRequiredShared) return shared;
  	hasRequiredShared = 1;
  	var store = /*@__PURE__*/ requireSharedStore();

  	shared = function (key, value) {
  	  return store[key] || (store[key] = value || {});
  	};
  	return shared;
  }

  var toObject;
  var hasRequiredToObject;

  function requireToObject () {
  	if (hasRequiredToObject) return toObject;
  	hasRequiredToObject = 1;
  	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible();

  	var $Object = Object;

  	// `ToObject` abstract operation
  	// https://tc39.es/ecma262/#sec-toobject
  	toObject = function (argument) {
  	  return $Object(requireObjectCoercible(argument));
  	};
  	return toObject;
  }

  var hasOwnProperty_1;
  var hasRequiredHasOwnProperty;

  function requireHasOwnProperty () {
  	if (hasRequiredHasOwnProperty) return hasOwnProperty_1;
  	hasRequiredHasOwnProperty = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();
  	var toObject = /*@__PURE__*/ requireToObject();

  	var hasOwnProperty = uncurryThis({}.hasOwnProperty);

  	// `HasOwnProperty` abstract operation
  	// https://tc39.es/ecma262/#sec-hasownproperty
  	// eslint-disable-next-line es/no-object-hasown -- safe
  	hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  	  return hasOwnProperty(toObject(it), key);
  	};
  	return hasOwnProperty_1;
  }

  var uid;
  var hasRequiredUid;

  function requireUid () {
  	if (hasRequiredUid) return uid;
  	hasRequiredUid = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();

  	var id = 0;
  	var postfix = Math.random();
  	var toString = uncurryThis(1.0.toString);

  	uid = function (key) {
  	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
  	};
  	return uid;
  }

  var wellKnownSymbol;
  var hasRequiredWellKnownSymbol;

  function requireWellKnownSymbol () {
  	if (hasRequiredWellKnownSymbol) return wellKnownSymbol;
  	hasRequiredWellKnownSymbol = 1;
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var shared = /*@__PURE__*/ requireShared();
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();
  	var uid = /*@__PURE__*/ requireUid();
  	var NATIVE_SYMBOL = /*@__PURE__*/ requireSymbolConstructorDetection();
  	var USE_SYMBOL_AS_UID = /*@__PURE__*/ requireUseSymbolAsUid();

  	var Symbol = globalThis.Symbol;
  	var WellKnownSymbolsStore = shared('wks');
  	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

  	wellKnownSymbol = function (name) {
  	  if (!hasOwn(WellKnownSymbolsStore, name)) {
  	    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
  	      ? Symbol[name]
  	      : createWellKnownSymbol('Symbol.' + name);
  	  } return WellKnownSymbolsStore[name];
  	};
  	return wellKnownSymbol;
  }

  var toPrimitive;
  var hasRequiredToPrimitive;

  function requireToPrimitive () {
  	if (hasRequiredToPrimitive) return toPrimitive;
  	hasRequiredToPrimitive = 1;
  	var call = /*@__PURE__*/ requireFunctionCall();
  	var isObject = /*@__PURE__*/ requireIsObject();
  	var isSymbol = /*@__PURE__*/ requireIsSymbol();
  	var getMethod = /*@__PURE__*/ requireGetMethod();
  	var ordinaryToPrimitive = /*@__PURE__*/ requireOrdinaryToPrimitive();
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();

  	var $TypeError = TypeError;
  	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

  	// `ToPrimitive` abstract operation
  	// https://tc39.es/ecma262/#sec-toprimitive
  	toPrimitive = function (input, pref) {
  	  if (!isObject(input) || isSymbol(input)) return input;
  	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  	  var result;
  	  if (exoticToPrim) {
  	    if (pref === undefined) pref = 'default';
  	    result = call(exoticToPrim, input, pref);
  	    if (!isObject(result) || isSymbol(result)) return result;
  	    throw new $TypeError("Can't convert object to primitive value");
  	  }
  	  if (pref === undefined) pref = 'number';
  	  return ordinaryToPrimitive(input, pref);
  	};
  	return toPrimitive;
  }

  var toPropertyKey;
  var hasRequiredToPropertyKey;

  function requireToPropertyKey () {
  	if (hasRequiredToPropertyKey) return toPropertyKey;
  	hasRequiredToPropertyKey = 1;
  	var toPrimitive = /*@__PURE__*/ requireToPrimitive();
  	var isSymbol = /*@__PURE__*/ requireIsSymbol();

  	// `ToPropertyKey` abstract operation
  	// https://tc39.es/ecma262/#sec-topropertykey
  	toPropertyKey = function (argument) {
  	  var key = toPrimitive(argument, 'string');
  	  return isSymbol(key) ? key : key + '';
  	};
  	return toPropertyKey;
  }

  var documentCreateElement;
  var hasRequiredDocumentCreateElement;

  function requireDocumentCreateElement () {
  	if (hasRequiredDocumentCreateElement) return documentCreateElement;
  	hasRequiredDocumentCreateElement = 1;
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var isObject = /*@__PURE__*/ requireIsObject();

  	var document = globalThis.document;
  	// typeof document.createElement is 'object' in old IE
  	var EXISTS = isObject(document) && isObject(document.createElement);

  	documentCreateElement = function (it) {
  	  return EXISTS ? document.createElement(it) : {};
  	};
  	return documentCreateElement;
  }

  var ie8DomDefine;
  var hasRequiredIe8DomDefine;

  function requireIe8DomDefine () {
  	if (hasRequiredIe8DomDefine) return ie8DomDefine;
  	hasRequiredIe8DomDefine = 1;
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();
  	var fails = /*@__PURE__*/ requireFails();
  	var createElement = /*@__PURE__*/ requireDocumentCreateElement();

  	// Thanks to IE8 for its funny defineProperty
  	ie8DomDefine = !DESCRIPTORS && !fails(function () {
  	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  	  return Object.defineProperty(createElement('div'), 'a', {
  	    get: function () { return 7; }
  	  }).a !== 7;
  	});
  	return ie8DomDefine;
  }

  var hasRequiredObjectGetOwnPropertyDescriptor;

  function requireObjectGetOwnPropertyDescriptor () {
  	if (hasRequiredObjectGetOwnPropertyDescriptor) return objectGetOwnPropertyDescriptor;
  	hasRequiredObjectGetOwnPropertyDescriptor = 1;
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();
  	var call = /*@__PURE__*/ requireFunctionCall();
  	var propertyIsEnumerableModule = /*@__PURE__*/ requireObjectPropertyIsEnumerable();
  	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor();
  	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject();
  	var toPropertyKey = /*@__PURE__*/ requireToPropertyKey();
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();
  	var IE8_DOM_DEFINE = /*@__PURE__*/ requireIe8DomDefine();

  	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  	// `Object.getOwnPropertyDescriptor` method
  	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  	objectGetOwnPropertyDescriptor.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  	  O = toIndexedObject(O);
  	  P = toPropertyKey(P);
  	  if (IE8_DOM_DEFINE) try {
  	    return $getOwnPropertyDescriptor(O, P);
  	  } catch (error) { /* empty */ }
  	  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
  	};
  	return objectGetOwnPropertyDescriptor;
  }

  var isForced_1;
  var hasRequiredIsForced;

  function requireIsForced () {
  	if (hasRequiredIsForced) return isForced_1;
  	hasRequiredIsForced = 1;
  	var fails = /*@__PURE__*/ requireFails();
  	var isCallable = /*@__PURE__*/ requireIsCallable();

  	var replacement = /#|\.prototype\./;

  	var isForced = function (feature, detection) {
  	  var value = data[normalize(feature)];
  	  return value === POLYFILL ? true
  	    : value === NATIVE ? false
  	    : isCallable(detection) ? fails(detection)
  	    : !!detection;
  	};

  	var normalize = isForced.normalize = function (string) {
  	  return String(string).replace(replacement, '.').toLowerCase();
  	};

  	var data = isForced.data = {};
  	var NATIVE = isForced.NATIVE = 'N';
  	var POLYFILL = isForced.POLYFILL = 'P';

  	isForced_1 = isForced;
  	return isForced_1;
  }

  var functionBindContext;
  var hasRequiredFunctionBindContext;

  function requireFunctionBindContext () {
  	if (hasRequiredFunctionBindContext) return functionBindContext;
  	hasRequiredFunctionBindContext = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThisClause();
  	var aCallable = /*@__PURE__*/ requireACallable();
  	var NATIVE_BIND = /*@__PURE__*/ requireFunctionBindNative();

  	var bind = uncurryThis(uncurryThis.bind);

  	// optional / simple context binding
  	functionBindContext = function (fn, that) {
  	  aCallable(fn);
  	  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
  	    return fn.apply(that, arguments);
  	  };
  	};
  	return functionBindContext;
  }

  var objectDefineProperty = {};

  var v8PrototypeDefineBug;
  var hasRequiredV8PrototypeDefineBug;

  function requireV8PrototypeDefineBug () {
  	if (hasRequiredV8PrototypeDefineBug) return v8PrototypeDefineBug;
  	hasRequiredV8PrototypeDefineBug = 1;
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();
  	var fails = /*@__PURE__*/ requireFails();

  	// V8 ~ Chrome 36-
  	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
  	v8PrototypeDefineBug = DESCRIPTORS && fails(function () {
  	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
  	    value: 42,
  	    writable: false
  	  }).prototype !== 42;
  	});
  	return v8PrototypeDefineBug;
  }

  var anObject;
  var hasRequiredAnObject;

  function requireAnObject () {
  	if (hasRequiredAnObject) return anObject;
  	hasRequiredAnObject = 1;
  	var isObject = /*@__PURE__*/ requireIsObject();

  	var $String = String;
  	var $TypeError = TypeError;

  	// `Assert: Type(argument) is Object`
  	anObject = function (argument) {
  	  if (isObject(argument)) return argument;
  	  throw new $TypeError($String(argument) + ' is not an object');
  	};
  	return anObject;
  }

  var hasRequiredObjectDefineProperty;

  function requireObjectDefineProperty () {
  	if (hasRequiredObjectDefineProperty) return objectDefineProperty;
  	hasRequiredObjectDefineProperty = 1;
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();
  	var IE8_DOM_DEFINE = /*@__PURE__*/ requireIe8DomDefine();
  	var V8_PROTOTYPE_DEFINE_BUG = /*@__PURE__*/ requireV8PrototypeDefineBug();
  	var anObject = /*@__PURE__*/ requireAnObject();
  	var toPropertyKey = /*@__PURE__*/ requireToPropertyKey();

  	var $TypeError = TypeError;
  	// eslint-disable-next-line es/no-object-defineproperty -- safe
  	var $defineProperty = Object.defineProperty;
  	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  	var ENUMERABLE = 'enumerable';
  	var CONFIGURABLE = 'configurable';
  	var WRITABLE = 'writable';

  	// `Object.defineProperty` method
  	// https://tc39.es/ecma262/#sec-object.defineproperty
  	objectDefineProperty.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  	  anObject(O);
  	  P = toPropertyKey(P);
  	  anObject(Attributes);
  	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
  	    var current = $getOwnPropertyDescriptor(O, P);
  	    if (current && current[WRITABLE]) {
  	      O[P] = Attributes.value;
  	      Attributes = {
  	        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
  	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
  	        writable: false
  	      };
  	    }
  	  } return $defineProperty(O, P, Attributes);
  	} : $defineProperty : function defineProperty(O, P, Attributes) {
  	  anObject(O);
  	  P = toPropertyKey(P);
  	  anObject(Attributes);
  	  if (IE8_DOM_DEFINE) try {
  	    return $defineProperty(O, P, Attributes);
  	  } catch (error) { /* empty */ }
  	  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  	  if ('value' in Attributes) O[P] = Attributes.value;
  	  return O;
  	};
  	return objectDefineProperty;
  }

  var createNonEnumerableProperty;
  var hasRequiredCreateNonEnumerableProperty;

  function requireCreateNonEnumerableProperty () {
  	if (hasRequiredCreateNonEnumerableProperty) return createNonEnumerableProperty;
  	hasRequiredCreateNonEnumerableProperty = 1;
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();
  	var definePropertyModule = /*@__PURE__*/ requireObjectDefineProperty();
  	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor();

  	createNonEnumerableProperty = DESCRIPTORS ? function (object, key, value) {
  	  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
  	} : function (object, key, value) {
  	  object[key] = value;
  	  return object;
  	};
  	return createNonEnumerableProperty;
  }

  var _export;
  var hasRequired_export;

  function require_export () {
  	if (hasRequired_export) return _export;
  	hasRequired_export = 1;
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var apply = /*@__PURE__*/ requireFunctionApply();
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThisClause();
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var getOwnPropertyDescriptor = /*@__PURE__*/ requireObjectGetOwnPropertyDescriptor().f;
  	var isForced = /*@__PURE__*/ requireIsForced();
  	var path = /*@__PURE__*/ requirePath();
  	var bind = /*@__PURE__*/ requireFunctionBindContext();
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();

  	var wrapConstructor = function (NativeConstructor) {
  	  var Wrapper = function (a, b, c) {
  	    if (this instanceof Wrapper) {
  	      switch (arguments.length) {
  	        case 0: return new NativeConstructor();
  	        case 1: return new NativeConstructor(a);
  	        case 2: return new NativeConstructor(a, b);
  	      } return new NativeConstructor(a, b, c);
  	    } return apply(NativeConstructor, this, arguments);
  	  };
  	  Wrapper.prototype = NativeConstructor.prototype;
  	  return Wrapper;
  	};

  	/*
  	  options.target         - name of the target object
  	  options.global         - target is the global object
  	  options.stat           - export as static methods of target
  	  options.proto          - export as prototype methods of target
  	  options.real           - real prototype method for the `pure` version
  	  options.forced         - export even if the native feature is available
  	  options.bind           - bind methods to the target, required for the `pure` version
  	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  	  options.sham           - add a flag to not completely full polyfills
  	  options.enumerable     - export as enumerable property
  	  options.dontCallGetSet - prevent calling a getter on target
  	  options.name           - the .name of the function if it does not match the key
  	*/
  	_export = function (options, source) {
  	  var TARGET = options.target;
  	  var GLOBAL = options.global;
  	  var STATIC = options.stat;
  	  var PROTO = options.proto;

  	  var nativeSource = GLOBAL ? globalThis : STATIC ? globalThis[TARGET] : globalThis[TARGET] && globalThis[TARGET].prototype;

  	  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
  	  var targetPrototype = target.prototype;

  	  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  	  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  	  for (key in source) {
  	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
  	    // contains in native
  	    USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);

  	    targetProperty = target[key];

  	    if (USE_NATIVE) if (options.dontCallGetSet) {
  	      descriptor = getOwnPropertyDescriptor(nativeSource, key);
  	      nativeProperty = descriptor && descriptor.value;
  	    } else nativeProperty = nativeSource[key];

  	    // export native or implementation
  	    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

  	    if (!FORCED && !PROTO && typeof targetProperty == typeof sourceProperty) continue;

  	    // bind methods to global for calling from export context
  	    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, globalThis);
  	    // wrap global constructors for prevent changes in this version
  	    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
  	    // make static versions for prototype methods
  	    else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
  	    // default case
  	    else resultProperty = sourceProperty;

  	    // add a flag to not completely full polyfills
  	    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
  	      createNonEnumerableProperty(resultProperty, 'sham', true);
  	    }

  	    createNonEnumerableProperty(target, key, resultProperty);

  	    if (PROTO) {
  	      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
  	      if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
  	        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
  	      }
  	      // export virtual prototype methods
  	      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
  	      // export real prototype methods
  	      if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
  	        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
  	      }
  	    }
  	  }
  	};
  	return _export;
  }

  var sharedKey;
  var hasRequiredSharedKey;

  function requireSharedKey () {
  	if (hasRequiredSharedKey) return sharedKey;
  	hasRequiredSharedKey = 1;
  	var shared = /*@__PURE__*/ requireShared();
  	var uid = /*@__PURE__*/ requireUid();

  	var keys = shared('keys');

  	sharedKey = function (key) {
  	  return keys[key] || (keys[key] = uid(key));
  	};
  	return sharedKey;
  }

  var correctPrototypeGetter;
  var hasRequiredCorrectPrototypeGetter;

  function requireCorrectPrototypeGetter () {
  	if (hasRequiredCorrectPrototypeGetter) return correctPrototypeGetter;
  	hasRequiredCorrectPrototypeGetter = 1;
  	var fails = /*@__PURE__*/ requireFails();

  	correctPrototypeGetter = !fails(function () {
  	  function F() { /* empty */ }
  	  F.prototype.constructor = null;
  	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  	  return Object.getPrototypeOf(new F()) !== F.prototype;
  	});
  	return correctPrototypeGetter;
  }

  var objectGetPrototypeOf;
  var hasRequiredObjectGetPrototypeOf;

  function requireObjectGetPrototypeOf () {
  	if (hasRequiredObjectGetPrototypeOf) return objectGetPrototypeOf;
  	hasRequiredObjectGetPrototypeOf = 1;
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var toObject = /*@__PURE__*/ requireToObject();
  	var sharedKey = /*@__PURE__*/ requireSharedKey();
  	var CORRECT_PROTOTYPE_GETTER = /*@__PURE__*/ requireCorrectPrototypeGetter();

  	var IE_PROTO = sharedKey('IE_PROTO');
  	var $Object = Object;
  	var ObjectPrototype = $Object.prototype;

  	// `Object.getPrototypeOf` method
  	// https://tc39.es/ecma262/#sec-object.getprototypeof
  	// eslint-disable-next-line es/no-object-getprototypeof -- safe
  	objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  	  var object = toObject(O);
  	  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  	  var constructor = object.constructor;
  	  if (isCallable(constructor) && object instanceof constructor) {
  	    return constructor.prototype;
  	  } return object instanceof $Object ? ObjectPrototype : null;
  	};
  	return objectGetPrototypeOf;
  }

  var functionUncurryThisAccessor;
  var hasRequiredFunctionUncurryThisAccessor;

  function requireFunctionUncurryThisAccessor () {
  	if (hasRequiredFunctionUncurryThisAccessor) return functionUncurryThisAccessor;
  	hasRequiredFunctionUncurryThisAccessor = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();
  	var aCallable = /*@__PURE__*/ requireACallable();

  	functionUncurryThisAccessor = function (object, key, method) {
  	  try {
  	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  	    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  	  } catch (error) { /* empty */ }
  	};
  	return functionUncurryThisAccessor;
  }

  var isPossiblePrototype;
  var hasRequiredIsPossiblePrototype;

  function requireIsPossiblePrototype () {
  	if (hasRequiredIsPossiblePrototype) return isPossiblePrototype;
  	hasRequiredIsPossiblePrototype = 1;
  	var isObject = /*@__PURE__*/ requireIsObject();

  	isPossiblePrototype = function (argument) {
  	  return isObject(argument) || argument === null;
  	};
  	return isPossiblePrototype;
  }

  var aPossiblePrototype;
  var hasRequiredAPossiblePrototype;

  function requireAPossiblePrototype () {
  	if (hasRequiredAPossiblePrototype) return aPossiblePrototype;
  	hasRequiredAPossiblePrototype = 1;
  	var isPossiblePrototype = /*@__PURE__*/ requireIsPossiblePrototype();

  	var $String = String;
  	var $TypeError = TypeError;

  	aPossiblePrototype = function (argument) {
  	  if (isPossiblePrototype(argument)) return argument;
  	  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
  	};
  	return aPossiblePrototype;
  }

  var objectSetPrototypeOf;
  var hasRequiredObjectSetPrototypeOf;

  function requireObjectSetPrototypeOf () {
  	if (hasRequiredObjectSetPrototypeOf) return objectSetPrototypeOf;
  	hasRequiredObjectSetPrototypeOf = 1;
  	/* eslint-disable no-proto -- safe */
  	var uncurryThisAccessor = /*@__PURE__*/ requireFunctionUncurryThisAccessor();
  	var isObject = /*@__PURE__*/ requireIsObject();
  	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible();
  	var aPossiblePrototype = /*@__PURE__*/ requireAPossiblePrototype();

  	// `Object.setPrototypeOf` method
  	// https://tc39.es/ecma262/#sec-object.setprototypeof
  	// Works with __proto__ only. Old v8 can't work with null proto objects.
  	// eslint-disable-next-line es/no-object-setprototypeof -- safe
  	objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  	  var CORRECT_SETTER = false;
  	  var test = {};
  	  var setter;
  	  try {
  	    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
  	    setter(test, []);
  	    CORRECT_SETTER = test instanceof Array;
  	  } catch (error) { /* empty */ }
  	  return function setPrototypeOf(O, proto) {
  	    requireObjectCoercible(O);
  	    aPossiblePrototype(proto);
  	    if (!isObject(O)) return O;
  	    if (CORRECT_SETTER) setter(O, proto);
  	    else O.__proto__ = proto;
  	    return O;
  	  };
  	}() : undefined);
  	return objectSetPrototypeOf;
  }

  var objectGetOwnPropertyNames = {};

  var mathTrunc;
  var hasRequiredMathTrunc;

  function requireMathTrunc () {
  	if (hasRequiredMathTrunc) return mathTrunc;
  	hasRequiredMathTrunc = 1;
  	var ceil = Math.ceil;
  	var floor = Math.floor;

  	// `Math.trunc` method
  	// https://tc39.es/ecma262/#sec-math.trunc
  	// eslint-disable-next-line es/no-math-trunc -- safe
  	mathTrunc = Math.trunc || function trunc(x) {
  	  var n = +x;
  	  return (n > 0 ? floor : ceil)(n);
  	};
  	return mathTrunc;
  }

  var toIntegerOrInfinity;
  var hasRequiredToIntegerOrInfinity;

  function requireToIntegerOrInfinity () {
  	if (hasRequiredToIntegerOrInfinity) return toIntegerOrInfinity;
  	hasRequiredToIntegerOrInfinity = 1;
  	var trunc = /*@__PURE__*/ requireMathTrunc();

  	// `ToIntegerOrInfinity` abstract operation
  	// https://tc39.es/ecma262/#sec-tointegerorinfinity
  	toIntegerOrInfinity = function (argument) {
  	  var number = +argument;
  	  // eslint-disable-next-line no-self-compare -- NaN check
  	  return number !== number || number === 0 ? 0 : trunc(number);
  	};
  	return toIntegerOrInfinity;
  }

  var toAbsoluteIndex;
  var hasRequiredToAbsoluteIndex;

  function requireToAbsoluteIndex () {
  	if (hasRequiredToAbsoluteIndex) return toAbsoluteIndex;
  	hasRequiredToAbsoluteIndex = 1;
  	var toIntegerOrInfinity = /*@__PURE__*/ requireToIntegerOrInfinity();

  	var max = Math.max;
  	var min = Math.min;

  	// Helper for a popular repeating case of the spec:
  	// Let integer be ? ToInteger(index).
  	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  	toAbsoluteIndex = function (index, length) {
  	  var integer = toIntegerOrInfinity(index);
  	  return integer < 0 ? max(integer + length, 0) : min(integer, length);
  	};
  	return toAbsoluteIndex;
  }

  var toLength;
  var hasRequiredToLength;

  function requireToLength () {
  	if (hasRequiredToLength) return toLength;
  	hasRequiredToLength = 1;
  	var toIntegerOrInfinity = /*@__PURE__*/ requireToIntegerOrInfinity();

  	var min = Math.min;

  	// `ToLength` abstract operation
  	// https://tc39.es/ecma262/#sec-tolength
  	toLength = function (argument) {
  	  var len = toIntegerOrInfinity(argument);
  	  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  	};
  	return toLength;
  }

  var lengthOfArrayLike;
  var hasRequiredLengthOfArrayLike;

  function requireLengthOfArrayLike () {
  	if (hasRequiredLengthOfArrayLike) return lengthOfArrayLike;
  	hasRequiredLengthOfArrayLike = 1;
  	var toLength = /*@__PURE__*/ requireToLength();

  	// `LengthOfArrayLike` abstract operation
  	// https://tc39.es/ecma262/#sec-lengthofarraylike
  	lengthOfArrayLike = function (obj) {
  	  return toLength(obj.length);
  	};
  	return lengthOfArrayLike;
  }

  var arrayIncludes;
  var hasRequiredArrayIncludes;

  function requireArrayIncludes () {
  	if (hasRequiredArrayIncludes) return arrayIncludes;
  	hasRequiredArrayIncludes = 1;
  	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject();
  	var toAbsoluteIndex = /*@__PURE__*/ requireToAbsoluteIndex();
  	var lengthOfArrayLike = /*@__PURE__*/ requireLengthOfArrayLike();

  	// `Array.prototype.{ indexOf, includes }` methods implementation
  	var createMethod = function (IS_INCLUDES) {
  	  return function ($this, el, fromIndex) {
  	    var O = toIndexedObject($this);
  	    var length = lengthOfArrayLike(O);
  	    if (length === 0) return !IS_INCLUDES && -1;
  	    var index = toAbsoluteIndex(fromIndex, length);
  	    var value;
  	    // Array#includes uses SameValueZero equality algorithm
  	    // eslint-disable-next-line no-self-compare -- NaN check
  	    if (IS_INCLUDES && el !== el) while (length > index) {
  	      value = O[index++];
  	      // eslint-disable-next-line no-self-compare -- NaN check
  	      if (value !== value) return true;
  	    // Array#indexOf ignores holes, Array#includes - not
  	    } else for (;length > index; index++) {
  	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
  	    } return !IS_INCLUDES && -1;
  	  };
  	};

  	arrayIncludes = {
  	  // `Array.prototype.includes` method
  	  // https://tc39.es/ecma262/#sec-array.prototype.includes
  	  includes: createMethod(true),
  	  // `Array.prototype.indexOf` method
  	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  	  indexOf: createMethod(false)
  	};
  	return arrayIncludes;
  }

  var hiddenKeys;
  var hasRequiredHiddenKeys;

  function requireHiddenKeys () {
  	if (hasRequiredHiddenKeys) return hiddenKeys;
  	hasRequiredHiddenKeys = 1;
  	hiddenKeys = {};
  	return hiddenKeys;
  }

  var objectKeysInternal;
  var hasRequiredObjectKeysInternal;

  function requireObjectKeysInternal () {
  	if (hasRequiredObjectKeysInternal) return objectKeysInternal;
  	hasRequiredObjectKeysInternal = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();
  	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject();
  	var indexOf = /*@__PURE__*/ requireArrayIncludes().indexOf;
  	var hiddenKeys = /*@__PURE__*/ requireHiddenKeys();

  	var push = uncurryThis([].push);

  	objectKeysInternal = function (object, names) {
  	  var O = toIndexedObject(object);
  	  var i = 0;
  	  var result = [];
  	  var key;
  	  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  	  // Don't enum bug & hidden keys
  	  while (names.length > i) if (hasOwn(O, key = names[i++])) {
  	    ~indexOf(result, key) || push(result, key);
  	  }
  	  return result;
  	};
  	return objectKeysInternal;
  }

  var enumBugKeys;
  var hasRequiredEnumBugKeys;

  function requireEnumBugKeys () {
  	if (hasRequiredEnumBugKeys) return enumBugKeys;
  	hasRequiredEnumBugKeys = 1;
  	// IE8- don't enum bug keys
  	enumBugKeys = [
  	  'constructor',
  	  'hasOwnProperty',
  	  'isPrototypeOf',
  	  'propertyIsEnumerable',
  	  'toLocaleString',
  	  'toString',
  	  'valueOf'
  	];
  	return enumBugKeys;
  }

  var hasRequiredObjectGetOwnPropertyNames;

  function requireObjectGetOwnPropertyNames () {
  	if (hasRequiredObjectGetOwnPropertyNames) return objectGetOwnPropertyNames;
  	hasRequiredObjectGetOwnPropertyNames = 1;
  	var internalObjectKeys = /*@__PURE__*/ requireObjectKeysInternal();
  	var enumBugKeys = /*@__PURE__*/ requireEnumBugKeys();

  	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

  	// `Object.getOwnPropertyNames` method
  	// https://tc39.es/ecma262/#sec-object.getownpropertynames
  	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
  	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  	  return internalObjectKeys(O, hiddenKeys);
  	};
  	return objectGetOwnPropertyNames;
  }

  var objectGetOwnPropertySymbols = {};

  var hasRequiredObjectGetOwnPropertySymbols;

  function requireObjectGetOwnPropertySymbols () {
  	if (hasRequiredObjectGetOwnPropertySymbols) return objectGetOwnPropertySymbols;
  	hasRequiredObjectGetOwnPropertySymbols = 1;
  	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
  	return objectGetOwnPropertySymbols;
  }

  var ownKeys;
  var hasRequiredOwnKeys;

  function requireOwnKeys () {
  	if (hasRequiredOwnKeys) return ownKeys;
  	hasRequiredOwnKeys = 1;
  	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn();
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();
  	var getOwnPropertyNamesModule = /*@__PURE__*/ requireObjectGetOwnPropertyNames();
  	var getOwnPropertySymbolsModule = /*@__PURE__*/ requireObjectGetOwnPropertySymbols();
  	var anObject = /*@__PURE__*/ requireAnObject();

  	var concat = uncurryThis([].concat);

  	// all object keys, includes non-enumerable and symbols
  	ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  	  var keys = getOwnPropertyNamesModule.f(anObject(it));
  	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
  	};
  	return ownKeys;
  }

  var copyConstructorProperties;
  var hasRequiredCopyConstructorProperties;

  function requireCopyConstructorProperties () {
  	if (hasRequiredCopyConstructorProperties) return copyConstructorProperties;
  	hasRequiredCopyConstructorProperties = 1;
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();
  	var ownKeys = /*@__PURE__*/ requireOwnKeys();
  	var getOwnPropertyDescriptorModule = /*@__PURE__*/ requireObjectGetOwnPropertyDescriptor();
  	var definePropertyModule = /*@__PURE__*/ requireObjectDefineProperty();

  	copyConstructorProperties = function (target, source, exceptions) {
  	  var keys = ownKeys(source);
  	  var defineProperty = definePropertyModule.f;
  	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  	  for (var i = 0; i < keys.length; i++) {
  	    var key = keys[i];
  	    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
  	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  	    }
  	  }
  	};
  	return copyConstructorProperties;
  }

  var objectDefineProperties = {};

  var objectKeys;
  var hasRequiredObjectKeys;

  function requireObjectKeys () {
  	if (hasRequiredObjectKeys) return objectKeys;
  	hasRequiredObjectKeys = 1;
  	var internalObjectKeys = /*@__PURE__*/ requireObjectKeysInternal();
  	var enumBugKeys = /*@__PURE__*/ requireEnumBugKeys();

  	// `Object.keys` method
  	// https://tc39.es/ecma262/#sec-object.keys
  	// eslint-disable-next-line es/no-object-keys -- safe
  	objectKeys = Object.keys || function keys(O) {
  	  return internalObjectKeys(O, enumBugKeys);
  	};
  	return objectKeys;
  }

  var hasRequiredObjectDefineProperties;

  function requireObjectDefineProperties () {
  	if (hasRequiredObjectDefineProperties) return objectDefineProperties;
  	hasRequiredObjectDefineProperties = 1;
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();
  	var V8_PROTOTYPE_DEFINE_BUG = /*@__PURE__*/ requireV8PrototypeDefineBug();
  	var definePropertyModule = /*@__PURE__*/ requireObjectDefineProperty();
  	var anObject = /*@__PURE__*/ requireAnObject();
  	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject();
  	var objectKeys = /*@__PURE__*/ requireObjectKeys();

  	// `Object.defineProperties` method
  	// https://tc39.es/ecma262/#sec-object.defineproperties
  	// eslint-disable-next-line es/no-object-defineproperties -- safe
  	objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  	  anObject(O);
  	  var props = toIndexedObject(Properties);
  	  var keys = objectKeys(Properties);
  	  var length = keys.length;
  	  var index = 0;
  	  var key;
  	  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  	  return O;
  	};
  	return objectDefineProperties;
  }

  var html;
  var hasRequiredHtml;

  function requireHtml () {
  	if (hasRequiredHtml) return html;
  	hasRequiredHtml = 1;
  	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn();

  	html = getBuiltIn('document', 'documentElement');
  	return html;
  }

  var objectCreate;
  var hasRequiredObjectCreate;

  function requireObjectCreate () {
  	if (hasRequiredObjectCreate) return objectCreate;
  	hasRequiredObjectCreate = 1;
  	/* global ActiveXObject -- old IE, WSH */
  	var anObject = /*@__PURE__*/ requireAnObject();
  	var definePropertiesModule = /*@__PURE__*/ requireObjectDefineProperties();
  	var enumBugKeys = /*@__PURE__*/ requireEnumBugKeys();
  	var hiddenKeys = /*@__PURE__*/ requireHiddenKeys();
  	var html = /*@__PURE__*/ requireHtml();
  	var documentCreateElement = /*@__PURE__*/ requireDocumentCreateElement();
  	var sharedKey = /*@__PURE__*/ requireSharedKey();

  	var GT = '>';
  	var LT = '<';
  	var PROTOTYPE = 'prototype';
  	var SCRIPT = 'script';
  	var IE_PROTO = sharedKey('IE_PROTO');

  	var EmptyConstructor = function () { /* empty */ };

  	var scriptTag = function (content) {
  	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  	};

  	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  	var NullProtoObjectViaActiveX = function (activeXDocument) {
  	  activeXDocument.write(scriptTag(''));
  	  activeXDocument.close();
  	  var temp = activeXDocument.parentWindow.Object;
  	  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  	  activeXDocument = null;
  	  return temp;
  	};

  	// Create object with fake `null` prototype: use iframe Object with cleared prototype
  	var NullProtoObjectViaIFrame = function () {
  	  // Thrash, waste and sodomy: IE GC bug
  	  var iframe = documentCreateElement('iframe');
  	  var JS = 'java' + SCRIPT + ':';
  	  var iframeDocument;
  	  iframe.style.display = 'none';
  	  html.appendChild(iframe);
  	  // https://github.com/zloirock/core-js/issues/475
  	  iframe.src = String(JS);
  	  iframeDocument = iframe.contentWindow.document;
  	  iframeDocument.open();
  	  iframeDocument.write(scriptTag('document.F=Object'));
  	  iframeDocument.close();
  	  return iframeDocument.F;
  	};

  	// Check for document.domain and active x support
  	// No need to use active x approach when document.domain is not set
  	// see https://github.com/es-shims/es5-shim/issues/150
  	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  	// avoid IE GC bug
  	var activeXDocument;
  	var NullProtoObject = function () {
  	  try {
  	    activeXDocument = new ActiveXObject('htmlfile');
  	  } catch (error) { /* ignore */ }
  	  NullProtoObject = typeof document != 'undefined'
  	    ? document.domain && activeXDocument
  	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
  	      : NullProtoObjectViaIFrame()
  	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  	  var length = enumBugKeys.length;
  	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  	  return NullProtoObject();
  	};

  	hiddenKeys[IE_PROTO] = true;

  	// `Object.create` method
  	// https://tc39.es/ecma262/#sec-object.create
  	// eslint-disable-next-line es/no-object-create -- safe
  	objectCreate = Object.create || function create(O, Properties) {
  	  var result;
  	  if (O !== null) {
  	    EmptyConstructor[PROTOTYPE] = anObject(O);
  	    result = new EmptyConstructor();
  	    EmptyConstructor[PROTOTYPE] = null;
  	    // add "__proto__" for Object.getPrototypeOf polyfill
  	    result[IE_PROTO] = O;
  	  } else result = NullProtoObject();
  	  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
  	};
  	return objectCreate;
  }

  var installErrorCause;
  var hasRequiredInstallErrorCause;

  function requireInstallErrorCause () {
  	if (hasRequiredInstallErrorCause) return installErrorCause;
  	hasRequiredInstallErrorCause = 1;
  	var isObject = /*@__PURE__*/ requireIsObject();
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();

  	// `InstallErrorCause` abstract operation
  	// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
  	installErrorCause = function (O, options) {
  	  if (isObject(options) && 'cause' in options) {
  	    createNonEnumerableProperty(O, 'cause', options.cause);
  	  }
  	};
  	return installErrorCause;
  }

  var errorStackClear;
  var hasRequiredErrorStackClear;

  function requireErrorStackClear () {
  	if (hasRequiredErrorStackClear) return errorStackClear;
  	hasRequiredErrorStackClear = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();

  	var $Error = Error;
  	var replace = uncurryThis(''.replace);

  	var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
  	// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
  	var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
  	var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

  	errorStackClear = function (stack, dropEntries) {
  	  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
  	    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  	  } return stack;
  	};
  	return errorStackClear;
  }

  var errorStackInstallable;
  var hasRequiredErrorStackInstallable;

  function requireErrorStackInstallable () {
  	if (hasRequiredErrorStackInstallable) return errorStackInstallable;
  	hasRequiredErrorStackInstallable = 1;
  	var fails = /*@__PURE__*/ requireFails();
  	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor();

  	errorStackInstallable = !fails(function () {
  	  var error = new Error('a');
  	  if (!('stack' in error)) return true;
  	  // eslint-disable-next-line es/no-object-defineproperty -- safe
  	  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  	  return error.stack !== 7;
  	});
  	return errorStackInstallable;
  }

  var errorStackInstall;
  var hasRequiredErrorStackInstall;

  function requireErrorStackInstall () {
  	if (hasRequiredErrorStackInstall) return errorStackInstall;
  	hasRequiredErrorStackInstall = 1;
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();
  	var clearErrorStack = /*@__PURE__*/ requireErrorStackClear();
  	var ERROR_STACK_INSTALLABLE = /*@__PURE__*/ requireErrorStackInstallable();

  	// non-standard V8
  	var captureStackTrace = Error.captureStackTrace;

  	errorStackInstall = function (error, C, stack, dropEntries) {
  	  if (ERROR_STACK_INSTALLABLE) {
  	    if (captureStackTrace) captureStackTrace(error, C);
  	    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  	  }
  	};
  	return errorStackInstall;
  }

  var iterators;
  var hasRequiredIterators;

  function requireIterators () {
  	if (hasRequiredIterators) return iterators;
  	hasRequiredIterators = 1;
  	iterators = {};
  	return iterators;
  }

  var isArrayIteratorMethod;
  var hasRequiredIsArrayIteratorMethod;

  function requireIsArrayIteratorMethod () {
  	if (hasRequiredIsArrayIteratorMethod) return isArrayIteratorMethod;
  	hasRequiredIsArrayIteratorMethod = 1;
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();
  	var Iterators = /*@__PURE__*/ requireIterators();

  	var ITERATOR = wellKnownSymbol('iterator');
  	var ArrayPrototype = Array.prototype;

  	// check on default Array iterator
  	isArrayIteratorMethod = function (it) {
  	  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
  	};
  	return isArrayIteratorMethod;
  }

  var toStringTagSupport;
  var hasRequiredToStringTagSupport;

  function requireToStringTagSupport () {
  	if (hasRequiredToStringTagSupport) return toStringTagSupport;
  	hasRequiredToStringTagSupport = 1;
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();

  	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  	var test = {};

  	test[TO_STRING_TAG] = 'z';

  	toStringTagSupport = String(test) === '[object z]';
  	return toStringTagSupport;
  }

  var classof;
  var hasRequiredClassof;

  function requireClassof () {
  	if (hasRequiredClassof) return classof;
  	hasRequiredClassof = 1;
  	var TO_STRING_TAG_SUPPORT = /*@__PURE__*/ requireToStringTagSupport();
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var classofRaw = /*@__PURE__*/ requireClassofRaw();
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();

  	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  	var $Object = Object;

  	// ES3 wrong here
  	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

  	// fallback for IE11 Script Access Denied error
  	var tryGet = function (it, key) {
  	  try {
  	    return it[key];
  	  } catch (error) { /* empty */ }
  	};

  	// getting tag from ES6+ `Object.prototype.toString`
  	classof = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  	  var O, tag, result;
  	  return it === undefined ? 'Undefined' : it === null ? 'Null'
  	    // @@toStringTag case
  	    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
  	    // builtinTag case
  	    : CORRECT_ARGUMENTS ? classofRaw(O)
  	    // ES3 arguments fallback
  	    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
  	};
  	return classof;
  }

  var getIteratorMethod;
  var hasRequiredGetIteratorMethod;

  function requireGetIteratorMethod () {
  	if (hasRequiredGetIteratorMethod) return getIteratorMethod;
  	hasRequiredGetIteratorMethod = 1;
  	var classof = /*@__PURE__*/ requireClassof();
  	var getMethod = /*@__PURE__*/ requireGetMethod();
  	var isNullOrUndefined = /*@__PURE__*/ requireIsNullOrUndefined();
  	var Iterators = /*@__PURE__*/ requireIterators();
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();

  	var ITERATOR = wellKnownSymbol('iterator');

  	getIteratorMethod = function (it) {
  	  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
  	    || getMethod(it, '@@iterator')
  	    || Iterators[classof(it)];
  	};
  	return getIteratorMethod;
  }

  var getIterator;
  var hasRequiredGetIterator;

  function requireGetIterator () {
  	if (hasRequiredGetIterator) return getIterator;
  	hasRequiredGetIterator = 1;
  	var call = /*@__PURE__*/ requireFunctionCall();
  	var aCallable = /*@__PURE__*/ requireACallable();
  	var anObject = /*@__PURE__*/ requireAnObject();
  	var tryToString = /*@__PURE__*/ requireTryToString();
  	var getIteratorMethod = /*@__PURE__*/ requireGetIteratorMethod();

  	var $TypeError = TypeError;

  	getIterator = function (argument, usingIterator) {
  	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  	  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  	  throw new $TypeError(tryToString(argument) + ' is not iterable');
  	};
  	return getIterator;
  }

  var iteratorClose;
  var hasRequiredIteratorClose;

  function requireIteratorClose () {
  	if (hasRequiredIteratorClose) return iteratorClose;
  	hasRequiredIteratorClose = 1;
  	var call = /*@__PURE__*/ requireFunctionCall();
  	var anObject = /*@__PURE__*/ requireAnObject();
  	var getMethod = /*@__PURE__*/ requireGetMethod();

  	iteratorClose = function (iterator, kind, value) {
  	  var innerResult, innerError;
  	  anObject(iterator);
  	  try {
  	    innerResult = getMethod(iterator, 'return');
  	    if (!innerResult) {
  	      if (kind === 'throw') throw value;
  	      return value;
  	    }
  	    innerResult = call(innerResult, iterator);
  	  } catch (error) {
  	    innerError = true;
  	    innerResult = error;
  	  }
  	  if (kind === 'throw') throw value;
  	  if (innerError) throw innerResult;
  	  anObject(innerResult);
  	  return value;
  	};
  	return iteratorClose;
  }

  var iterate;
  var hasRequiredIterate;

  function requireIterate () {
  	if (hasRequiredIterate) return iterate;
  	hasRequiredIterate = 1;
  	var bind = /*@__PURE__*/ requireFunctionBindContext();
  	var call = /*@__PURE__*/ requireFunctionCall();
  	var anObject = /*@__PURE__*/ requireAnObject();
  	var tryToString = /*@__PURE__*/ requireTryToString();
  	var isArrayIteratorMethod = /*@__PURE__*/ requireIsArrayIteratorMethod();
  	var lengthOfArrayLike = /*@__PURE__*/ requireLengthOfArrayLike();
  	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf();
  	var getIterator = /*@__PURE__*/ requireGetIterator();
  	var getIteratorMethod = /*@__PURE__*/ requireGetIteratorMethod();
  	var iteratorClose = /*@__PURE__*/ requireIteratorClose();

  	var $TypeError = TypeError;

  	var Result = function (stopped, result) {
  	  this.stopped = stopped;
  	  this.result = result;
  	};

  	var ResultPrototype = Result.prototype;

  	iterate = function (iterable, unboundFunction, options) {
  	  var that = options && options.that;
  	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  	  var IS_RECORD = !!(options && options.IS_RECORD);
  	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  	  var INTERRUPTED = !!(options && options.INTERRUPTED);
  	  var fn = bind(unboundFunction, that);
  	  var iterator, iterFn, index, length, result, next, step;

  	  var stop = function (condition) {
  	    if (iterator) iteratorClose(iterator, 'normal', condition);
  	    return new Result(true, condition);
  	  };

  	  var callFn = function (value) {
  	    if (AS_ENTRIES) {
  	      anObject(value);
  	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
  	    } return INTERRUPTED ? fn(value, stop) : fn(value);
  	  };

  	  if (IS_RECORD) {
  	    iterator = iterable.iterator;
  	  } else if (IS_ITERATOR) {
  	    iterator = iterable;
  	  } else {
  	    iterFn = getIteratorMethod(iterable);
  	    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
  	    // optimisation for array iterators
  	    if (isArrayIteratorMethod(iterFn)) {
  	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
  	        result = callFn(iterable[index]);
  	        if (result && isPrototypeOf(ResultPrototype, result)) return result;
  	      } return new Result(false);
  	    }
  	    iterator = getIterator(iterable, iterFn);
  	  }

  	  next = IS_RECORD ? iterable.next : iterator.next;
  	  while (!(step = call(next, iterator)).done) {
  	    try {
  	      result = callFn(step.value);
  	    } catch (error) {
  	      iteratorClose(iterator, 'throw', error);
  	    }
  	    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  	  } return new Result(false);
  	};
  	return iterate;
  }

  var toString;
  var hasRequiredToString;

  function requireToString () {
  	if (hasRequiredToString) return toString;
  	hasRequiredToString = 1;
  	var classof = /*@__PURE__*/ requireClassof();

  	var $String = String;

  	toString = function (argument) {
  	  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  	  return $String(argument);
  	};
  	return toString;
  }

  var normalizeStringArgument;
  var hasRequiredNormalizeStringArgument;

  function requireNormalizeStringArgument () {
  	if (hasRequiredNormalizeStringArgument) return normalizeStringArgument;
  	hasRequiredNormalizeStringArgument = 1;
  	var toString = /*@__PURE__*/ requireToString();

  	normalizeStringArgument = function (argument, $default) {
  	  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
  	};
  	return normalizeStringArgument;
  }

  var hasRequiredEs_aggregateError_constructor;

  function requireEs_aggregateError_constructor () {
  	if (hasRequiredEs_aggregateError_constructor) return es_aggregateError_constructor;
  	hasRequiredEs_aggregateError_constructor = 1;
  	var $ = /*@__PURE__*/ require_export();
  	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf();
  	var getPrototypeOf = /*@__PURE__*/ requireObjectGetPrototypeOf();
  	var setPrototypeOf = /*@__PURE__*/ requireObjectSetPrototypeOf();
  	var copyConstructorProperties = /*@__PURE__*/ requireCopyConstructorProperties();
  	var create = /*@__PURE__*/ requireObjectCreate();
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();
  	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor();
  	var installErrorCause = /*@__PURE__*/ requireInstallErrorCause();
  	var installErrorStack = /*@__PURE__*/ requireErrorStackInstall();
  	var iterate = /*@__PURE__*/ requireIterate();
  	var normalizeStringArgument = /*@__PURE__*/ requireNormalizeStringArgument();
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();

  	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  	var $Error = Error;
  	var push = [].push;

  	var $AggregateError = function AggregateError(errors, message /* , options */) {
  	  var isInstance = isPrototypeOf(AggregateErrorPrototype, this);
  	  var that;
  	  if (setPrototypeOf) {
  	    that = setPrototypeOf(new $Error(), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
  	  } else {
  	    that = isInstance ? this : create(AggregateErrorPrototype);
  	    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  	  }
  	  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
  	  installErrorStack(that, $AggregateError, that.stack, 1);
  	  if (arguments.length > 2) installErrorCause(that, arguments[2]);
  	  var errorsArray = [];
  	  iterate(errors, push, { that: errorsArray });
  	  createNonEnumerableProperty(that, 'errors', errorsArray);
  	  return that;
  	};

  	if (setPrototypeOf) setPrototypeOf($AggregateError, $Error);
  	else copyConstructorProperties($AggregateError, $Error, { name: true });

  	var AggregateErrorPrototype = $AggregateError.prototype = create($Error.prototype, {
  	  constructor: createPropertyDescriptor(1, $AggregateError),
  	  message: createPropertyDescriptor(1, ''),
  	  name: createPropertyDescriptor(1, 'AggregateError')
  	});

  	// `AggregateError` constructor
  	// https://tc39.es/ecma262/#sec-aggregate-error-constructor
  	$({ global: true, constructor: true, arity: 2 }, {
  	  AggregateError: $AggregateError
  	});
  	return es_aggregateError_constructor;
  }

  var hasRequiredEs_aggregateError;

  function requireEs_aggregateError () {
  	if (hasRequiredEs_aggregateError) return es_aggregateError;
  	hasRequiredEs_aggregateError = 1;
  	// TODO: Remove this module from `core-js@4` since it's replaced to module below
  	requireEs_aggregateError_constructor();
  	return es_aggregateError;
  }

  var hasRequiredEsnext_aggregateError;

  function requireEsnext_aggregateError () {
  	if (hasRequiredEsnext_aggregateError) return esnext_aggregateError;
  	hasRequiredEsnext_aggregateError = 1;
  	// TODO: Remove from `core-js@4`
  	requireEs_aggregateError();
  	return esnext_aggregateError;
  }

  var es_error_cause = {};

  var proxyAccessor;
  var hasRequiredProxyAccessor;

  function requireProxyAccessor () {
  	if (hasRequiredProxyAccessor) return proxyAccessor;
  	hasRequiredProxyAccessor = 1;
  	var defineProperty = /*@__PURE__*/ requireObjectDefineProperty().f;

  	proxyAccessor = function (Target, Source, key) {
  	  key in Target || defineProperty(Target, key, {
  	    configurable: true,
  	    get: function () { return Source[key]; },
  	    set: function (it) { Source[key] = it; }
  	  });
  	};
  	return proxyAccessor;
  }

  var inheritIfRequired;
  var hasRequiredInheritIfRequired;

  function requireInheritIfRequired () {
  	if (hasRequiredInheritIfRequired) return inheritIfRequired;
  	hasRequiredInheritIfRequired = 1;
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var isObject = /*@__PURE__*/ requireIsObject();
  	var setPrototypeOf = /*@__PURE__*/ requireObjectSetPrototypeOf();

  	// makes subclassing work correct for wrapped built-ins
  	inheritIfRequired = function ($this, dummy, Wrapper) {
  	  var NewTarget, NewTargetPrototype;
  	  if (
  	    // it can work only with native `setPrototypeOf`
  	    setPrototypeOf &&
  	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
  	    isCallable(NewTarget = dummy.constructor) &&
  	    NewTarget !== Wrapper &&
  	    isObject(NewTargetPrototype = NewTarget.prototype) &&
  	    NewTargetPrototype !== Wrapper.prototype
  	  ) setPrototypeOf($this, NewTargetPrototype);
  	  return $this;
  	};
  	return inheritIfRequired;
  }

  var wrapErrorConstructorWithCause;
  var hasRequiredWrapErrorConstructorWithCause;

  function requireWrapErrorConstructorWithCause () {
  	if (hasRequiredWrapErrorConstructorWithCause) return wrapErrorConstructorWithCause;
  	hasRequiredWrapErrorConstructorWithCause = 1;
  	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn();
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();
  	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf();
  	var setPrototypeOf = /*@__PURE__*/ requireObjectSetPrototypeOf();
  	var copyConstructorProperties = /*@__PURE__*/ requireCopyConstructorProperties();
  	var proxyAccessor = /*@__PURE__*/ requireProxyAccessor();
  	var inheritIfRequired = /*@__PURE__*/ requireInheritIfRequired();
  	var normalizeStringArgument = /*@__PURE__*/ requireNormalizeStringArgument();
  	var installErrorCause = /*@__PURE__*/ requireInstallErrorCause();
  	var installErrorStack = /*@__PURE__*/ requireErrorStackInstall();
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();
  	var IS_PURE = /*@__PURE__*/ requireIsPure();

  	wrapErrorConstructorWithCause = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  	  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  	  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  	  var path = FULL_NAME.split('.');
  	  var ERROR_NAME = path[path.length - 1];
  	  var OriginalError = getBuiltIn.apply(null, path);

  	  if (!OriginalError) return;

  	  var OriginalErrorPrototype = OriginalError.prototype;

  	  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  	  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  	  if (!FORCED) return OriginalError;

  	  var BaseError = getBuiltIn('Error');

  	  var WrappedError = wrapper(function (a, b) {
  	    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
  	    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
  	    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
  	    installErrorStack(result, WrappedError, result.stack, 2);
  	    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
  	    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
  	    return result;
  	  });

  	  WrappedError.prototype = OriginalErrorPrototype;

  	  if (ERROR_NAME !== 'Error') {
  	    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
  	    else copyConstructorProperties(WrappedError, BaseError, { name: true });
  	  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
  	    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
  	    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
  	  }

  	  copyConstructorProperties(WrappedError, OriginalError);

  	  if (!IS_PURE) try {
  	    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
  	    if (OriginalErrorPrototype.name !== ERROR_NAME) {
  	      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
  	    }
  	    OriginalErrorPrototype.constructor = WrappedError;
  	  } catch (error) { /* empty */ }

  	  return WrappedError;
  	};
  	return wrapErrorConstructorWithCause;
  }

  var hasRequiredEs_error_cause;

  function requireEs_error_cause () {
  	if (hasRequiredEs_error_cause) return es_error_cause;
  	hasRequiredEs_error_cause = 1;
  	/* eslint-disable no-unused-vars -- required for functions `.length` */
  	var $ = /*@__PURE__*/ require_export();
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var apply = /*@__PURE__*/ requireFunctionApply();
  	var wrapErrorConstructorWithCause = /*@__PURE__*/ requireWrapErrorConstructorWithCause();

  	var WEB_ASSEMBLY = 'WebAssembly';
  	var WebAssembly = globalThis[WEB_ASSEMBLY];

  	// eslint-disable-next-line es/no-error-cause -- feature detection
  	var FORCED = new Error('e', { cause: 7 }).cause !== 7;

  	var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  	  var O = {};
  	  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  	  $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
  	};

  	var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  	  if (WebAssembly && WebAssembly[ERROR_NAME]) {
  	    var O = {};
  	    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
  	    $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
  	  }
  	};

  	// https://tc39.es/ecma262/#sec-nativeerror
  	exportGlobalErrorCauseWrapper('Error', function (init) {
  	  return function Error(message) { return apply(init, this, arguments); };
  	});
  	exportGlobalErrorCauseWrapper('EvalError', function (init) {
  	  return function EvalError(message) { return apply(init, this, arguments); };
  	});
  	exportGlobalErrorCauseWrapper('RangeError', function (init) {
  	  return function RangeError(message) { return apply(init, this, arguments); };
  	});
  	exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  	  return function ReferenceError(message) { return apply(init, this, arguments); };
  	});
  	exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  	  return function SyntaxError(message) { return apply(init, this, arguments); };
  	});
  	exportGlobalErrorCauseWrapper('TypeError', function (init) {
  	  return function TypeError(message) { return apply(init, this, arguments); };
  	});
  	exportGlobalErrorCauseWrapper('URIError', function (init) {
  	  return function URIError(message) { return apply(init, this, arguments); };
  	});
  	exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  	  return function CompileError(message) { return apply(init, this, arguments); };
  	});
  	exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  	  return function LinkError(message) { return apply(init, this, arguments); };
  	});
  	exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  	  return function RuntimeError(message) { return apply(init, this, arguments); };
  	});
  	return es_error_cause;
  }

  var es_aggregateError_cause = {};

  var hasRequiredEs_aggregateError_cause;

  function requireEs_aggregateError_cause () {
  	if (hasRequiredEs_aggregateError_cause) return es_aggregateError_cause;
  	hasRequiredEs_aggregateError_cause = 1;
  	var $ = /*@__PURE__*/ require_export();
  	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn();
  	var apply = /*@__PURE__*/ requireFunctionApply();
  	var fails = /*@__PURE__*/ requireFails();
  	var wrapErrorConstructorWithCause = /*@__PURE__*/ requireWrapErrorConstructorWithCause();

  	var AGGREGATE_ERROR = 'AggregateError';
  	var $AggregateError = getBuiltIn(AGGREGATE_ERROR);

  	var FORCED = !fails(function () {
  	  return $AggregateError([1]).errors[0] !== 1;
  	}) && fails(function () {
  	  return $AggregateError([1], AGGREGATE_ERROR, { cause: 7 }).cause !== 7;
  	});

  	// https://tc39.es/ecma262/#sec-aggregate-error
  	$({ global: true, constructor: true, arity: 2, forced: FORCED }, {
  	  AggregateError: wrapErrorConstructorWithCause(AGGREGATE_ERROR, function (init) {
  	    // eslint-disable-next-line no-unused-vars -- required for functions `.length`
  	    return function AggregateError(errors, message) { return apply(init, this, arguments); };
  	  }, FORCED, true)
  	});
  	return es_aggregateError_cause;
  }

  var addToUnscopables;
  var hasRequiredAddToUnscopables;

  function requireAddToUnscopables () {
  	if (hasRequiredAddToUnscopables) return addToUnscopables;
  	hasRequiredAddToUnscopables = 1;
  	addToUnscopables = function () { /* empty */ };
  	return addToUnscopables;
  }

  var weakMapBasicDetection;
  var hasRequiredWeakMapBasicDetection;

  function requireWeakMapBasicDetection () {
  	if (hasRequiredWeakMapBasicDetection) return weakMapBasicDetection;
  	hasRequiredWeakMapBasicDetection = 1;
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var isCallable = /*@__PURE__*/ requireIsCallable();

  	var WeakMap = globalThis.WeakMap;

  	weakMapBasicDetection = isCallable(WeakMap) && /native code/.test(String(WeakMap));
  	return weakMapBasicDetection;
  }

  var internalState;
  var hasRequiredInternalState;

  function requireInternalState () {
  	if (hasRequiredInternalState) return internalState;
  	hasRequiredInternalState = 1;
  	var NATIVE_WEAK_MAP = /*@__PURE__*/ requireWeakMapBasicDetection();
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var isObject = /*@__PURE__*/ requireIsObject();
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();
  	var shared = /*@__PURE__*/ requireSharedStore();
  	var sharedKey = /*@__PURE__*/ requireSharedKey();
  	var hiddenKeys = /*@__PURE__*/ requireHiddenKeys();

  	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  	var TypeError = globalThis.TypeError;
  	var WeakMap = globalThis.WeakMap;
  	var set, get, has;

  	var enforce = function (it) {
  	  return has(it) ? get(it) : set(it, {});
  	};

  	var getterFor = function (TYPE) {
  	  return function (it) {
  	    var state;
  	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
  	      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
  	    } return state;
  	  };
  	};

  	if (NATIVE_WEAK_MAP || shared.state) {
  	  var store = shared.state || (shared.state = new WeakMap());
  	  /* eslint-disable no-self-assign -- prototype methods protection */
  	  store.get = store.get;
  	  store.has = store.has;
  	  store.set = store.set;
  	  /* eslint-enable no-self-assign -- prototype methods protection */
  	  set = function (it, metadata) {
  	    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
  	    metadata.facade = it;
  	    store.set(it, metadata);
  	    return metadata;
  	  };
  	  get = function (it) {
  	    return store.get(it) || {};
  	  };
  	  has = function (it) {
  	    return store.has(it);
  	  };
  	} else {
  	  var STATE = sharedKey('state');
  	  hiddenKeys[STATE] = true;
  	  set = function (it, metadata) {
  	    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
  	    metadata.facade = it;
  	    createNonEnumerableProperty(it, STATE, metadata);
  	    return metadata;
  	  };
  	  get = function (it) {
  	    return hasOwn(it, STATE) ? it[STATE] : {};
  	  };
  	  has = function (it) {
  	    return hasOwn(it, STATE);
  	  };
  	}

  	internalState = {
  	  set: set,
  	  get: get,
  	  has: has,
  	  enforce: enforce,
  	  getterFor: getterFor
  	};
  	return internalState;
  }

  var functionName;
  var hasRequiredFunctionName;

  function requireFunctionName () {
  	if (hasRequiredFunctionName) return functionName;
  	hasRequiredFunctionName = 1;
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();

  	var FunctionPrototype = Function.prototype;
  	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  	var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

  	var EXISTS = hasOwn(FunctionPrototype, 'name');
  	// additional protection from minified / mangled / dropped function names
  	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
  	var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

  	functionName = {
  	  EXISTS: EXISTS,
  	  PROPER: PROPER,
  	  CONFIGURABLE: CONFIGURABLE
  	};
  	return functionName;
  }

  var defineBuiltIn;
  var hasRequiredDefineBuiltIn;

  function requireDefineBuiltIn () {
  	if (hasRequiredDefineBuiltIn) return defineBuiltIn;
  	hasRequiredDefineBuiltIn = 1;
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();

  	defineBuiltIn = function (target, key, value, options) {
  	  if (options && options.enumerable) target[key] = value;
  	  else createNonEnumerableProperty(target, key, value);
  	  return target;
  	};
  	return defineBuiltIn;
  }

  var iteratorsCore;
  var hasRequiredIteratorsCore;

  function requireIteratorsCore () {
  	if (hasRequiredIteratorsCore) return iteratorsCore;
  	hasRequiredIteratorsCore = 1;
  	var fails = /*@__PURE__*/ requireFails();
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var isObject = /*@__PURE__*/ requireIsObject();
  	var create = /*@__PURE__*/ requireObjectCreate();
  	var getPrototypeOf = /*@__PURE__*/ requireObjectGetPrototypeOf();
  	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn();
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();
  	var IS_PURE = /*@__PURE__*/ requireIsPure();

  	var ITERATOR = wellKnownSymbol('iterator');
  	var BUGGY_SAFARI_ITERATORS = false;

  	// `%IteratorPrototype%` object
  	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  	/* eslint-disable es/no-array-prototype-keys -- safe */
  	if ([].keys) {
  	  arrayIterator = [].keys();
  	  // Safari 8 has buggy iterators w/o `next`
  	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  	  else {
  	    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
  	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  	  }
  	}

  	var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  	  var test = {};
  	  // FF44- legacy iterators case
  	  return IteratorPrototype[ITERATOR].call(test) !== test;
  	});

  	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
  	else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

  	// `%IteratorPrototype%[@@iterator]()` method
  	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
  	if (!isCallable(IteratorPrototype[ITERATOR])) {
  	  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
  	    return this;
  	  });
  	}

  	iteratorsCore = {
  	  IteratorPrototype: IteratorPrototype,
  	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  	};
  	return iteratorsCore;
  }

  var objectToString;
  var hasRequiredObjectToString;

  function requireObjectToString () {
  	if (hasRequiredObjectToString) return objectToString;
  	hasRequiredObjectToString = 1;
  	var TO_STRING_TAG_SUPPORT = /*@__PURE__*/ requireToStringTagSupport();
  	var classof = /*@__PURE__*/ requireClassof();

  	// `Object.prototype.toString` method implementation
  	// https://tc39.es/ecma262/#sec-object.prototype.tostring
  	objectToString = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  	  return '[object ' + classof(this) + ']';
  	};
  	return objectToString;
  }

  var setToStringTag;
  var hasRequiredSetToStringTag;

  function requireSetToStringTag () {
  	if (hasRequiredSetToStringTag) return setToStringTag;
  	hasRequiredSetToStringTag = 1;
  	var TO_STRING_TAG_SUPPORT = /*@__PURE__*/ requireToStringTagSupport();
  	var defineProperty = /*@__PURE__*/ requireObjectDefineProperty().f;
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();
  	var hasOwn = /*@__PURE__*/ requireHasOwnProperty();
  	var toString = /*@__PURE__*/ requireObjectToString();
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();

  	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

  	setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
  	  var target = STATIC ? it : it && it.prototype;
  	  if (target) {
  	    if (!hasOwn(target, TO_STRING_TAG)) {
  	      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  	    }
  	    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
  	      createNonEnumerableProperty(target, 'toString', toString);
  	    }
  	  }
  	};
  	return setToStringTag;
  }

  var iteratorCreateConstructor;
  var hasRequiredIteratorCreateConstructor;

  function requireIteratorCreateConstructor () {
  	if (hasRequiredIteratorCreateConstructor) return iteratorCreateConstructor;
  	hasRequiredIteratorCreateConstructor = 1;
  	var IteratorPrototype = /*@__PURE__*/ requireIteratorsCore().IteratorPrototype;
  	var create = /*@__PURE__*/ requireObjectCreate();
  	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor();
  	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
  	var Iterators = /*@__PURE__*/ requireIterators();

  	var returnThis = function () { return this; };

  	iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  	  var TO_STRING_TAG = NAME + ' Iterator';
  	  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  	  Iterators[TO_STRING_TAG] = returnThis;
  	  return IteratorConstructor;
  	};
  	return iteratorCreateConstructor;
  }

  var iteratorDefine;
  var hasRequiredIteratorDefine;

  function requireIteratorDefine () {
  	if (hasRequiredIteratorDefine) return iteratorDefine;
  	hasRequiredIteratorDefine = 1;
  	var $ = /*@__PURE__*/ require_export();
  	var call = /*@__PURE__*/ requireFunctionCall();
  	var IS_PURE = /*@__PURE__*/ requireIsPure();
  	var FunctionName = /*@__PURE__*/ requireFunctionName();
  	var isCallable = /*@__PURE__*/ requireIsCallable();
  	var createIteratorConstructor = /*@__PURE__*/ requireIteratorCreateConstructor();
  	var getPrototypeOf = /*@__PURE__*/ requireObjectGetPrototypeOf();
  	var setPrototypeOf = /*@__PURE__*/ requireObjectSetPrototypeOf();
  	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
  	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty();
  	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn();
  	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol();
  	var Iterators = /*@__PURE__*/ requireIterators();
  	var IteratorsCore = /*@__PURE__*/ requireIteratorsCore();

  	var PROPER_FUNCTION_NAME = FunctionName.PROPER;
  	var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
  	var IteratorPrototype = IteratorsCore.IteratorPrototype;
  	var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
  	var ITERATOR = wellKnownSymbol('iterator');
  	var KEYS = 'keys';
  	var VALUES = 'values';
  	var ENTRIES = 'entries';

  	var returnThis = function () { return this; };

  	iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  	  createIteratorConstructor(IteratorConstructor, NAME, next);

  	  var getIterationMethod = function (KIND) {
  	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
  	    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

  	    switch (KIND) {
  	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
  	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
  	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
  	    }

  	    return function () { return new IteratorConstructor(this); };
  	  };

  	  var TO_STRING_TAG = NAME + ' Iterator';
  	  var INCORRECT_VALUES_NAME = false;
  	  var IterablePrototype = Iterable.prototype;
  	  var nativeIterator = IterablePrototype[ITERATOR]
  	    || IterablePrototype['@@iterator']
  	    || DEFAULT && IterablePrototype[DEFAULT];
  	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  	  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  	  var CurrentIteratorPrototype, methods, KEY;

  	  // fix native
  	  if (anyNativeIterator) {
  	    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
  	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
  	      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
  	        if (setPrototypeOf) {
  	          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
  	        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
  	          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
  	        }
  	      }
  	      // Set @@toStringTag to native iterators
  	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
  	      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
  	    }
  	  }

  	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  	  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
  	    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
  	      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
  	    } else {
  	      INCORRECT_VALUES_NAME = true;
  	      defaultIterator = function values() { return call(nativeIterator, this); };
  	    }
  	  }

  	  // export additional methods
  	  if (DEFAULT) {
  	    methods = {
  	      values: getIterationMethod(VALUES),
  	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
  	      entries: getIterationMethod(ENTRIES)
  	    };
  	    if (FORCED) for (KEY in methods) {
  	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
  	        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
  	      }
  	    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  	  }

  	  // define iterator
  	  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
  	    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  	  }
  	  Iterators[NAME] = defaultIterator;

  	  return methods;
  	};
  	return iteratorDefine;
  }

  var createIterResultObject;
  var hasRequiredCreateIterResultObject;

  function requireCreateIterResultObject () {
  	if (hasRequiredCreateIterResultObject) return createIterResultObject;
  	hasRequiredCreateIterResultObject = 1;
  	// `CreateIterResultObject` abstract operation
  	// https://tc39.es/ecma262/#sec-createiterresultobject
  	createIterResultObject = function (value, done) {
  	  return { value: value, done: done };
  	};
  	return createIterResultObject;
  }

  var es_array_iterator;
  var hasRequiredEs_array_iterator;

  function requireEs_array_iterator () {
  	if (hasRequiredEs_array_iterator) return es_array_iterator;
  	hasRequiredEs_array_iterator = 1;
  	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject();
  	var addToUnscopables = /*@__PURE__*/ requireAddToUnscopables();
  	var Iterators = /*@__PURE__*/ requireIterators();
  	var InternalStateModule = /*@__PURE__*/ requireInternalState();
  	var defineProperty = /*@__PURE__*/ requireObjectDefineProperty().f;
  	var defineIterator = /*@__PURE__*/ requireIteratorDefine();
  	var createIterResultObject = /*@__PURE__*/ requireCreateIterResultObject();
  	var IS_PURE = /*@__PURE__*/ requireIsPure();
  	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors();

  	var ARRAY_ITERATOR = 'Array Iterator';
  	var setInternalState = InternalStateModule.set;
  	var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

  	// `Array.prototype.entries` method
  	// https://tc39.es/ecma262/#sec-array.prototype.entries
  	// `Array.prototype.keys` method
  	// https://tc39.es/ecma262/#sec-array.prototype.keys
  	// `Array.prototype.values` method
  	// https://tc39.es/ecma262/#sec-array.prototype.values
  	// `Array.prototype[@@iterator]` method
  	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
  	// `CreateArrayIterator` internal method
  	// https://tc39.es/ecma262/#sec-createarrayiterator
  	es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  	  setInternalState(this, {
  	    type: ARRAY_ITERATOR,
  	    target: toIndexedObject(iterated), // target
  	    index: 0,                          // next index
  	    kind: kind                         // kind
  	  });
  	// `%ArrayIteratorPrototype%.next` method
  	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
  	}, function () {
  	  var state = getInternalState(this);
  	  var target = state.target;
  	  var index = state.index++;
  	  if (!target || index >= target.length) {
  	    state.target = null;
  	    return createIterResultObject(undefined, true);
  	  }
  	  switch (state.kind) {
  	    case 'keys': return createIterResultObject(index, false);
  	    case 'values': return createIterResultObject(target[index], false);
  	  } return createIterResultObject([index, target[index]], false);
  	}, 'values');

  	// argumentsList[@@iterator] is %ArrayProto_values%
  	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
  	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
  	var values = Iterators.Arguments = Iterators.Array;

  	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  	addToUnscopables('keys');
  	addToUnscopables('values');
  	addToUnscopables('entries');

  	// V8 ~ Chrome 45- bug
  	if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  	  defineProperty(values, 'name', { value: 'values' });
  	} catch (error) { /* empty */ }
  	return es_array_iterator;
  }

  var es_string_iterator = {};

  var stringMultibyte;
  var hasRequiredStringMultibyte;

  function requireStringMultibyte () {
  	if (hasRequiredStringMultibyte) return stringMultibyte;
  	hasRequiredStringMultibyte = 1;
  	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis();
  	var toIntegerOrInfinity = /*@__PURE__*/ requireToIntegerOrInfinity();
  	var toString = /*@__PURE__*/ requireToString();
  	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible();

  	var charAt = uncurryThis(''.charAt);
  	var charCodeAt = uncurryThis(''.charCodeAt);
  	var stringSlice = uncurryThis(''.slice);

  	var createMethod = function (CONVERT_TO_STRING) {
  	  return function ($this, pos) {
  	    var S = toString(requireObjectCoercible($this));
  	    var position = toIntegerOrInfinity(pos);
  	    var size = S.length;
  	    var first, second;
  	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
  	    first = charCodeAt(S, position);
  	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
  	      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
  	        ? CONVERT_TO_STRING
  	          ? charAt(S, position)
  	          : first
  	        : CONVERT_TO_STRING
  	          ? stringSlice(S, position, position + 2)
  	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  	  };
  	};

  	stringMultibyte = {
  	  // `String.prototype.codePointAt` method
  	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  	  codeAt: createMethod(false),
  	  // `String.prototype.at` method
  	  // https://github.com/mathiasbynens/String.prototype.at
  	  charAt: createMethod(true)
  	};
  	return stringMultibyte;
  }

  var hasRequiredEs_string_iterator;

  function requireEs_string_iterator () {
  	if (hasRequiredEs_string_iterator) return es_string_iterator;
  	hasRequiredEs_string_iterator = 1;
  	var charAt = /*@__PURE__*/ requireStringMultibyte().charAt;
  	var toString = /*@__PURE__*/ requireToString();
  	var InternalStateModule = /*@__PURE__*/ requireInternalState();
  	var defineIterator = /*@__PURE__*/ requireIteratorDefine();
  	var createIterResultObject = /*@__PURE__*/ requireCreateIterResultObject();

  	var STRING_ITERATOR = 'String Iterator';
  	var setInternalState = InternalStateModule.set;
  	var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

  	// `String.prototype[@@iterator]` method
  	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  	defineIterator(String, 'String', function (iterated) {
  	  setInternalState(this, {
  	    type: STRING_ITERATOR,
  	    string: toString(iterated),
  	    index: 0
  	  });
  	// `%StringIteratorPrototype%.next` method
  	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
  	}, function next() {
  	  var state = getInternalState(this);
  	  var string = state.string;
  	  var index = state.index;
  	  var point;
  	  if (index >= string.length) return createIterResultObject(undefined, true);
  	  point = charAt(string, index);
  	  state.index += point.length;
  	  return createIterResultObject(point, false);
  	});
  	return es_string_iterator;
  }

  var aggregateError$5;
  var hasRequiredAggregateError$5;

  function requireAggregateError$5 () {
  	if (hasRequiredAggregateError$5) return aggregateError$5;
  	hasRequiredAggregateError$5 = 1;
  	requireEs_error_cause();
  	requireEs_aggregateError();
  	requireEs_aggregateError_cause();
  	requireEs_array_iterator();
  	requireEs_string_iterator();
  	var path = /*@__PURE__*/ requirePath();

  	aggregateError$5 = path.AggregateError;
  	return aggregateError$5;
  }

  var web_domCollections_iterator = {};

  var domIterables;
  var hasRequiredDomIterables;

  function requireDomIterables () {
  	if (hasRequiredDomIterables) return domIterables;
  	hasRequiredDomIterables = 1;
  	// iterable DOM collections
  	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  	domIterables = {
  	  CSSRuleList: 0,
  	  CSSStyleDeclaration: 0,
  	  CSSValueList: 0,
  	  ClientRectList: 0,
  	  DOMRectList: 0,
  	  DOMStringList: 0,
  	  DOMTokenList: 1,
  	  DataTransferItemList: 0,
  	  FileList: 0,
  	  HTMLAllCollection: 0,
  	  HTMLCollection: 0,
  	  HTMLFormElement: 0,
  	  HTMLSelectElement: 0,
  	  MediaList: 0,
  	  MimeTypeArray: 0,
  	  NamedNodeMap: 0,
  	  NodeList: 1,
  	  PaintRequestList: 0,
  	  Plugin: 0,
  	  PluginArray: 0,
  	  SVGLengthList: 0,
  	  SVGNumberList: 0,
  	  SVGPathSegList: 0,
  	  SVGPointList: 0,
  	  SVGStringList: 0,
  	  SVGTransformList: 0,
  	  SourceBufferList: 0,
  	  StyleSheetList: 0,
  	  TextTrackCueList: 0,
  	  TextTrackList: 0,
  	  TouchList: 0
  	};
  	return domIterables;
  }

  var hasRequiredWeb_domCollections_iterator;

  function requireWeb_domCollections_iterator () {
  	if (hasRequiredWeb_domCollections_iterator) return web_domCollections_iterator;
  	hasRequiredWeb_domCollections_iterator = 1;
  	requireEs_array_iterator();
  	var DOMIterables = /*@__PURE__*/ requireDomIterables();
  	var globalThis = /*@__PURE__*/ requireGlobalThis();
  	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
  	var Iterators = /*@__PURE__*/ requireIterators();

  	for (var COLLECTION_NAME in DOMIterables) {
  	  setToStringTag(globalThis[COLLECTION_NAME], COLLECTION_NAME);
  	  Iterators[COLLECTION_NAME] = Iterators.Array;
  	}
  	return web_domCollections_iterator;
  }

  var aggregateError$4;
  var hasRequiredAggregateError$4;

  function requireAggregateError$4 () {
  	if (hasRequiredAggregateError$4) return aggregateError$4;
  	hasRequiredAggregateError$4 = 1;
  	// TODO: remove from `core-js@4`
  	requireEsnext_aggregateError();

  	var parent = /*@__PURE__*/ requireAggregateError$5();
  	requireWeb_domCollections_iterator();

  	aggregateError$4 = parent;
  	return aggregateError$4;
  }

  var aggregateError$3;
  var hasRequiredAggregateError$3;

  function requireAggregateError$3 () {
  	if (hasRequiredAggregateError$3) return aggregateError$3;
  	hasRequiredAggregateError$3 = 1;
  	var parent = /*@__PURE__*/ requireAggregateError$4();

  	aggregateError$3 = parent;
  	return aggregateError$3;
  }

  var aggregateError$2;
  var hasRequiredAggregateError$2;

  function requireAggregateError$2 () {
  	if (hasRequiredAggregateError$2) return aggregateError$2;
  	hasRequiredAggregateError$2 = 1;
  	// TODO: remove from `core-js@4`
  	requireEsnext_aggregateError();

  	var parent = /*@__PURE__*/ requireAggregateError$3();

  	aggregateError$2 = parent;
  	return aggregateError$2;
  }

  var aggregateError$1;
  var hasRequiredAggregateError$1;

  function requireAggregateError$1 () {
  	if (hasRequiredAggregateError$1) return aggregateError$1;
  	hasRequiredAggregateError$1 = 1;
  	aggregateError$1 = /*@__PURE__*/ requireAggregateError$2();
  	return aggregateError$1;
  }

  var aggregateError;
  var hasRequiredAggregateError;

  function requireAggregateError () {
  	if (hasRequiredAggregateError) return aggregateError;
  	hasRequiredAggregateError = 1;
  	aggregateError = /*@__PURE__*/ requireAggregateError$1();
  	return aggregateError;
  }

  var aggregateErrorExports = requireAggregateError();
  const _AggregateError = /*@__PURE__*/getDefaultExportFromCjs(aggregateErrorExports);

  /**
   * @public
   */
  class ApiDOMAggregateError extends _AggregateError {
    constructor(errors, message, options) {
      super(errors, message, options);
      this.name = this.constructor.name;
      if (typeof message === 'string') {
        this.message = message;
      }
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error(message).stack;
      }

      /**
       * This needs to stay here until our minimum supported version of Node.js is >= 16.9.0.
       * Node.js >= 16.9.0 supports error causes natively.
       */
      if (options != null && typeof options === 'object' && Object.hasOwn(options, 'cause') && !('cause' in this)) {
        const {
          cause
        } = options;
        this.cause = cause;
        if (cause instanceof Error && 'stack' in cause) {
          this.stack = `${this.stack}\nCAUSE: ${cause.stack}`;
        }
      }
    }
  }

  /**
   * @public
   */
  class ApiDOMError extends Error {
    static [Symbol.hasInstance](instance) {
      // we want to ApiDOMAggregateError to act as if ApiDOMError was its superclass
      return super[Symbol.hasInstance](instance) || Function.prototype[Symbol.hasInstance].call(ApiDOMAggregateError, instance);
    }
    constructor(message, options) {
      super(message, options);
      this.name = this.constructor.name;
      if (typeof message === 'string') {
        this.message = message;
      }
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error(message).stack;
      }

      /**
       * This needs to stay here until our minimum supported version of Node.js is >= 16.9.0.
       * Node.js is >= 16.9.0 supports error causes natively.
       */
      if (options != null && typeof options === 'object' && Object.hasOwn(options, 'cause') && !('cause' in this)) {
        const {
          cause
        } = options;
        this.cause = cause;
        if (cause instanceof Error && 'stack' in cause) {
          this.stack = `${this.stack}\nCAUSE: ${cause.stack}`;
        }
      }
    }
  }

  /**
   * @public
   */
  class ApiDOMStructuredError extends ApiDOMError {
    constructor(message, structuredOptions) {
      super(message, structuredOptions);
      if (structuredOptions != null && typeof structuredOptions === 'object') {
        const {
          cause,
          ...causelessOptions
        } = structuredOptions;
        Object.assign(this, causelessOptions);
      }
    }
  }

  class YamlError extends ApiDOMStructuredError {
  }

  class YamlSchemaError extends YamlError {
  }

  var __defProp$e = Object.defineProperty;
  var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$d = (obj, key, value) => __defNormalProp$e(obj, typeof key !== "symbol" ? key + "" : key, value);
  class YamlTagError extends YamlSchemaError {
    constructor(message, structuredOptions) {
      super(message, structuredOptions);
      __publicField$d(this, "specificTagName");
      __publicField$d(this, "explicitTagName");
      __publicField$d(this, "tagKind");
      __publicField$d(this, "tagStartPositionRow");
      __publicField$d(this, "tagStartPositionColumn");
      __publicField$d(this, "tagStartPositionIndex");
      __publicField$d(this, "tagEndPositionRow");
      __publicField$d(this, "tagEndPositionColumn");
      __publicField$d(this, "tagEndPositionIndex");
      __publicField$d(this, "nodeCanonicalContent");
      __publicField$d(this, "node");
      if (typeof structuredOptions !== "undefined") {
        this.specificTagName = structuredOptions.specificTagName;
        this.explicitTagName = structuredOptions.explicitTagName;
        this.tagKind = structuredOptions.tagKind;
        this.tagStartPositionRow = structuredOptions.tagStartPositionRow;
        this.tagStartPositionColumn = structuredOptions.tagStartPositionColumn;
        this.tagStartPositionIndex = structuredOptions.tagStartPositionIndex;
        this.tagEndPositionRow = structuredOptions.tagEndPositionRow;
        this.tagEndPositionColumn = structuredOptions.tagEndPositionColumn;
        this.tagEndPositionIndex = structuredOptions.tagEndPositionIndex;
        this.nodeCanonicalContent = structuredOptions.nodeCanonicalContent;
        this.node = structuredOptions.node;
      }
    }
  }

  var __defProp$d = Object.defineProperty;
  var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$c = (obj, key, value) => __defNormalProp$d(obj, typeof key !== "symbol" ? key + "" : key, value);
  class Tag {
    constructor() {
      __publicField$c(this, "tag", "");
      this.tag = this.constructor.uri;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(node) {
      return true;
    }
    resolve(node) {
      return node;
    }
  }
  __publicField$c(Tag, "uri", "");

  var __defProp$c = Object.defineProperty;
  var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$b = (obj, key, value) => __defNormalProp$c(obj, key + "" , value);
  class GenericMapping extends Tag {
    test(node) {
      return node.tag.kind === YamlNodeKind.Mapping;
    }
  }
  __publicField$b(GenericMapping, "uri", "tag:yaml.org,2002:map");

  var __defProp$b = Object.defineProperty;
  var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$a = (obj, key, value) => __defNormalProp$b(obj, key + "" , value);
  class GenericSequence extends Tag {
    test(node) {
      return node.tag.kind === YamlNodeKind.Sequence;
    }
  }
  __publicField$a(GenericSequence, "uri", "tag:yaml.org,2002:seq");

  var __defProp$a = Object.defineProperty;
  var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$9 = (obj, key, value) => __defNormalProp$a(obj, key + "" , value);
  class GenericString extends Tag {
  }
  __publicField$9(GenericString, "uri", "tag:yaml.org,2002:str");

  /**
   * A function that returns `undefined`.
   *
   * @func stubUndefined
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/1.0.0|v1.0.0}
   * @category Function
   * @sig ... -> undefined
   * @return {undefined}
   * @example
   *
   * RA.stubUndefined(); //=> undefined
   * RA.stubUndefined(1, 2, 3); //=> undefined
   */
  var stubUndefined = always(void 0); // eslint-disable-line no-void

  /**
   * Checks if input value is `undefined`.
   *
   * @func isUndefined
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/0.0.1|v0.0.1}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isNotUndefined|isNotUndefined}
   * @example
   *
   * RA.isUndefined(1); //=> false
   * RA.isUndefined(undefined); //=> true
   * RA.isUndefined(null); //=> false
   */
  var isUndefined = equals(stubUndefined());

  /**
   * Checks if input value is `Generator Function`.
   *
   * @func isGeneratorFunction
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isFunction|isFunction}, {@link RA.isAsyncFunction|isAsyncFunction}, {@link RA.isNotGeneratorFunction|isNotGeneratorFunction}
   * @example
   *
   * RA.isGeneratorFunction(function* test() { }); //=> true
   * RA.isGeneratorFunction(null); //=> false
   * RA.isGeneratorFunction(function test() { }); //=> false
   * RA.isGeneratorFunction(() => {}); //=> false
   */
  var isGeneratorFunction = curryN(1, pipe(type, identical('GeneratorFunction')));

  /**
   * Checks if input value is `Async Function`.
   *
   * @func isAsyncFunction
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isFunction|isFunction}, {@link RA.isNotAsyncFunction|isNotAsyncFunction}, {@link RA.isGeneratorFunction|isGeneratorFunction}
   * @example
   *
   * RA.isAsyncFunction(async function test() { }); //=> true
   * RA.isAsyncFunction(null); //=> false
   * RA.isAsyncFunction(function test() { }); //=> false
   * RA.isAsyncFunction(() => {}); //=> false
   */
  var isAsyncFunction = curryN(1, pipe(type, identical('AsyncFunction')));

  /**
   * Checks if input value is `Function`.
   *
   * @func isFunction
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isNotFunction|isNotFunction}, {@link RA.isAsyncFunction|isNotAsyncFunction}, {@link RA.isGeneratorFunction|isGeneratorFunction}
   * @example
   *
   * RA.isFunction(function test() { }); //=> true
   * RA.isFunction(function* test() { }); //=> true
   * RA.isFunction(async function test() { }); //=> true
   * RA.isFunction(() => {}); //=> true
   * RA.isFunction(null); //=> false
   * RA.isFunction('abc'); //=> false
   */
  var isFunction = anyPass([pipe(type, identical('Function')), isGeneratorFunction, isAsyncFunction]);

  /**
   * Checks if input value is an empty `String`.
   *
   * @func isEmptyString
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/2.4.0|v2.4.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isNotEmptyString|isNotEmptyString}
   * @example
   *
   * RA.isEmptyString(''); // => true
   * RA.isEmptyString('42'); // => false
   * RA.isEmptyString(new String('42')); // => false
   * RA.isEmptyString(new String('')); // => false
   * RA.isEmptyString([42]); // => false
   * RA.isEmptyString({}); // => false
   * RA.isEmptyString(null); // => false
   * RA.isEmptyString(undefined); // => false
   * RA.isEmptyString(42); // => false
   */
  var isEmptyString = equals('');

  /**
   * Checks if value is a `Number` primitive or object.
   *
   * @func isNumber
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/0.6.0|v0.6.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isNotNumber|isNotNumber}
   * @example
   *
   * RA.isNumber(5); // => true
   * RA.isNumber(Number.MAX_VALUE); // => true
   * RA.isNumber(-Infinity); // => true
   * RA.isNumber(NaN); // => true
   * RA.isNumber('5'); // => false
   */
  var isNumber = curryN(1, pipe(type, identical('Number')));

  /**
   * Checks if value is a negative `Number` primitive or object. Zero is not considered neither
   * positive or negative.
   *
   * @func isNegative
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/1.15.0|v1.15.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isPositive|isPositive}
   * @example
   *
   * RA.isNegative(-1); // => true
   * RA.isNegative(Number.MIN_VALUE); // => false
   * RA.isNegative(+Infinity); // => false
   * RA.isNegative(NaN); // => false
   * RA.isNegative('5'); // => false
   */
  var isNegative = curryN(1, both(isNumber, gt(0)));

  // eslint-disable-next-line no-restricted-globals
  var isFinitePonyfill$1 = both(isNumber, isFinite);

  var isFinitePonyfill = curryN(1, isFinitePonyfill$1);

  /**
   * Checks whether the passed value is a finite `Number`.
   *
   * @func isFinite
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/0.7.0|v0.7.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isNotFinite|isNotFinite}
   * @example
   *
   * RA.isFinite(Infinity); //=> false
   * RA.isFinite(NaN); //=> false
   * RA.isFinite(-Infinity); //=> false
   *
   * RA.isFinite(0); // true
   * RA.isFinite(2e64); // true
   *
   * RA.isFinite('0');  // => false
   *                    // would've been true with global isFinite('0')
   * RA.isFinite(null); // => false
   *                    // would've been true with global isFinite(null)
   */
  var _isFinite = isFunction(Number.isFinite) ? curryN(1, bind(Number.isFinite, Number)) : isFinitePonyfill;

  /**
   * Checks whether the passed value is complement of finite `Number`.
   *
   *
   * @func isNotFinite
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/0.7.0|v0.7.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isFinite|isFinite}
   * @example
   *
   * RA.isNotFinite(Infinity); //=> true
   * RA.isNotFinite(NaN); //=> true
   * RA.isNotFinite(-Infinity); //=> true
   *
   * RA.isNotFinite(0); // false
   * RA.isNotFinite(2e64); // false
   *
   * RA.isNotFinite('0');  // => true
   * RA.isNotFinite(null); // => true
   */
  var isNotFinite = complement(_isFinite);

  var isIntegerPonyfill$1 = both(_isFinite, converge(equals, [Math.floor, identity]));

  var isIntegerPonyfill = curryN(1, isIntegerPonyfill$1);

  /**
   * Checks whether the passed value is an `integer`.
   *
   * @func isInteger
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/0.7.0|v0.7.0}
   * @category Type
   * @sig * -> Boolean
   * @param {*} val The value to test
   * @return {boolean}
   * @see {@link RA.isNotInteger|isNotInteger}
   * @example
   *
   * RA.isInteger(0); //=> true
   * RA.isInteger(1); //=> true
   * RA.isInteger(-100000); //=> true
   *
   * RA.isInteger(0.1);       //=> false
   * RA.isInteger(Math.PI);   //=> false
   *
   * RA.isInteger(NaN);       //=> false
   * RA.isInteger(Infinity);  //=> false
   * RA.isInteger(-Infinity); //=> false
   * RA.isInteger('10');      //=> false
   * RA.isInteger(true);      //=> false
   * RA.isInteger(false);     //=> false
   * RA.isInteger([1]);       //=> false
   */
  var isInteger = isFunction(Number.isInteger) ? curryN(1, bind(Number.isInteger, Number)) : isIntegerPonyfill;

  /**
   * Returns the result of concatenating the given lists or strings.
   *
   * Note: R.concat expects both arguments to be of the same type, unlike
   * the native Array.prototype.concat method.
   * It will throw an error if you concat an Array with a non-Array value.
   * Dispatches to the concat method of the second argument, if present.
   *
   * @func concatRight
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/1.11.0|v1.11.0}
   * @category List
   * @sig [a] -> [a] -> [a]
   * @sig String -> String -> String
   * @param {Array|String} firstList The first list
   * @param {Array|String} secondList The second list
   * @return {Array|String} A list consisting of the elements of `secondList`
   * followed by the elements of `firstList`.
   * @see {@link http://ramdajs.com/docs/#concat|R.concat}
   * @example
   *
   * RA.concatRight('ABC', 'DEF'); //=> 'DEFABC'
   * RA.concatRight([4, 5, 6], [1, 2, 3]); //=> [1, 2, 3, 4, 5, 6]
   * RA.concatRight([], []); //=> []
   */
  var concatRight = flip(concat);

  /**
   * Returns true if the specified value is equal, in R.equals terms,
   * to at least one element of the given list or false otherwise.
   * Given list can be a string.
   *
   * Like {@link http://ramdajs.com/docs/#includes|R.includes} but with argument order reversed.
   *
   * @func included
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/3.0.0|v3.0.0}
   * @category List
   * @sig [a] -> a -> Boolean
   * @param {Array|String} list The list to consider
   * @param {*} a The item to compare against
   * @return {boolean} Returns Boolean `true` if an equivalent item is in the list or `false` otherwise
   * @see {@link http://ramdajs.com/docs/#includes|R.includes}
   * @example
   *
   * RA.included([1, 2, 3], 3); //=> true
   * RA.included([1, 2, 3], 4); //=> false
   * RA.included([{ name: 'Fred' }], { name: 'Fred' }); //=> true
   * RA.included([[42]], [42]); //=> true
   */
  var included = flip(includes);

  var repeat = function repeat(value, count) {
    var validCount = Number(count);
    if (validCount !== count) {
      validCount = 0;
    }
    if (isNegative(validCount)) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (isNotFinite(validCount)) {
      throw new RangeError('repeat count must be less than infinity');
    }
    validCount = Math.floor(validCount);
    if (value.length === 0 || validCount === 0) {
      return '';
    }

    // Ensuring validCount is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    // eslint-disable-next-line no-bitwise
    if (value.length * validCount >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var maxCount = value.length * validCount;
    validCount = Math.floor(Math.log(validCount) / Math.log(2));
    var result = value;
    while (validCount) {
      result += value;
      validCount -= 1;
    }
    result += result.substring(0, maxCount - result.length);
    return result;
  };

  var repeatStrPonyfill = curry(repeat);
  var repeatStrInvoker = flip(invoker(1, 'repeat'));

  /**
   * Constructs and returns a new string which contains the specified
   * number of copies of the string on which it was called, concatenated together.
   *
   * @func repeatStr
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/2.11.0|v2.11.0}
   * @category List
   * @sig String -> Number -> String
   * @param {string} value String value to be repeated
   * @param {number} count An integer between 0 and +∞: [0, +∞), indicating the number of times to repeat the string in the newly-created string that is to be returned
   * @return {string} A new string containing the specified number of copies of the given string
   * @example
   *
   * RA.repeatStr('a', 3); //=> 'aaa'
   */
  var repeatStr = isFunction(String.prototype.repeat) ? repeatStrInvoker : repeatStrPonyfill;

  var trimStart$2 = replace(/^[\s\uFEFF\xA0]+/, '');

  var trimStartPonyfill = trimStart$2;
  var trimStartInvoker = invoker(0, 'trimStart');

  /**
   * Removes whitespace from the beginning of a string.
   *
   * @func trimStart
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/2.22.0|v2.22.0}
   * @category String
   * @sig String -> String
   * @param {string} value String value to have the whitespace removed from the beginning
   * @return {string} A new string representing the calling string stripped of whitespace from its beginning (left end).
   * @example
   *
   * RA.trimStart('  abc'); //=> 'abc'
   */

  var trimStart$1 = isFunction(String.prototype.trimStart) ? trimStartInvoker : trimStartPonyfill;

  var trimStart = replace(/[\s\uFEFF\xA0]+$/, '');

  var trimEndPonyfill = trimStart;
  var trimEndInvoker = invoker(0, 'trimEnd');

  /**
   * Removes whitespace from the end of a string.
   *
   * @func trimEnd
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/2.22.0|v2.22.0}
   * @category String
   * @sig String -> String
   * @param {string} value String value to have the whitespace removed from the end
   * @return {string} A new string representing the calling string stripped of whitespace from its end (right end).
   * @see {@link RA.trimEnd|trimEnd}
   * @example
   *
   * RA.trimEnd('abc   '); //=> 'abc'
   */

  var trimEnd = isFunction(String.prototype.trimEnd) ? trimEndInvoker : trimEndPonyfill;

  /**
   * Removes specified characters from the beginning of a string.
   *
   * @func trimCharsStart
   * @memberOf RA
   * @since {@link https://char0n.github.io/ramda-adjunct/2.24.0|v2.24.0}
   * @category String
   * @sig String -> String
   * @param {string} chars The characters to trim
   * @param {string} value The string to trim
   * @return {string} Returns the trimmed string.
   * @example
   *
   * RA.trimCharsStart('_-', '-_-abc-_-'); //=> 'abc-_-'
   */

  var trimCharsStart = curry(function (chars, value) {
    return pipe(split(''), dropWhile(included(chars)), join(''))(value);
  });

  var dist = {};

  var errors = {};

  var hasRequiredErrors;

  function requireErrors () {
  	if (hasRequiredErrors) return errors;
  	hasRequiredErrors = 1;
  	(function (exports$1) {
  		// NOTE: don't construct errors here or they'll have the wrong stack trace.
  		// NOTE: don't make custom error class; the JS engines use `SyntaxError`
  		Object.defineProperty(exports$1, "__esModule", { value: true });
  		exports$1.errorMessages = exports$1.ErrorType = void 0;
  		/**
  		 * Keys for possible error messages used by `unraw`.
  		 * Note: These do _not_ map to actual error object types. All errors thrown
  		 * are `SyntaxError`.
  		 */
  		// Don't use const enum or JS users won't be able to access the enum values
  		var ErrorType;
  		(function (ErrorType) {
  		    /**
  		     * Thrown when a badly formed Unicode escape sequence is found. Possible
  		     * reasons include the code being too short (`"\u25"`) or having invalid
  		     * characters (`"\u2$A5"`).
  		     */
  		    ErrorType["MalformedUnicode"] = "MALFORMED_UNICODE";
  		    /**
  		     * Thrown when a badly formed hexadecimal escape sequence is found. Possible
  		     * reasons include the code being too short (`"\x2"`) or having invalid
  		     * characters (`"\x2$"`).
  		     */
  		    ErrorType["MalformedHexadecimal"] = "MALFORMED_HEXADECIMAL";
  		    /**
  		     * Thrown when a Unicode code point escape sequence has too high of a code
  		     * point. The maximum code point allowed is `\u{10FFFF}`, so `\u{110000}` and
  		     * higher will throw this error.
  		     */
  		    ErrorType["CodePointLimit"] = "CODE_POINT_LIMIT";
  		    /**
  		     * Thrown when an octal escape sequences is encountered and `allowOctals` is
  		     * `false`. For example, `unraw("\234", false)`.
  		     */
  		    ErrorType["OctalDeprecation"] = "OCTAL_DEPRECATION";
  		    /**
  		     * Thrown only when a single backslash is found at the end of a string. For
  		     * example, `"\\"` or `"test\\x24\\"`.
  		     */
  		    ErrorType["EndOfString"] = "END_OF_STRING";
  		})(ErrorType = exports$1.ErrorType || (exports$1.ErrorType = {}));
  		/** Map of error message names to the full text of the message. */
  		exports$1.errorMessages = new Map([
  		    [ErrorType.MalformedUnicode, "malformed Unicode character escape sequence"],
  		    [
  		        ErrorType.MalformedHexadecimal,
  		        "malformed hexadecimal character escape sequence"
  		    ],
  		    [
  		        ErrorType.CodePointLimit,
  		        "Unicode codepoint must not be greater than 0x10FFFF in escape sequence"
  		    ],
  		    [
  		        ErrorType.OctalDeprecation,
  		        '"0"-prefixed octal literals and octal escape sequences are deprecated; ' +
  		            'for octal literals use the "0o" prefix instead'
  		    ],
  		    [ErrorType.EndOfString, "malformed escape sequence at end of string"]
  		]); 
  	} (errors));
  	return errors;
  }

  var hasRequiredDist;

  function requireDist () {
  	if (hasRequiredDist) return dist;
  	hasRequiredDist = 1;
  	(function (exports$1) {
  		Object.defineProperty(exports$1, "__esModule", { value: true });
  		exports$1.unraw = exports$1.errorMessages = exports$1.ErrorType = void 0;
  		const errors_1 = requireErrors();
  		Object.defineProperty(exports$1, "ErrorType", { enumerable: true, get: function () { return errors_1.ErrorType; } });
  		Object.defineProperty(exports$1, "errorMessages", { enumerable: true, get: function () { return errors_1.errorMessages; } });
  		/**
  		 * Parse a string as a base-16 number. This is more strict than `parseInt` as it
  		 * will not allow any other characters, including (for example) "+", "-", and
  		 * ".".
  		 * @param hex A string containing a hexadecimal number.
  		 * @returns The parsed integer, or `NaN` if the string is not a valid hex
  		 * number.
  		 */
  		function parseHexToInt(hex) {
  		    const isOnlyHexChars = !hex.match(/[^a-f0-9]/i);
  		    return isOnlyHexChars ? parseInt(hex, 16) : NaN;
  		}
  		/**
  		 * Check the validity and length of a hexadecimal code and optionally enforces
  		 * a specific number of hex digits.
  		 * @param hex The string to validate and parse.
  		 * @param errorName The name of the error message to throw a `SyntaxError` with
  		 * if `hex` is invalid. This is used to index `errorMessages`.
  		 * @param enforcedLength If provided, will throw an error if `hex` is not
  		 * exactly this many characters.
  		 * @returns The parsed hex number as a normal number.
  		 * @throws {SyntaxError} If the code is not valid.
  		 */
  		function validateAndParseHex(hex, errorName, enforcedLength) {
  		    const parsedHex = parseHexToInt(hex);
  		    if (Number.isNaN(parsedHex) ||
  		        (enforcedLength !== undefined && enforcedLength !== hex.length)) {
  		        throw new SyntaxError(errors_1.errorMessages.get(errorName));
  		    }
  		    return parsedHex;
  		}
  		/**
  		 * Parse a two-digit hexadecimal character escape code.
  		 * @param code The two-digit hexadecimal number that represents the character to
  		 * output.
  		 * @returns The single character represented by the code.
  		 * @throws {SyntaxError} If the code is not valid hex or is not the right
  		 * length.
  		 */
  		function parseHexadecimalCode(code) {
  		    const parsedCode = validateAndParseHex(code, errors_1.ErrorType.MalformedHexadecimal, 2);
  		    return String.fromCharCode(parsedCode);
  		}
  		/**
  		 * Parse a four-digit Unicode character escape code.
  		 * @param code The four-digit unicode number that represents the character to
  		 * output.
  		 * @param surrogateCode Optional four-digit unicode surrogate that represents
  		 * the other half of the character to output.
  		 * @returns The single character represented by the code.
  		 * @throws {SyntaxError} If the codes are not valid hex or are not the right
  		 * length.
  		 */
  		function parseUnicodeCode(code, surrogateCode) {
  		    const parsedCode = validateAndParseHex(code, errors_1.ErrorType.MalformedUnicode, 4);
  		    if (surrogateCode !== undefined) {
  		        const parsedSurrogateCode = validateAndParseHex(surrogateCode, errors_1.ErrorType.MalformedUnicode, 4);
  		        return String.fromCharCode(parsedCode, parsedSurrogateCode);
  		    }
  		    return String.fromCharCode(parsedCode);
  		}
  		/**
  		 * Test if the text is surrounded by curly braces (`{}`).
  		 * @param text Text to check.
  		 * @returns `true` if the text is in the form `{*}`.
  		 */
  		function isCurlyBraced(text) {
  		    return text.charAt(0) === "{" && text.charAt(text.length - 1) === "}";
  		}
  		/**
  		 * Parse a Unicode code point character escape code.
  		 * @param codePoint A unicode escape code point, including the surrounding curly
  		 * braces.
  		 * @returns The single character represented by the code.
  		 * @throws {SyntaxError} If the code is not valid hex or does not have the
  		 * surrounding curly braces.
  		 */
  		function parseUnicodeCodePointCode(codePoint) {
  		    if (!isCurlyBraced(codePoint)) {
  		        throw new SyntaxError(errors_1.errorMessages.get(errors_1.ErrorType.MalformedUnicode));
  		    }
  		    const withoutBraces = codePoint.slice(1, -1);
  		    const parsedCode = validateAndParseHex(withoutBraces, errors_1.ErrorType.MalformedUnicode);
  		    try {
  		        return String.fromCodePoint(parsedCode);
  		    }
  		    catch (err) {
  		        throw err instanceof RangeError
  		            ? new SyntaxError(errors_1.errorMessages.get(errors_1.ErrorType.CodePointLimit))
  		            : err;
  		    }
  		}
  		// Have to give overload that takes boolean for when compiler doesn't know if
  		// true or false
  		function parseOctalCode(code, error = false) {
  		    if (error) {
  		        throw new SyntaxError(errors_1.errorMessages.get(errors_1.ErrorType.OctalDeprecation));
  		    }
  		    // The original regex only allows digits so we don't need to have a strict
  		    // octal parser like hexToInt. Length is not enforced for octals.
  		    const parsedCode = parseInt(code, 8);
  		    return String.fromCharCode(parsedCode);
  		}
  		/**
  		 * Map of unescaped letters to their corresponding special JS escape characters.
  		 * Intentionally does not include characters that map to themselves like "\'".
  		 */
  		const singleCharacterEscapes = new Map([
  		    ["b", "\b"],
  		    ["f", "\f"],
  		    ["n", "\n"],
  		    ["r", "\r"],
  		    ["t", "\t"],
  		    ["v", "\v"],
  		    ["0", "\0"]
  		]);
  		/**
  		 * Parse a single character escape sequence and return the matching character.
  		 * If none is matched, defaults to `code`.
  		 * @param code A single character code.
  		 */
  		function parseSingleCharacterCode(code) {
  		    return singleCharacterEscapes.get(code) || code;
  		}
  		/**
  		 * Matches every escape sequence possible, including invalid ones.
  		 *
  		 * All capture groups (described below) are unique (only one will match), except
  		 * for 4, which can only potentially match if 3 does.
  		 *
  		 * **Capture Groups:**
  		 * 0. A single backslash
  		 * 1. Hexadecimal code
  		 * 2. Unicode code point code with surrounding curly braces
  		 * 3. Unicode escape code with surrogate
  		 * 4. Surrogate code
  		 * 5. Unicode escape code without surrogate
  		 * 6. Octal code _NOTE: includes "0"._
  		 * 7. A single character (will never be \, x, u, or 0-3)
  		 */
  		const escapeMatch = /\\(?:(\\)|x([\s\S]{0,2})|u(\{[^}]*\}?)|u([\s\S]{4})\\u([^{][\s\S]{0,3})|u([\s\S]{0,4})|([0-3]?[0-7]{1,2})|([\s\S])|$)/g;
  		/**
  		 * Replace raw escape character strings with their escape characters.
  		 * @param raw A string where escape characters are represented as raw string
  		 * values like `\'` rather than `'`.
  		 * @param allowOctals If `true`, will process the now-deprecated octal escape
  		 * sequences (ie, `\111`).
  		 * @returns The processed string, with escape characters replaced by their
  		 * respective actual Unicode characters.
  		 */
  		function unraw(raw, allowOctals = false) {
  		    return raw.replace(escapeMatch, function (_, backslash, hex, codePoint, unicodeWithSurrogate, surrogate, unicode, octal, singleCharacter) {
  		        // Compare groups to undefined because empty strings mean different errors
  		        // Otherwise, `\u` would fail the same as `\` which is wrong.
  		        if (backslash !== undefined) {
  		            return "\\";
  		        }
  		        if (hex !== undefined) {
  		            return parseHexadecimalCode(hex);
  		        }
  		        if (codePoint !== undefined) {
  		            return parseUnicodeCodePointCode(codePoint);
  		        }
  		        if (unicodeWithSurrogate !== undefined) {
  		            return parseUnicodeCode(unicodeWithSurrogate, surrogate);
  		        }
  		        if (unicode !== undefined) {
  		            return parseUnicodeCode(unicode);
  		        }
  		        if (octal === "0") {
  		            return "\0";
  		        }
  		        if (octal !== undefined) {
  		            return parseOctalCode(octal, !allowOctals);
  		        }
  		        if (singleCharacter !== undefined) {
  		            return parseSingleCharacterCode(singleCharacter);
  		        }
  		        throw new SyntaxError(errors_1.errorMessages.get(errors_1.ErrorType.EndOfString));
  		    });
  		}
  		exports$1.unraw = unraw;
  		exports$1.default = unraw; 
  	} (dist));
  	return dist;
  }

  var distExports = requireDist();

  const blockStyleRegExp = new RegExp("^(?<style>[|>])(?<chomping>[+-]?)(?<indentation>[0-9]*)\\s");
  const getIndentationIndicator = (content) => {
    const matches = content.match(blockStyleRegExp);
    const indicator = pathOr("", ["groups", "indentation"], matches);
    return isEmptyString(indicator) ? void 0 : parseInt(indicator, 10);
  };
  const getIndentation = (content) => {
    const explicitIndentationIndicator = getIndentationIndicator(content);
    if (isInteger(explicitIndentationIndicator)) {
      return repeatStr(" ", explicitIndentationIndicator);
    }
    const firstLine = pathOr("", [1], content.split("\n"));
    const implicitIndentationIndicator = pathOr(
      0,
      ["groups", "indentation", "length"],
      firstLine.match(new RegExp("^(?<indentation>[ ]*)"))
    );
    return repeatStr(" ", implicitIndentationIndicator);
  };
  const getChompingIndicator = (content) => {
    const matches = content.match(blockStyleRegExp);
    const indicator = pathOr("", ["groups", "chomping"], matches);
    return isEmptyString(indicator) ? void 0 : indicator;
  };
  const chomp = (indicator, content) => {
    if (isUndefined(indicator)) {
      return `${trimEnd(content)}
`;
    }
    if (indicator === "-") {
      return trimEnd(content);
    }
    if (indicator === "+") {
      return content;
    }
    return content;
  };
  const normalizeLineBreaks = (val) => val.replace(/\r\n/g, "\n");
  const preventLineBreakCollapseToSpace = (val) => val.replace(/\\\n\s*/g, "");
  const collapseLineBreakToSpace = (val) => {
    return val.replace(/(\n)?\n([^\n]+)/g, (match, p1, p2) => p1 ? match : ` ${p2.trimStart()}`).replace(/[\n]{2}/g, "\n");
  };
  const removeQuotes = curry(
    (quoteType, val) => val.replace(new RegExp(`^${quoteType}`), "").replace(new RegExp(`${quoteType}$`), "")
  );
  const formatFlowPlain = pipe(
    normalizeLineBreaks,
    trim,
    collapseLineBreakToSpace,
    split("\n"),
    map(trimStart$1),
    join("\n")
  );
  const formatFlowSingleQuoted = pipe(
    normalizeLineBreaks,
    trim,
    collapseLineBreakToSpace,
    split("\n"),
    map(trimStart$1),
    join("\n"),
    removeQuotes("'")
  );
  const formatFlowDoubleQuoted = pipe(
    normalizeLineBreaks,
    trim,
    preventLineBreakCollapseToSpace,
    collapseLineBreakToSpace,
    distExports.unraw,
    split("\n"),
    map(trimStart$1),
    join("\n"),
    removeQuotes('"')
  );
  const formatBlockLiteral = (content) => {
    const indentation = getIndentation(content);
    const chompingIndicator = getChompingIndicator(content);
    const normalized = normalizeLineBreaks(content);
    const lines = tail(normalized.split("\n"));
    const transducer = compose(map(trimCharsStart(indentation)), map(concatRight("\n")));
    const deindented = transduce(transducer, concat, "", lines);
    return chomp(chompingIndicator, deindented);
  };
  const formatBlockFolded = (content) => {
    const indentation = getIndentation(content);
    const chompingIndicator = getChompingIndicator(content);
    const normalized = normalizeLineBreaks(content);
    const lines = tail(normalized.split("\n"));
    const transducer = compose(map(trimCharsStart(indentation)), map(concatRight("\n")));
    const deindented = transduce(transducer, concat, "", lines);
    const collapsed = collapseLineBreakToSpace(deindented);
    return chomp(chompingIndicator, collapsed);
  };

  class ScalarTag {
    static test(node) {
      return node.tag.kind === YamlNodeKind.Scalar && typeof node.content === "string";
    }
    static canonicalFormat(node) {
      let canonicalForm = node.content;
      const nodeClone = node.clone();
      if (node.style === YamlStyle.Plain) {
        canonicalForm = formatFlowPlain(node.content);
      } else if (node.style === YamlStyle.SingleQuoted) {
        canonicalForm = formatFlowSingleQuoted(node.content);
      } else if (node.style === YamlStyle.DoubleQuoted) {
        canonicalForm = formatFlowDoubleQuoted(node.content);
      } else if (node.style === YamlStyle.Literal) {
        canonicalForm = formatBlockLiteral(node.content);
      } else if (node.style === YamlStyle.Folded) {
        canonicalForm = formatBlockFolded(node.content);
      }
      nodeClone.content = canonicalForm;
      return nodeClone;
    }
    static resolve(node) {
      return node;
    }
  }

  var __defProp$9 = Object.defineProperty;
  var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$8 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
  class FailsafeSchema {
    constructor() {
      __publicField$8(this, "tags");
      __publicField$8(this, "tagDirectives");
      this.tags = [];
      this.tagDirectives = [];
      this.registerTag(new GenericMapping());
      this.registerTag(new GenericSequence());
      this.registerTag(new GenericString());
    }
    // eslint-disable-next-line class-methods-use-this
    toSpecificTagName(node) {
      let specificTagName = node.tag.explicitName;
      if (node.tag.explicitName === "!") {
        if (node.tag.kind === YamlNodeKind.Scalar) {
          specificTagName = GenericString.uri;
        } else if (node.tag.kind === YamlNodeKind.Sequence) {
          specificTagName = GenericSequence.uri;
        } else if (node.tag.kind === YamlNodeKind.Mapping) {
          specificTagName = GenericMapping.uri;
        }
      } else if (node.tag.explicitName.startsWith("!<")) {
        specificTagName = node.tag.explicitName.replace(/^!</, "").replace(/>$/, "");
      } else if (node.tag.explicitName.startsWith("!!")) {
        specificTagName = `tag:yaml.org,2002:${node.tag.explicitName.replace(/^!!/, "")}`;
      }
      return specificTagName;
    }
    registerTagDirective(tagDirective) {
      this.tagDirectives.push({
        // @ts-ignore
        handle: tagDirective.parameters.handle,
        // @ts-ignore
        prefix: tagDirective.parameters.prefix
      });
    }
    registerTag(tag, beginning = false) {
      if (beginning) {
        this.tags.unshift(tag);
      } else {
        this.tags.push(tag);
      }
      return this;
    }
    overrideTag(tag) {
      this.tags = this.tags.filter((itag) => itag.tag === tag.tag);
      this.tags.push(tag);
      return this;
    }
    resolve(node) {
      const specificTagName = this.toSpecificTagName(node);
      if (specificTagName === "?") {
        return node;
      }
      let canonicalNode = node;
      if (ScalarTag.test(node)) {
        canonicalNode = ScalarTag.canonicalFormat(node);
      }
      const tag = this.tags.find((itag) => (itag == null ? void 0 : itag.tag) === specificTagName);
      if (typeof tag === "undefined") {
        throw new YamlTagError(`Tag "${specificTagName}" was not recognized.`, {
          specificTagName,
          explicitTagName: node.tag.explicitName,
          tagKind: node.tag.kind,
          tagStartPositionRow: node.tag.startPositionRow,
          tagStartPositionColumn: node.tag.startPositionColumn,
          tagStartPositionIndex: node.tag.startIndex,
          tagEndPositionRow: node.tag.endPositionRow,
          tagEndPositionColumn: node.tag.endPositionColumn,
          tagEndPositionIndex: node.tag.endIndex,
          node: node.clone()
        });
      }
      if (!tag.test(canonicalNode)) {
        throw new YamlTagError(`Node couldn't be resolved against the tag "${specificTagName}"`, {
          specificTagName,
          explicitTagName: node.tag.explicitName,
          tagKind: node.tag.kind,
          tagStartPositionRow: node.tag.startPositionRow,
          tagStartPositionColumn: node.tag.startPositionColumn,
          tagStartPositionIndex: node.tag.startIndex,
          tagEndPositionRow: node.tag.endPositionRow,
          tagEndPositionColumn: node.tag.endPositionColumn,
          tagEndPositionIndex: node.tag.endIndex,
          nodeCanonicalContent: canonicalNode.content,
          node: node.clone()
        });
      }
      return tag.resolve(canonicalNode);
    }
  }

  var __defProp$8 = Object.defineProperty;
  var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$7 = (obj, key, value) => __defNormalProp$8(obj, key + "" , value);
  class Boolean extends Tag {
    test(node) {
      return /^(true|false)$/.test(node.content);
    }
    resolve(node) {
      const content = node.content === "true";
      const nodeClone = node.clone();
      nodeClone.content = content;
      return nodeClone;
    }
  }
  __publicField$7(Boolean, "uri", "tag:yaml.org,2002:bool");

  var __defProp$7 = Object.defineProperty;
  var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$6 = (obj, key, value) => __defNormalProp$7(obj, key + "" , value);
  class FloatingPoint extends Tag {
    test(node) {
      return /^-?(0|[1-9][0-9]*)(\.[0-9]*)?([eE][-+]?[0-9]+)?$/.test(node.content);
    }
    resolve(node) {
      const content = parseFloat(node.content);
      const nodeClone = node.clone();
      nodeClone.content = content;
      return nodeClone;
    }
  }
  __publicField$6(FloatingPoint, "uri", "tag:yaml.org,2002:float");

  var __defProp$6 = Object.defineProperty;
  var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$5 = (obj, key, value) => __defNormalProp$6(obj, key + "" , value);
  class Integer extends Tag {
    test(node) {
      return /^-?(0|[1-9][0-9]*)$/.test(node.content);
    }
    resolve(node) {
      const content = parseInt(node.content, 10);
      const nodeClone = node.clone();
      nodeClone.content = content;
      return nodeClone;
    }
  }
  __publicField$5(Integer, "uri", "tag:yaml.org,2002:int");

  var __defProp$5 = Object.defineProperty;
  var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$4 = (obj, key, value) => __defNormalProp$5(obj, key + "" , value);
  class Null extends Tag {
    test(node) {
      return /^null$/.test(node.content);
    }
    resolve(node) {
      const nodeClone = node.clone();
      nodeClone.content = null;
      return nodeClone;
    }
  }
  __publicField$4(Null, "uri", "tag:yaml.org,2002:null");

  class JsonSchema extends FailsafeSchema {
    constructor() {
      super();
      this.registerTag(new Boolean(), true);
      this.registerTag(new FloatingPoint(), true);
      this.registerTag(new Integer(), true);
      this.registerTag(new Null(), true);
    }
    toSpecificTagName(node) {
      let specificTagName = super.toSpecificTagName(node);
      if (specificTagName === "?") {
        if (node.tag.vkind === YamlNodeKind.Sequence) {
          specificTagName = GenericSequence.uri;
        } else if (node.tag.kind === YamlNodeKind.Mapping) {
          specificTagName = GenericMapping.uri;
        } else if (node.tag.kind === YamlNodeKind.Scalar) {
          const foundTag = this.tags.find((tag) => tag.test(node));
          specificTagName = (foundTag == null ? void 0 : foundTag.tag) || "?";
        }
      }
      return specificTagName;
    }
  }

  class YamlReferenceError extends YamlError {
  }

  class ReferenceManager {
    addAnchor(node) {
      if (!isAnchor(node.anchor)) {
        throw new YamlReferenceError("Expected YAML anchor to be attached the the YAML AST node.", {
          node
        });
      }
    }
    resolveAlias(alias) {
      return new YamlScalar({
        content: alias.content,
        style: YamlStyle.Plain,
        styleGroup: YamlStyleGroup.Flow
      });
    }
  }

  var __defProp$4 = Object.defineProperty;
  var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
  var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
  var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$2 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$2.call(b, prop))
        __defNormalProp$4(a, prop, b[prop]);
    if (__getOwnPropSymbols$2)
      for (var prop of __getOwnPropSymbols$2(b)) {
        if (__propIsEnum$2.call(b, prop))
          __defNormalProp$4(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest$1 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$2)
      for (var prop of __getOwnPropSymbols$2(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$3 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
  class Literal extends Node {
    constructor(_a = {}) {
      var _b = _a, { value } = _b, rest = __objRest$1(_b, ["value"]);
      super(__spreadValues$2({}, rest));
      __publicField$3(this, "value");
      this.value = value;
    }
  }
  __publicField$3(Literal, "type", "literal");

  var __defProp$3 = Object.defineProperty;
  var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$2 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  const _Point = class _Point {
    constructor({ row, column, char }) {
      __publicField$2(this, "type", _Point.type);
      __publicField$2(this, "row");
      __publicField$2(this, "column");
      __publicField$2(this, "char");
      this.row = row;
      this.column = column;
      this.char = char;
    }
  };
  __publicField$2(_Point, "type", "point");
  let Point = _Point;
  const _Position = class _Position {
    constructor({ start, end }) {
      __publicField$2(this, "type", _Position.type);
      __publicField$2(this, "start");
      __publicField$2(this, "end");
      this.start = start;
      this.end = end;
    }
  };
  __publicField$2(_Position, "type", "position");
  let Position = _Position;

  var __defProp$2 = Object.defineProperty;
  var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
  var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
  var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$1 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$1.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    if (__getOwnPropSymbols$1)
      for (var prop of __getOwnPropSymbols$1(b)) {
        if (__propIsEnum$1.call(b, prop))
          __defNormalProp$2(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$1.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$1)
      for (var prop of __getOwnPropSymbols$1(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$1.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField$1 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  class Error2 extends Node {
    constructor(_a = {}) {
      var _b = _a, { value, isUnexpected = false } = _b, rest = __objRest(_b, ["value", "isUnexpected"]);
      super(__spreadValues$1({}, rest));
      __publicField$1(this, "value");
      __publicField$1(this, "isUnexpected");
      this.value = value;
      this.isUnexpected = isUnexpected;
    }
  }
  __publicField$1(Error2, "type", "error");

  var __defProp$1 = Object.defineProperty;
  var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
  class ParseResult extends Node {
    get rootNode() {
      return head(this.children);
    }
  }
  __publicField(ParseResult, "type", "parseResult");

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  const getVisitFn = (visitor, type, isLeaving) => {
    const typeVisitor = visitor[type];
    if (typeVisitor != null) {
      if (!isLeaving && typeof typeVisitor === "function") {
        return typeVisitor;
      }
      const typeSpecificVisitor = isLeaving ? typeVisitor.leave : typeVisitor.enter;
      if (typeof typeSpecificVisitor === "function") {
        return typeSpecificVisitor;
      }
    } else {
      const specificVisitor = isLeaving ? visitor.leave : visitor.enter;
      if (specificVisitor != null) {
        if (typeof specificVisitor === "function") {
          return specificVisitor;
        }
        const specificTypeVisitor = specificVisitor[type];
        if (typeof specificTypeVisitor === "function") {
          return specificTypeVisitor;
        }
      }
    }
    return null;
  };
  const BREAK = {};
  const getNodeType = (node) => node == null ? void 0 : node.type;
  const isNode = (node) => typeof getNodeType(node) === "string";
  const cloneNode = (node) => Object.create(Object.getPrototypeOf(node), Object.getOwnPropertyDescriptors(node));
  const mergeAll = ((visitors, {
    visitFnGetter = getVisitFn,
    nodeTypeGetter = getNodeType,
    breakSymbol = BREAK,
    deleteNodeSymbol = null,
    skipVisitingNodeSymbol = false,
    exposeEdits = false
  } = {}) => {
    const skipSymbol = /* @__PURE__ */ Symbol("skip");
    const skipping = new Array(visitors.length).fill(skipSymbol);
    return {
      enter(node, key, parent, path, ancestors, link) {
        let currentNode = node;
        let hasChanged = false;
        const linkProxy = __spreadProps(__spreadValues({}, link), {
          replaceWith(newNode, replacer) {
            link.replaceWith(newNode, replacer);
            currentNode = newNode;
          }
        });
        for (let i = 0; i < visitors.length; i += 1) {
          if (skipping[i] === skipSymbol) {
            const visitFn = visitFnGetter(visitors[i], nodeTypeGetter(currentNode), false);
            if (typeof visitFn === "function") {
              const result = visitFn.call(
                visitors[i],
                currentNode,
                key,
                parent,
                path,
                ancestors,
                linkProxy
              );
              if (typeof (result == null ? void 0 : result.then) === "function") {
                throw new ApiDOMStructuredError("Async visitor not supported in sync mode", {
                  visitor: visitors[i],
                  visitFn
                });
              }
              if (result === skipVisitingNodeSymbol) {
                skipping[i] = currentNode;
              } else if (result === breakSymbol) {
                skipping[i] = breakSymbol;
              } else if (result === deleteNodeSymbol) {
                return result;
              } else if (result !== void 0) {
                if (exposeEdits) {
                  currentNode = result;
                  hasChanged = true;
                } else {
                  return result;
                }
              }
            }
          }
        }
        return hasChanged ? currentNode : void 0;
      },
      leave(node, key, parent, path, ancestors, link) {
        let currentNode = node;
        const linkProxy = __spreadProps(__spreadValues({}, link), {
          replaceWith(newNode, replacer) {
            link.replaceWith(newNode, replacer);
            currentNode = newNode;
          }
        });
        for (let i = 0; i < visitors.length; i += 1) {
          if (skipping[i] === skipSymbol) {
            const visitFn = visitFnGetter(visitors[i], nodeTypeGetter(currentNode), true);
            if (typeof visitFn === "function") {
              const result = visitFn.call(
                visitors[i],
                currentNode,
                key,
                parent,
                path,
                ancestors,
                linkProxy
              );
              if (typeof (result == null ? void 0 : result.then) === "function") {
                throw new ApiDOMStructuredError("Async visitor not supported in sync mode", {
                  visitor: visitors[i],
                  visitFn
                });
              }
              if (result === breakSymbol) {
                skipping[i] = breakSymbol;
              } else if (result !== void 0 && result !== skipVisitingNodeSymbol) {
                return result;
              }
            }
          } else if (skipping[i] === currentNode) {
            skipping[i] = skipSymbol;
          }
        }
        return void 0;
      }
    };
  });
  const mergeAllAsync = (visitors, {
    visitFnGetter = getVisitFn,
    nodeTypeGetter = getNodeType,
    breakSymbol = BREAK,
    deleteNodeSymbol = null,
    skipVisitingNodeSymbol = false,
    exposeEdits = false
  } = {}) => {
    const skipSymbol = /* @__PURE__ */ Symbol("skip");
    const skipping = new Array(visitors.length).fill(skipSymbol);
    return {
      enter(node, key, parent, path, ancestors, link) {
        return __async(this, null, function* () {
          let currentNode = node;
          let hasChanged = false;
          const linkProxy = __spreadProps(__spreadValues({}, link), {
            replaceWith(newNode, replacer) {
              link.replaceWith(newNode, replacer);
              currentNode = newNode;
            }
          });
          for (let i = 0; i < visitors.length; i += 1) {
            if (skipping[i] === skipSymbol) {
              const visitFn = visitFnGetter(visitors[i], nodeTypeGetter(currentNode), false);
              if (typeof visitFn === "function") {
                const result = yield visitFn.call(
                  visitors[i],
                  currentNode,
                  key,
                  parent,
                  path,
                  ancestors,
                  linkProxy
                );
                if (result === skipVisitingNodeSymbol) {
                  skipping[i] = currentNode;
                } else if (result === breakSymbol) {
                  skipping[i] = breakSymbol;
                } else if (result === deleteNodeSymbol) {
                  return result;
                } else if (result !== void 0) {
                  if (exposeEdits) {
                    currentNode = result;
                    hasChanged = true;
                  } else {
                    return result;
                  }
                }
              }
            }
          }
          return hasChanged ? currentNode : void 0;
        });
      },
      leave(node, key, parent, path, ancestors, link) {
        return __async(this, null, function* () {
          let currentNode = node;
          const linkProxy = __spreadProps(__spreadValues({}, link), {
            replaceWith(newNode, replacer) {
              link.replaceWith(newNode, replacer);
              currentNode = newNode;
            }
          });
          for (let i = 0; i < visitors.length; i += 1) {
            if (skipping[i] === skipSymbol) {
              const visitFn = visitFnGetter(visitors[i], nodeTypeGetter(currentNode), true);
              if (typeof visitFn === "function") {
                const result = yield visitFn.call(
                  visitors[i],
                  currentNode,
                  key,
                  parent,
                  path,
                  ancestors,
                  linkProxy
                );
                if (result === breakSymbol) {
                  skipping[i] = breakSymbol;
                } else if (result !== void 0 && result !== skipVisitingNodeSymbol) {
                  return result;
                }
              }
            } else if (skipping[i] === currentNode) {
              skipping[i] = skipSymbol;
            }
          }
          return void 0;
        });
      }
    };
  };
  mergeAll[/* @__PURE__ */ Symbol.for("nodejs.util.promisify.custom")] = mergeAllAsync;
  const visit = (root, visitor, {
    keyMap = null,
    state = {},
    breakSymbol = BREAK,
    deleteNodeSymbol = null,
    skipVisitingNodeSymbol = false,
    visitFnGetter = getVisitFn,
    nodeTypeGetter = getNodeType,
    nodePredicate = isNode,
    nodeCloneFn = cloneNode,
    detectCycles = true,
    detectCyclesCallback = null
  } = {}) => {
    var _a;
    const visitorKeys = keyMap || {};
    let stack;
    let inArray = Array.isArray(root);
    let keys = [root];
    let index = -1;
    let parent;
    let edits = [];
    let node = root;
    const path = [];
    const ancestors = [];
    do {
      index += 1;
      const isLeaving = index === keys.length;
      let key;
      const isEdited = isLeaving && edits.length !== 0;
      if (isLeaving) {
        key = ancestors.length === 0 ? void 0 : path.pop();
        node = parent;
        parent = ancestors.pop();
        if (isEdited) {
          if (inArray) {
            node = node.slice();
            let editOffset = 0;
            for (const [editKey, editValue] of edits) {
              const arrayKey = editKey - editOffset;
              if (editValue === deleteNodeSymbol) {
                node.splice(arrayKey, 1);
                editOffset += 1;
              } else {
                node[arrayKey] = editValue;
              }
            }
          } else {
            node = nodeCloneFn(node);
            for (const [editKey, editValue] of edits) {
              node[editKey] = editValue;
            }
          }
        }
        index = stack.index;
        keys = stack.keys;
        edits = stack.edits;
        inArray = stack.inArray;
        stack = stack.prev;
      } else if (parent !== deleteNodeSymbol && parent !== void 0) {
        key = inArray ? index : keys[index];
        node = parent[key];
        if (node === deleteNodeSymbol || node === void 0) {
          continue;
        }
        path.push(key);
      }
      let result;
      if (!Array.isArray(node)) {
        if (!nodePredicate(node)) {
          throw new ApiDOMStructuredError(`Invalid AST Node:  ${String(node)}`, {
            node
          });
        }
        if (detectCycles && ancestors.includes(node)) {
          if (typeof detectCyclesCallback === "function") {
            detectCyclesCallback(node, key, parent, path, ancestors);
          }
          path.pop();
          continue;
        }
        const visitFn = visitFnGetter(visitor, nodeTypeGetter(node), isLeaving);
        if (visitFn) {
          for (const [stateKey, stateValue] of Object.entries(state)) {
            visitor[stateKey] = stateValue;
          }
          const link = {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            replaceWith(newNode, replacer) {
              if (typeof replacer === "function") {
                replacer(newNode, node, key, parent, path, ancestors);
              } else if (parent) {
                parent[key] = newNode;
              }
              if (!isLeaving) {
                node = newNode;
              }
            }
          };
          result = visitFn.call(visitor, node, key, parent, path, ancestors, link);
        }
        if (typeof (result == null ? void 0 : result.then) === "function") {
          throw new ApiDOMStructuredError("Async visitor not supported in sync mode", {
            visitor,
            visitFn
          });
        }
        if (result === breakSymbol) {
          break;
        }
        if (result === skipVisitingNodeSymbol) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== void 0) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (nodePredicate(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
      if (result === void 0 && isEdited) {
        edits.push([key, node]);
      }
      if (!isLeaving) {
        stack = { inArray, index, keys, edits, prev: stack };
        inArray = Array.isArray(node);
        keys = inArray ? node : (_a = visitorKeys[nodeTypeGetter(node)]) != null ? _a : [];
        index = -1;
        edits = [];
        if (parent !== deleteNodeSymbol && parent !== void 0) {
          ancestors.push(parent);
        }
        parent = node;
      }
    } while (stack !== void 0);
    if (edits.length !== 0) {
      return edits[edits.length - 1][1];
    }
    return root;
  };
  visit[/* @__PURE__ */ Symbol.for("nodejs.util.promisify.custom")] = (_0, _1, ..._2) => __async(null, [
    // @ts-ignore
    _0,
    // @ts-ignore
    _1,
    ..._2
  ], function* (root, visitor, {
    keyMap = null,
    state = {},
    breakSymbol = BREAK,
    deleteNodeSymbol = null,
    skipVisitingNodeSymbol = false,
    visitFnGetter = getVisitFn,
    nodeTypeGetter = getNodeType,
    nodePredicate = isNode,
    nodeCloneFn = cloneNode,
    detectCycles = true,
    detectCyclesCallback = null
  } = {}) {
    var _a;
    const visitorKeys = keyMap || {};
    let stack;
    let inArray = Array.isArray(root);
    let keys = [root];
    let index = -1;
    let parent;
    let edits = [];
    let node = root;
    const path = [];
    const ancestors = [];
    do {
      index += 1;
      const isLeaving = index === keys.length;
      let key;
      const isEdited = isLeaving && edits.length !== 0;
      if (isLeaving) {
        key = ancestors.length === 0 ? void 0 : path.pop();
        node = parent;
        parent = ancestors.pop();
        if (isEdited) {
          if (inArray) {
            node = node.slice();
            let editOffset = 0;
            for (const [editKey, editValue] of edits) {
              const arrayKey = editKey - editOffset;
              if (editValue === deleteNodeSymbol) {
                node.splice(arrayKey, 1);
                editOffset += 1;
              } else {
                node[arrayKey] = editValue;
              }
            }
          } else {
            node = nodeCloneFn(node);
            for (const [editKey, editValue] of edits) {
              node[editKey] = editValue;
            }
          }
        }
        index = stack.index;
        keys = stack.keys;
        edits = stack.edits;
        inArray = stack.inArray;
        stack = stack.prev;
      } else if (parent !== deleteNodeSymbol && parent !== void 0) {
        key = inArray ? index : keys[index];
        node = parent[key];
        if (node === deleteNodeSymbol || node === void 0) {
          continue;
        }
        path.push(key);
      }
      let result;
      if (!Array.isArray(node)) {
        if (!nodePredicate(node)) {
          throw new ApiDOMStructuredError(`Invalid AST Node: ${String(node)}`, {
            node
          });
        }
        if (detectCycles && ancestors.includes(node)) {
          if (typeof detectCyclesCallback === "function") {
            detectCyclesCallback(node, key, parent, path, ancestors);
          }
          path.pop();
          continue;
        }
        const visitFn = visitFnGetter(visitor, nodeTypeGetter(node), isLeaving);
        if (visitFn) {
          for (const [stateKey, stateValue] of Object.entries(state)) {
            visitor[stateKey] = stateValue;
          }
          const link = {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            replaceWith(newNode, replacer) {
              if (typeof replacer === "function") {
                replacer(newNode, node, key, parent, path, ancestors);
              } else if (parent) {
                parent[key] = newNode;
              }
              if (!isLeaving) {
                node = newNode;
              }
            }
          };
          result = yield visitFn.call(visitor, node, key, parent, path, ancestors, link);
        }
        if (result === breakSymbol) {
          break;
        }
        if (result === skipVisitingNodeSymbol) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== void 0) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (nodePredicate(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
      if (result === void 0 && isEdited) {
        edits.push([key, node]);
      }
      if (!isLeaving) {
        stack = { inArray, index, keys, edits, prev: stack };
        inArray = Array.isArray(node);
        keys = inArray ? node : (_a = visitorKeys[nodeTypeGetter(node)]) != null ? _a : [];
        index = -1;
        edits = [];
        if (parent !== deleteNodeSymbol && parent !== void 0) {
          ancestors.push(parent);
        }
        parent = node;
      }
    } while (stack !== void 0);
    if (edits.length !== 0) {
      return edits[edits.length - 1][1];
    }
    return root;
  });

  exports.BREAK = BREAK;
  exports.Error = Error2;
  exports.JsonArray = JsonArray;
  exports.JsonDocument = JsonDocument;
  exports.JsonEscapeSequence = JsonEscapeSequence;
  exports.JsonFalse = JsonFalse;
  exports.JsonKey = JsonKey;
  exports.JsonNode = JsonNode;
  exports.JsonNull = JsonNull;
  exports.JsonNumber = JsonNumber;
  exports.JsonObject = JsonObject;
  exports.JsonProperty = JsonProperty;
  exports.JsonString = JsonString;
  exports.JsonStringContent = JsonStringContent;
  exports.JsonTrue = JsonTrue;
  exports.JsonValue = JsonValue;
  exports.Literal = Literal;
  exports.ParseResult = ParseResult;
  exports.Point = Point;
  exports.Position = Position;
  exports.YamlAlias = YamlAlias;
  exports.YamlAnchor = YamlAnchor;
  exports.YamlCollection = YamlCollection;
  exports.YamlComment = YamlComment;
  exports.YamlDirective = YamlDirective;
  exports.YamlDocument = YamlDocument;
  exports.YamlError = YamlError;
  exports.YamlFailsafeSchema = FailsafeSchema;
  exports.YamlJsonSchema = JsonSchema;
  exports.YamlKeyValuePair = YamlKeyValuePair;
  exports.YamlMapping = YamlMapping;
  exports.YamlNode = YamlNode;
  exports.YamlNodeKind = YamlNodeKind;
  exports.YamlReferenceError = YamlReferenceError;
  exports.YamlReferenceManager = ReferenceManager;
  exports.YamlScalar = YamlScalar;
  exports.YamlSchemaError = YamlSchemaError;
  exports.YamlSequence = YamlSequence;
  exports.YamlStream = YamlStream;
  exports.YamlStyle = YamlStyle;
  exports.YamlStyleGroup = YamlStyleGroup;
  exports.YamlTag = YamlTag;
  exports.YamlTagError = YamlTagError;
  exports.cloneNode = cloneNode;
  exports.getNodeType = getNodeType;
  exports.getVisitFn = getVisitFn;
  exports.isJsonArray = isArray;
  exports.isJsonDocument = isDocument$1;
  exports.isJsonEscapeSequence = isEscapeSequence;
  exports.isJsonFalse = isFalse;
  exports.isJsonKey = isKey;
  exports.isJsonNull = isNull;
  exports.isJsonNumber = isNumber$1;
  exports.isJsonObject = isObject$1;
  exports.isJsonProperty = isProperty;
  exports.isJsonString = isString;
  exports.isJsonStringContent = isStringContent;
  exports.isJsonTrue = isTrue;
  exports.isLiteral = isLiteral;
  exports.isNode = isNode;
  exports.isParseResult = isParseResult;
  exports.isYamlAlias = isAlias;
  exports.isYamlAnchor = isAnchor;
  exports.isYamlComment = isComment;
  exports.isYamlDirective = isDirective;
  exports.isYamlDocument = isDocument;
  exports.isYamlKeyValuePair = isKeyValuePair;
  exports.isYamlMapping = isMapping;
  exports.isYamlScalar = isScalar;
  exports.isYamlSequence = isSequence;
  exports.isYamlStream = isStream;
  exports.isYamlTag = isTag;
  exports.mergeAllVisitors = mergeAll;
  exports.visit = visit;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
