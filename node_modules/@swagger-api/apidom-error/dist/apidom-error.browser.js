(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.apidomError = {}));
})(this, (function (exports) { 'use strict';

  class ApiDOMAggregateError extends AggregateError {
    constructor(errors, message, options) {
      super(errors, message, options);
      this.name = this.constructor.name;
      if (typeof message === "string") {
        this.message = message;
      }
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error(message).stack;
      }
      if (options != null && typeof options === "object" && Object.hasOwn(options, "cause") && !("cause" in this)) {
        const { cause } = options;
        this.cause = cause;
        if (cause instanceof Error && "stack" in cause) {
          this.stack = `${this.stack}
CAUSE: ${cause.stack}`;
        }
      }
    }
  }

  class ApiDOMError extends Error {
    static [Symbol.hasInstance](instance) {
      return super[Symbol.hasInstance](instance) || Function.prototype[Symbol.hasInstance].call(ApiDOMAggregateError, instance);
    }
    constructor(message, options) {
      super(message, options);
      this.name = this.constructor.name;
      if (typeof message === "string") {
        this.message = message;
      }
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error(message).stack;
      }
      if (options != null && typeof options === "object" && Object.hasOwn(options, "cause") && !("cause" in this)) {
        const { cause } = options;
        this.cause = cause;
        if (cause instanceof Error && "stack" in cause) {
          this.stack = `${this.stack}
CAUSE: ${cause.stack}`;
        }
      }
    }
  }

  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  class ApiDOMStructuredError extends ApiDOMError {
    constructor(message, structuredOptions) {
      super(message, structuredOptions);
      if (structuredOptions != null && typeof structuredOptions === "object") {
        const _a = structuredOptions, { cause } = _a, causelessOptions = __objRest(_a, ["cause"]);
        Object.assign(this, causelessOptions);
      }
    }
  }

  class UnsupportedOperationError extends ApiDOMError {
  }

  class NotImplementedError extends UnsupportedOperationError {
  }

  exports.ApiDOMAggregateError = ApiDOMAggregateError;
  exports.ApiDOMError = ApiDOMError;
  exports.ApiDOMStructuredError = ApiDOMStructuredError;
  exports.NotImplementedError = NotImplementedError;
  exports.UnsupportedOperationError = UnsupportedOperationError;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
