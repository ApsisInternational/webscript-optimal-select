(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["OptimalSelect"] = factory();
	else
		root["OptimalSelect"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertNodeList = convertNodeList;
exports.escapeValue = escapeValue;
/**
 * # Utilities
 *
 * Convenience helpers.
 */

/**
 * Create an array with the DOM nodes of the list
 *
 * @param  {NodeList}             nodes - [description]
 * @return {Array.<HTMLElement>}        - [description]
 */
function convertNodeList(nodes) {
  var length = nodes.length;

  var arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = nodes[i];
  }
  return arr;
}

/**
 * Escape special characters and line breaks as a simplified version of 'CSS.escape()'
 *
 * Description of valid characters: https://mathiasbynens.be/notes/css-escapes
 *
 * @param  {String?} value - [description]
 * @return {String}        - [description]
 */
function escapeValue(value) {
  return value && value.replace(/['"`\\/:\?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&').replace(/\n/g, '');
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonAncestor = getCommonAncestor;
exports.getCommonProperties = getCommonProperties;
/**
 * # Common
 *
 * Process collections for similarities.
 */

/**
 * Find the last common ancestor of elements
 *
 * @param  {Array.<HTMLElements>} elements - [description]
 * @return {HTMLElement}                   - [description]
 */
function getCommonAncestor(elements) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$root = options.root,
      root = _options$root === undefined ? document : _options$root;


  var ancestors = [];

  elements.forEach(function (element, index) {
    var parents = [];
    while (element !== root) {
      element = element.parentNode;
      parents.unshift(element);
    }
    ancestors[index] = parents;
  });

  ancestors.sort(function (curr, next) {
    return curr.length - next.length;
  });

  var shallowAncestor = ancestors.shift();

  var ancestor = null;

  var _loop = function _loop() {
    var parent = shallowAncestor[i];
    var missing = ancestors.some(function (otherParents) {
      return !otherParents.some(function (otherParent) {
        return otherParent === parent;
      });
    });

    if (missing) {
      // TODO: find similar sub-parents, not the top root, e.g. sharing a class selector
      return 'break';
    }

    ancestor = parent;
  };

  for (var i = 0, l = shallowAncestor.length; i < l; i++) {
    var _ret = _loop();

    if (_ret === 'break') break;
  }

  return ancestor;
}

/**
 * Get a set of common properties of elements
 *
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {Object}                       - [description]
 */
function getCommonProperties(elements) {

  var commonProperties = {
    classes: [],
    attributes: {},
    tag: null
  };

  elements.forEach(function (element) {
    var commonClasses = commonProperties.classes,
        commonAttributes = commonProperties.attributes,
        commonTag = commonProperties.tag;

    // ~ classes

    if (commonClasses !== undefined) {
      var classes = element.getAttribute('class');
      if (classes) {
        classes = classes.trim().split(' ');
        if (!commonClasses.length) {
          commonProperties.classes = classes;
        } else {
          commonClasses = commonClasses.filter(function (entry) {
            return classes.some(function (name) {
              return name === entry;
            });
          });
          if (commonClasses.length) {
            commonProperties.classes = commonClasses;
          } else {
            delete commonProperties.classes;
          }
        }
      } else {
        // TODO: restructure removal as 2x set / 2x delete, instead of modify always replacing with new collection
        delete commonProperties.classes;
      }
    }

    // ~ attributes
    if (commonAttributes !== undefined) {
      var elementAttributes = element.attributes;
      var attributes = Object.keys(elementAttributes).reduce(function (attributes, key) {
        var attribute = elementAttributes[key];
        var attributeName = attribute.name;
        // NOTE: workaround detection for non-standard phantomjs NamedNodeMap behaviour
        // (issue: https://github.com/ariya/phantomjs/issues/14634)
        if (attribute && attributeName !== 'class') {
          attributes[attributeName] = attribute.value;
        }
        return attributes;
      }, {});

      var attributesNames = Object.keys(attributes);
      var commonAttributesNames = Object.keys(commonAttributes);

      if (attributesNames.length) {
        if (!commonAttributesNames.length) {
          commonProperties.attributes = attributes;
        } else {
          commonAttributes = commonAttributesNames.reduce(function (nextCommonAttributes, name) {
            var value = commonAttributes[name];
            if (value === attributes[name]) {
              nextCommonAttributes[name] = value;
            }
            return nextCommonAttributes;
          }, {});
          if (Object.keys(commonAttributes).length) {
            commonProperties.attributes = commonAttributes;
          } else {
            delete commonProperties.attributes;
          }
        }
      } else {
        delete commonProperties.attributes;
      }
    }

    // ~ tag
    if (commonTag !== undefined) {
      var tag = element.tagName.toLowerCase();
      if (!commonTag) {
        commonProperties.tag = tag;
      } else if (tag !== commonTag) {
        delete commonProperties.tag;
      }
    }
  });

  return commonProperties;
}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optimize;

var _adapt = __webpack_require__(3);

var _adapt2 = _interopRequireDefault(_adapt);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply different optimization techniques
 *
 * @param  {string}                          selector - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element  - [description]
 * @param  {Object}                          options  - [description]
 * @return {string}                                   - [description]
 */
/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
 */

function optimize(selector, elements) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


  // convert single entry and NodeList
  if (!Array.isArray(elements)) {
    elements = !elements.length ? [elements] : (0, _utilities.convertNodeList)(elements);
  }

  if (!elements.length || elements.some(function (element) {
    return element.nodeType !== 1;
  })) {
    throw new Error('Invalid input - to compare HTMLElements its necessary to provide a reference of the selected node(s)! (missing "elements")');
  }

  var globalModified = (0, _adapt2.default)(elements[0], options);

  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729)
  var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/);

  if (path.length < 2) {
    return optimizePart('', selector, '', elements);
  }

  var shortened = [path.pop()];
  while (path.length > 1) {
    var current = path.pop();
    var prePart = path.join(' ');
    var postPart = shortened.join(' ');

    var pattern = prePart + ' ' + postPart;
    var matches = document.querySelectorAll(pattern);
    if (matches.length !== elements.length) {
      shortened.unshift(optimizePart(prePart, current, postPart, elements));
    }
  }
  shortened.unshift(path[0]);
  path = shortened;

  // optimize start + end
  path[0] = optimizePart('', path[0], path.slice(1).join(' '), elements);
  path[path.length - 1] = optimizePart(path.slice(0, -1).join(' '), path[path.length - 1], '', elements);

  if (globalModified) {
    delete true;
  }

  return path.join(' ').replace(/>/g, '> ').trim();
}

/**
 * Improve a chunk of the selector
 *
 * @param  {string}              prePart  - [description]
 * @param  {string}              current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {string}                       - [description]
 */
function optimizePart(prePart, current, postPart, elements) {
  if (prePart.length) prePart = prePart + ' ';
  if (postPart.length) postPart = ' ' + postPart;

  // robustness: attribute without value (generalization)
  if (/\[*\]/.test(current)) {
    var key = current.replace(/=.*$/, ']');
    var pattern = '' + prePart + key + postPart;
    var matches = document.querySelectorAll(pattern);
    if (compareResults(matches, elements)) {
      current = key;
    } else {
      // robustness: replace specific key-value with base tag (heuristic)
      var references = document.querySelectorAll('' + prePart + key);

      var _loop = function _loop() {
        var reference = references[i];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          var description = reference.tagName.toLowerCase();
          pattern = '' + prePart + description + postPart;
          matches = document.querySelectorAll(pattern);

          if (compareResults(matches, elements)) {
            current = description;
          }
          return 'break';
        }
      };

      for (var i = 0, l = references.length; i < l; i++) {
        var pattern;
        var matches;

        var _ret = _loop();

        if (_ret === 'break') break;
      }
    }
  }

  // robustness: descendant instead child (heuristic)
  if (/>/.test(current)) {
    var descendant = current.replace(/>/, '');
    var pattern = '' + prePart + descendant + postPart;
    var matches = document.querySelectorAll(pattern);
    if (compareResults(matches, elements)) {
      current = descendant;
    }
  }

  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (/:nth-child/.test(current)) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    var type = current.replace(/nth-child/g, 'nth-of-type');
    var pattern = '' + prePart + type + postPart;
    var matches = document.querySelectorAll(pattern);
    if (compareResults(matches, elements)) {
      current = type;
    }
  }

  // efficiency: combinations of classname (partial permutations)
  if (/\.\S+\.\S+/.test(current)) {
    var names = current.trim().split('.').slice(1).map(function (name) {
      return '.' + name;
    }).sort(function (curr, next) {
      return curr.length - next.length;
    });
    while (names.length) {
      names = names.slice(1);
      var partial = names.join('');

      var pattern = ('' + prePart + partial + postPart).trim();
      if (!pattern.length || pattern.charAt(0) === '>' || pattern.charAt(pattern.length - 1) === '>') {
        break;
      }
      var matches = document.querySelectorAll(pattern);
      if (compareResults(matches, elements)) {
        current = partial;
      }
    }

    // robustness: degrade complex classname (heuristic)
    names = current && current.match(/\./g);
    if (names && names.length > 2) {
      var _references = document.querySelectorAll('' + prePart + current);

      var _loop2 = function _loop2() {
        var reference = _references[i];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          // TODO:
          // - check using attributes + regard excludes
          var description = reference.tagName.toLowerCase();
          pattern = '' + prePart + description + postPart;
          matches = document.querySelectorAll(pattern);

          if (compareResults(matches, elements)) {
            current = description;
          }
          return 'break';
        }
      };

      for (var i = 0, l = _references.length; i < l; i++) {
        var pattern;
        var matches;

        var _ret2 = _loop2();

        if (_ret2 === 'break') break;
      }
    }
  }

  return current;
}

/**
 * Evaluate matches with expected elements
 *
 * @param  {Array.<HTMLElement>} matches  - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {Boolean}                      - [description]
 */
function compareResults(matches, elements) {
  var length = matches.length;

  return length === elements.length && elements.every(function (element) {
    for (var i = 0; i < length; i++) {
      if (matches[i] === element) {
        return true;
      }
    }
    return false;
  });
}
module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = adapt;
/**
 * # Adapt
 *
 * Check and extend the environment for universal usage.
 */

/**
 * Modify the context based on the environment
 *
 * @param  {HTMLELement} element - [description]
 * @param  {Object}      options - [description]
 * @return {boolean}             - [description]
 */
function adapt(element, options) {

  // detect environment setup
  if (true) {
    return false;
  } else {
    global.document = options.context || function () {
      var root = element;
      while (root.parent) {
        root = root.parent;
      }
      return root;
    }();
  }

  // https://github.com/fb55/domhandler/blob/master/index.js#L75
  var ElementPrototype = Object.getPrototypeOf(true);

  // alternative descriptor to access elements with filtering invalid elements (e.g. textnodes)
  if (!Object.getOwnPropertyDescriptor(ElementPrototype, 'childTags')) {
    Object.defineProperty(ElementPrototype, 'childTags', {
      enumerable: true,
      get: function get() {
        return this.children.filter(function (node) {
          // https://github.com/fb55/domelementtype/blob/master/index.js#L12
          return node.type === 'tag' || node.type === 'script' || node.type === 'style';
        });
      }
    });
  }

  if (!Object.getOwnPropertyDescriptor(ElementPrototype, 'attributes')) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes
    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
    Object.defineProperty(ElementPrototype, 'attributes', {
      enumerable: true,
      get: function get() {
        var attribs = this.attribs;

        var attributesNames = Object.keys(attribs);
        var NamedNodeMap = attributesNames.reduce(function (attributes, attributeName, index) {
          attributes[index] = {
            name: attributeName,
            value: attribs[attributeName]
          };
          return attributes;
        }, {});
        Object.defineProperty(NamedNodeMap, 'length', {
          enumerable: false,
          configurable: false,
          value: attributesNames.length
        });
        return NamedNodeMap;
      }
    });
  }

  if (!ElementPrototype.getAttribute) {
    // https://docs.webplatform.org/wiki/dom/Element/getAttribute
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
    ElementPrototype.getAttribute = function (name) {
      return this.attribs[name] || null;
    };
  }

  if (!ElementPrototype.getElementsByTagName) {
    // https://docs.webplatform.org/wiki/dom/Document/getElementsByTagName
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
    ElementPrototype.getElementsByTagName = function (tagName) {
      var HTMLCollection = [];
      traverseDescendants(this.childTags, function (descendant) {
        if (descendant.name === tagName || tagName === '*') {
          HTMLCollection.push(descendant);
        }
      });
      return HTMLCollection;
    };
  }

  if (!ElementPrototype.getElementsByClassName) {
    // https://docs.webplatform.org/wiki/dom/Document/getElementsByClassName
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
    ElementPrototype.getElementsByClassName = function (className) {
      var names = className.trim().replace(/\s+/g, ' ').split(' ');
      var HTMLCollection = [];
      traverseDescendants([this], function (descendant) {
        var descendantClassName = descendant.attribs.class;
        if (descendantClassName && names.every(function (name) {
          return descendantClassName.indexOf(name) > -1;
        })) {
          HTMLCollection.push(descendant);
        }
      });
      return HTMLCollection;
    };
  }

  if (!ElementPrototype.querySelectorAll) {
    // https://docs.webplatform.org/wiki/css/selectors_api/querySelectorAll
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
    ElementPrototype.querySelectorAll = function (selectors) {
      var _this = this;

      selectors = selectors.replace(/(>)(\S)/g, '$1 $2').trim(); // add space for '>' selector

      // using right to left execution => https://github.com/fb55/css-select#how-does-it-work
      var instructions = getInstructions(selectors);
      var discover = instructions.shift();

      var total = instructions.length;
      return discover(this).filter(function (node) {
        var step = 0;
        while (step < total) {
          node = instructions[step](node, _this);
          if (!node) {
            // hierarchy doesn't match
            return false;
          }
          step += 1;
        }
        return true;
      });
    };
  }

  if (!ElementPrototype.contains) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
    ElementPrototype.contains = function (element) {
      var inclusive = false;
      traverseDescendants([this], function (descendant, done) {
        if (descendant === element) {
          inclusive = true;
          done();
        }
      });
      return inclusive;
    };
  }

  return true;
}

/**
 * Retrieve transformation steps
 *
 * @param  {Array.<string>}   selectors - [description]
 * @return {Array.<Function>}           - [description]
 */
function getInstructions(selectors) {
  return selectors.split(' ').reverse().map(function (selector, step) {
    var discover = step === 0;

    var _selector$split = selector.split(':'),
        _selector$split2 = _slicedToArray(_selector$split, 2),
        type = _selector$split2[0],
        pseudo = _selector$split2[1];

    var validate = null;
    var instruction = null;

    switch (true) {

      // child: '>'
      case />/.test(type):
        instruction = function checkParent(node) {
          return function (validate) {
            return validate(node.parent) && node.parent;
          };
        };
        break;

      // class: '.'
      case /^\./.test(type):
        var names = type.substr(1).split('.');
        validate = function validate(node) {
          var nodeClassName = node.attribs.class;
          return nodeClassName && names.every(function (name) {
            return nodeClassName.indexOf(name) > -1;
          });
        };
        instruction = function checkClass(node, root) {
          if (discover) {
            return node.getElementsByClassName(names.join(' '));
          }
          return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
        };
        break;

      // attribute: '[key="value"]'
      case /^\[/.test(type):
        var _type$replace$split = type.replace(/\[|\]|"/g, '').split('='),
            _type$replace$split2 = _slicedToArray(_type$replace$split, 2),
            attributeKey = _type$replace$split2[0],
            attributeValue = _type$replace$split2[1];

        validate = function validate(node) {
          var hasAttribute = Object.keys(node.attribs).indexOf(attributeKey) > -1;
          if (hasAttribute) {
            // regard optional attributeValue
            if (!attributeValue || node.attribs[attributeKey] === attributeValue) {
              return true;
            }
          }
          return false;
        };
        instruction = function checkAttribute(node, root) {
          if (discover) {
            var NodeList = [];
            traverseDescendants([node], function (descendant) {
              if (validate(descendant)) {
                NodeList.push(descendant);
              }
            });
            return NodeList;
          }
          return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
        };
        break;

      // id: '#'
      case /^#/.test(type):
        var id = type.substr(1);
        validate = function validate(node) {
          return node.attribs.id === id;
        };
        instruction = function checkId(node, root) {
          if (discover) {
            var NodeList = [];
            traverseDescendants([node], function (descendant, done) {
              if (validate(descendant)) {
                NodeList.push(descendant);
                done();
              }
            });
            return NodeList;
          }
          return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
        };
        break;

      // universal: '*'
      case /\*/.test(type):
        validate = function validate(node) {
          return true;
        };
        instruction = function checkUniversal(node, root) {
          if (discover) {
            var NodeList = [];
            traverseDescendants([node], function (descendant) {
              return NodeList.push(descendant);
            });
            return NodeList;
          }
          return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
        };
        break;

      // tag: '...'
      default:
        validate = function validate(node) {
          return node.name === type;
        };
        instruction = function checkTag(node, root) {
          if (discover) {
            var NodeList = [];
            traverseDescendants([node], function (descendant) {
              if (validate(descendant)) {
                NodeList.push(descendant);
              }
            });
            return NodeList;
          }
          return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
        };
    }

    if (!pseudo) {
      return instruction;
    }

    var rule = pseudo.match(/-(child|type)\((\d+)\)$/);
    var kind = rule[1];
    var index = parseInt(rule[2], 10) - 1;

    var validatePseudo = function validatePseudo(node) {
      if (node) {
        var compareSet = node.parent.childTags;
        if (kind === 'type') {
          compareSet = compareSet.filter(validate);
        }
        var nodeIndex = compareSet.findIndex(function (child) {
          return child === node;
        });
        if (nodeIndex === index) {
          return true;
        }
      }
      return false;
    };

    return function enhanceInstruction(node) {
      var match = instruction(node);
      if (discover) {
        return match.reduce(function (NodeList, matchedNode) {
          if (validatePseudo(matchedNode)) {
            NodeList.push(matchedNode);
          }
          return NodeList;
        }, []);
      }
      return validatePseudo(match) && match;
    };
  });
}

/**
 * Walking recursive to invoke callbacks
 *
 * @param {Array.<HTMLElement>} nodes   - [description]
 * @param {Function}            handler - [description]
 */
function traverseDescendants(nodes, handler) {
  nodes.forEach(function (node) {
    var progress = true;
    handler(node, function () {
      return progress = false;
    });
    if (node.childTags && progress) {
      traverseDescendants(node.childTags, handler);
    }
  });
}

/**
 * Bubble up from bottom to top
 *
 * @param  {HTMLELement} node     - [description]
 * @param  {HTMLELement} root     - [description]
 * @param  {Function}    validate - [description]
 * @return {HTMLELement}          - [description]
 */
function getAncestor(node, root, validate) {
  while (node.parent) {
    node = node.parent;
    if (validate(node)) {
      return node;
    }
    if (node === root) {
      break;
    }
  }
  return null;
}
module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * # Select
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Construct a unique CSS query selector to access the selected DOM element(s).
                                                                                                                                                                                                                                                                               * For longevity it applies different matching and optimization strategies.
                                                                                                                                                                                                                                                                               */

exports.getSingleSelector = getSingleSelector;
exports.getMultiSelector = getMultiSelector;
exports.default = getQuerySelector;

var _adapt = __webpack_require__(3);

var _adapt2 = _interopRequireDefault(_adapt);

var _match = __webpack_require__(5);

var _match2 = _interopRequireDefault(_match);

var _optimize = __webpack_require__(2);

var _optimize2 = _interopRequireDefault(_optimize);

var _utilities = __webpack_require__(0);

var _common = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a selector for the provided element
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      options - [description]
 * @return {string}              - [description]
 */
function getSingleSelector(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (element.nodeType === 3) {
    element = element.parentNode;
  }

  if (element.nodeType !== 1) {
    throw new Error('Invalid input - only HTMLElements or representations of them are supported! (not "' + (typeof element === 'undefined' ? 'undefined' : _typeof(element)) + '")');
  }

  var globalModified = (0, _adapt2.default)(element, options);

  var selector = (0, _match2.default)(element, options);
  var optimized = (0, _optimize2.default)(selector, element, options);

  // debug
  // console.log(`
  //   selector:  ${selector}
  //   optimized: ${optimized}
  // `)

  if (globalModified) {
    delete true;
  }

  return optimized;
}

/**
 * Get a selector to match multiple descendants from an ancestor
 *
 * @param  {Array.<HTMLElement>|NodeList} elements - [description]
 * @param  {Object}                       options  - [description]
 * @return {string}                                - [description]
 */
function getMultiSelector(elements) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (!Array.isArray(elements)) {
    elements = (0, _utilities.convertNodeList)(elements);
  }

  if (elements.some(function (element) {
    return element.nodeType !== 1;
  })) {
    throw new Error('Invalid input - only an Array of HTMLElements or representations of them is supported!');
  }

  var globalModified = (0, _adapt2.default)(elements[0], options);

  var ancestor = (0, _common.getCommonAncestor)(elements, options);
  var ancestorSelector = getSingleSelector(ancestor, options);

  // TODO: consider usage of multiple selectors + parent-child relation + check for part redundancy
  var commonSelectors = getCommonSelectors(elements);
  var descendantSelector = commonSelectors[0];

  var selector = (0, _optimize2.default)(ancestorSelector + ' ' + descendantSelector, elements, options);
  var selectorMatches = (0, _utilities.convertNodeList)(document.querySelectorAll(selector));

  if (!elements.every(function (element) {
    return selectorMatches.some(function (entry) {
      return entry === element;
    });
  })) {
    // TODO: cluster matches to split into similar groups for sub selections
    return console.warn('\n      The selected elements can\'t be efficiently mapped.\n      Its probably best to use multiple single selectors instead!\n    ', elements);
  }

  if (globalModified) {
    delete true;
  }

  return selector;
}

/**
 * Get selectors to describe a set of elements
 *
 * @param  {Array.<HTMLElements>} elements - [description]
 * @return {string}                        - [description]
 */
function getCommonSelectors(elements) {
  var _getCommonProperties = (0, _common.getCommonProperties)(elements),
      classes = _getCommonProperties.classes,
      attributes = _getCommonProperties.attributes,
      tag = _getCommonProperties.tag;

  var selectorPath = [];

  if (tag) {
    selectorPath.push(tag);
  }

  if (classes) {
    var classSelector = classes.map(function (name) {
      return '.' + name;
    }).join('');
    selectorPath.push(classSelector);
  }

  if (attributes) {
    var attributeSelector = Object.keys(attributes).reduce(function (parts, name) {
      parts.push('[' + name + '="' + attributes[name] + '"]');
      return parts;
    }, []).join('');
    selectorPath.push(attributeSelector);
  }

  if (selectorPath.length) {
    // TODO: check for parent-child relation
  }

  return [selectorPath.join('')];
}

/**
 * Choose action depending on the input (multiple/single)
 *
 * NOTE: extended detection is used for special cases like the <select> element with <options>
 *
 * @param  {HTMLElement|NodeList|Array.<HTMLElement>} input   - [description]
 * @param  {Object}                                   options - [description]
 * @return {string}                                           - [description]
 */
function getQuerySelector(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (input.length && !input.name) {
    return getMultiSelector(input, options);
  }
  return getSingleSelector(input, options);
}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = match;

var _utilities = __webpack_require__(0);

var defaultIgnore = {
  attribute: function attribute(attributeName) {
    return ['style', 'data-reactid', 'data-react-checksum'].indexOf(attributeName) > -1;
  }
};

/**
 * Get the path of the element
 *
 * @param  {HTMLElement} node    - [description]
 * @param  {Object}      options - [description]
 * @return {string}              - [description]
 */
/**
 * # Match
 *
 * Retrieve selector for a node.
 */

function match(node, options) {
  var _options$root = options.root,
      root = _options$root === undefined ? document : _options$root,
      _options$skip = options.skip,
      skip = _options$skip === undefined ? null : _options$skip,
      _options$priority = options.priority,
      priority = _options$priority === undefined ? ['id', 'class', 'href', 'src'] : _options$priority,
      _options$ignore = options.ignore,
      ignore = _options$ignore === undefined ? {} : _options$ignore;


  var path = [];
  var element = node;
  var length = path.length;
  var ignoreClass = false;

  var skipCompare = skip && (Array.isArray(skip) ? skip : [skip]).map(function (entry) {
    if (typeof entry !== 'function') {
      return function (element) {
        return element === entry;
      };
    }
    return entry;
  });

  var skipChecks = function skipChecks(element) {
    return skip && skipCompare.some(function (compare) {
      return compare(element);
    });
  };

  Object.keys(ignore).forEach(function (type) {
    if (type === 'class') {
      ignoreClass = true;
    }
    var predicate = ignore[type];
    if (typeof predicate === 'function') return;
    if (typeof predicate === 'number') {
      predicate = predicate.toString();
    }
    if (typeof predicate === 'string') {
      predicate = new RegExp((0, _utilities.escapeValue)(predicate).replace(/\\/g, '\\\\'));
    }
    if (typeof predicate === 'boolean') {
      predicate = predicate ? /(?:)/ : /.^/;
    }
    // check class-/attributename for regex
    ignore[type] = function (name, value) {
      return predicate.test(value);
    };
  });

  if (ignoreClass) {
    var ignoreAttribute = ignore.attribute;
    ignore.attribute = function (name, value, defaultPredicate) {
      return ignore.class(value) || ignoreAttribute && ignoreAttribute(name, value, defaultPredicate);
    };
  }

  while (element !== root) {
    if (skipChecks(element) !== true) {
      // ~ global
      if (checkAttributes(priority, element, ignore, path, root)) break;
      if (checkTag(element, ignore, path, root)) break;

      // ~ local
      checkAttributes(priority, element, ignore, path);
      if (path.length === length) {
        checkTag(element, ignore, path);
      }

      // define only one part each iteration
      if (path.length === length) {
        checkChilds(priority, element, ignore, path);
      }
    }

    element = element.parentNode;
    length = path.length;
  }

  if (element === root) {
    var pattern = findPattern(priority, element, ignore);
    path.unshift(pattern);
  }

  return path.join(' ');
}

/**
 * Extend path with attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<string>} path     - [description]
 * @param  {HTMLElement}    parent   - [description]
 * @return {boolean}                 - [description]
 */
function checkAttributes(priority, element, ignore, path) {
  var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : element.parentNode;

  var pattern = findAttributesPattern(priority, element, ignore);
  if (pattern) {
    var matches = parent.querySelectorAll(pattern);
    if (matches.length === 1) {
      path.unshift(pattern);
      return true;
    }
  }
  return false;
}

/**
 * Lookup attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @return {string?}                 - [description]
 */
function findAttributesPattern(priority, element, ignore) {
  var attributes = element.attributes;
  var withoutPriority = [];
  var sortedKeys = Object.keys(attributes).map(function (i) {
    i = +i;
    var pos = priority.indexOf(attributes[i].name);
    if (pos === -1) {
      withoutPriority.push(i);
    }
    return { pos: pos, i: i };
  }).filter(function (item) {
    return item.pos !== -1;
  }).sort(function (a, b) {
    return a.pos - b.pos;
  }).map(function (item) {
    return item.i;
  }).concat(withoutPriority);

  for (var i = 0, l = sortedKeys.length; i < l; i++) {
    var key = sortedKeys[i];
    var attribute = attributes[key];
    var attributeName = attribute.name;
    var attributeValue = (0, _utilities.escapeValue)(attribute.value);

    var currentIgnore = ignore[attributeName] || ignore.attribute;
    var currentDefaultIgnore = defaultIgnore[attributeName] || defaultIgnore.attribute;
    if (checkIgnore(currentIgnore, attributeName, attributeValue, currentDefaultIgnore)) {
      continue;
    }

    var pattern = '[' + attributeName + '="' + attributeValue + '"]';

    if (attributeName === 'id') {
      pattern = '#' + attributeValue;
    }

    if (attributeName === 'class') {
      // If there aren't actually any classes, skip.
      if (element.classList.length === 0) {
        continue;
      }
      var validClassNames = attributeValue.trim().split(/\s+/).filter(function (val) {
        return (/\D/.test(val[0])
        );
      });

      if (validClassNames.length === 0) continue;

      pattern = '.' + validClassNames.join('.');
    }

    return pattern;
  }
  return null;
}

/**
 * Extend path with tag identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Object}         ignore  - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
 */
function checkTag(element, ignore, path) {
  var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : element.parentNode;

  var pattern = findTagPattern(element, ignore);
  if (pattern) {
    var matches = parent.getElementsByTagName(pattern);
    if (matches.length === 1) {
      path.unshift(pattern);
      return true;
    }
  }
  return false;
}

/**
 * Lookup tag identifier
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      ignore  - [description]
 * @return {boolean}             - [description]
 */
function findTagPattern(element, ignore) {
  var tagName = element.tagName.toLowerCase();
  if (checkIgnore(ignore.tag, null, tagName)) {
    return null;
  }
  return tagName;
}

/**
 * Extend path with specific child identifier
 *
 * NOTE: 'childTags' is a custom property to use as a view filter for tags using 'adapter.js'
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<string>} path     - [description]
 * @return {boolean}                 - [description]
 */
function checkChilds(priority, element, ignore, path) {
  var parent = element.parentNode;
  var children = parent.childTags || parent.children;
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    if (child === element) {
      var childPattern = findPattern(priority, child, ignore);
      if (!childPattern) {
        return console.warn('\n          Element couldn\'t be matched through strict ignore pattern!\n        ', child, ignore, childPattern);
      }
      var pattern = '> ' + childPattern + ':nth-child(' + (i + 1) + ')';
      path.unshift(pattern);
      return true;
    }
  }
  return false;
}

/**
 * Lookup identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @return {string}                  - [description]
 */
function findPattern(priority, element, ignore) {
  var pattern = findAttributesPattern(priority, element, ignore);
  if (!pattern) {
    pattern = findTagPattern(element, ignore);
  }
  return pattern;
}

/**
 * Validate with custom and default functions
 *
 * @param  {Function} predicate        - [description]
 * @param  {string?}  name             - [description]
 * @param  {string}   value            - [description]
 * @param  {Function} defaultPredicate - [description]
 * @return {boolean}                   - [description]
 */
function checkIgnore(predicate, name, value, defaultPredicate) {
  if (!value) {
    return true;
  }
  var check = predicate || defaultPredicate;
  if (!check) {
    return false;
  }
  return check(name, value, defaultPredicate);
}
module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.common = exports.optimize = exports.getMultiSelector = exports.getSingleSelector = exports.select = undefined;

var _select2 = __webpack_require__(4);

Object.defineProperty(exports, 'getSingleSelector', {
  enumerable: true,
  get: function get() {
    return _select2.getSingleSelector;
  }
});
Object.defineProperty(exports, 'getMultiSelector', {
  enumerable: true,
  get: function get() {
    return _select2.getMultiSelector;
  }
});

var _select3 = _interopRequireDefault(_select2);

var _optimize2 = __webpack_require__(2);

var _optimize3 = _interopRequireDefault(_optimize2);

var _common2 = __webpack_require__(1);

var _common = _interopRequireWildcard(_common2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.select = _select3.default;
exports.optimize = _optimize3.default;
exports.common = _common;
exports.default = _select3.default;

/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0OGQ2MjJiZDBmNDM4YTc2ZTBlYyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29wdGltaXplLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiY29udmVydE5vZGVMaXN0IiwiZXNjYXBlVmFsdWUiLCJub2RlcyIsImxlbmd0aCIsImFyciIsIkFycmF5IiwiaSIsInZhbHVlIiwicmVwbGFjZSIsImdldENvbW1vbkFuY2VzdG9yIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImVsZW1lbnRzIiwib3B0aW9ucyIsInJvb3QiLCJkb2N1bWVudCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwicGFyZW50IiwibWlzc2luZyIsInNvbWUiLCJvdGhlclBhcmVudHMiLCJvdGhlclBhcmVudCIsImwiLCJjb21tb25Qcm9wZXJ0aWVzIiwiY2xhc3NlcyIsImF0dHJpYnV0ZXMiLCJ0YWciLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwibmFtZSIsImVsZW1lbnRBdHRyaWJ1dGVzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImtleSIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIm9wdGltaXplIiwic2VsZWN0b3IiLCJpc0FycmF5Iiwibm9kZVR5cGUiLCJFcnJvciIsImdsb2JhbE1vZGlmaWVkIiwicGF0aCIsIm9wdGltaXplUGFydCIsInNob3J0ZW5lZCIsInBvcCIsImN1cnJlbnQiLCJwcmVQYXJ0Iiwiam9pbiIsInBvc3RQYXJ0IiwicGF0dGVybiIsIm1hdGNoZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwic2xpY2UiLCJ0ZXN0IiwiY29tcGFyZVJlc3VsdHMiLCJyZWZlcmVuY2VzIiwicmVmZXJlbmNlIiwiY29udGFpbnMiLCJkZXNjcmlwdGlvbiIsImRlc2NlbmRhbnQiLCJ0eXBlIiwibmFtZXMiLCJtYXAiLCJwYXJ0aWFsIiwiY2hhckF0IiwibWF0Y2giLCJldmVyeSIsImFkYXB0IiwiZ2xvYmFsIiwiY29udGV4dCIsIkVsZW1lbnRQcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImNoaWxkcmVuIiwibm9kZSIsImF0dHJpYnMiLCJOYW1lZE5vZGVNYXAiLCJjb25maWd1cmFibGUiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIkhUTUxDb2xsZWN0aW9uIiwidHJhdmVyc2VEZXNjZW5kYW50cyIsImNoaWxkVGFncyIsInB1c2giLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiY2xhc3NOYW1lIiwiZGVzY2VuZGFudENsYXNzTmFtZSIsImNsYXNzIiwiaW5kZXhPZiIsInNlbGVjdG9ycyIsImluc3RydWN0aW9ucyIsImdldEluc3RydWN0aW9ucyIsImRpc2NvdmVyIiwidG90YWwiLCJzdGVwIiwiaW5jbHVzaXZlIiwiZG9uZSIsInJldmVyc2UiLCJwc2V1ZG8iLCJ2YWxpZGF0ZSIsImluc3RydWN0aW9uIiwiY2hlY2tQYXJlbnQiLCJzdWJzdHIiLCJub2RlQ2xhc3NOYW1lIiwiY2hlY2tDbGFzcyIsImdldEFuY2VzdG9yIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJoYXNBdHRyaWJ1dGUiLCJjaGVja0F0dHJpYnV0ZSIsIk5vZGVMaXN0IiwiaWQiLCJjaGVja0lkIiwiY2hlY2tVbml2ZXJzYWwiLCJjaGVja1RhZyIsInJ1bGUiLCJraW5kIiwicGFyc2VJbnQiLCJ2YWxpZGF0ZVBzZXVkbyIsImNvbXBhcmVTZXQiLCJub2RlSW5kZXgiLCJmaW5kSW5kZXgiLCJjaGlsZCIsImVuaGFuY2VJbnN0cnVjdGlvbiIsIm1hdGNoZWROb2RlIiwiaGFuZGxlciIsInByb2dyZXNzIiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yIiwiZ2V0UXVlcnlTZWxlY3RvciIsIm9wdGltaXplZCIsImFuY2VzdG9yU2VsZWN0b3IiLCJjb21tb25TZWxlY3RvcnMiLCJnZXRDb21tb25TZWxlY3RvcnMiLCJkZXNjZW5kYW50U2VsZWN0b3IiLCJzZWxlY3Rvck1hdGNoZXMiLCJjb25zb2xlIiwid2FybiIsInNlbGVjdG9yUGF0aCIsImNsYXNzU2VsZWN0b3IiLCJhdHRyaWJ1dGVTZWxlY3RvciIsInBhcnRzIiwiaW5wdXQiLCJkZWZhdWx0SWdub3JlIiwic2tpcCIsInByaW9yaXR5IiwiaWdub3JlIiwiaWdub3JlQ2xhc3MiLCJza2lwQ29tcGFyZSIsInNraXBDaGVja3MiLCJjb21wYXJlIiwicHJlZGljYXRlIiwidG9TdHJpbmciLCJSZWdFeHAiLCJpZ25vcmVBdHRyaWJ1dGUiLCJkZWZhdWx0UHJlZGljYXRlIiwiY2hlY2tBdHRyaWJ1dGVzIiwiY2hlY2tDaGlsZHMiLCJmaW5kUGF0dGVybiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsIndpdGhvdXRQcmlvcml0eSIsInNvcnRlZEtleXMiLCJwb3MiLCJpdGVtIiwiYSIsImIiLCJjb25jYXQiLCJjdXJyZW50SWdub3JlIiwiY3VycmVudERlZmF1bHRJZ25vcmUiLCJjaGVja0lnbm9yZSIsImNsYXNzTGlzdCIsInZhbGlkQ2xhc3NOYW1lcyIsInZhbCIsImZpbmRUYWdQYXR0ZXJuIiwiY2hpbGRQYXR0ZXJuIiwiY2hlY2siLCJzZWxlY3QiLCJjb21tb24iLCJkZWZhdWx0Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7UUNwRGdCQSxlLEdBQUFBLGU7UUFpQkFDLFcsR0FBQUEsVztBQTdCaEI7Ozs7OztBQU1BOzs7Ozs7QUFNTyxTQUFTRCxlQUFULENBQTBCRSxLQUExQixFQUFpQztBQUFBLE1BQzlCQyxNQUQ4QixHQUNuQkQsS0FEbUIsQ0FDOUJDLE1BRDhCOztBQUV0QyxNQUFNQyxNQUFNLElBQUlDLEtBQUosQ0FBVUYsTUFBVixDQUFaO0FBQ0EsT0FBSyxJQUFJRyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1BQXBCLEVBQTRCRyxHQUE1QixFQUFpQztBQUMvQkYsUUFBSUUsQ0FBSixJQUFTSixNQUFNSSxDQUFOLENBQVQ7QUFDRDtBQUNELFNBQU9GLEdBQVA7QUFDRDs7QUFFRDs7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M0osT0FBaEMsRUFBeUM0SixNQUF6QyxFQUFpRDtBQUMvQyxNQUFJbkcsVUFBVWdILHNCQUFzQmQsUUFBdEIsRUFBZ0MzSixPQUFoQyxFQUF5QzRKLE1BQXpDLENBQWQ7QUFDQSxNQUFJLENBQUNuRyxPQUFMLEVBQWM7QUFDWkEsY0FBVThILGVBQWV2TCxPQUFmLEVBQXdCNEosTUFBeEIsQ0FBVjtBQUNEO0FBQ0QsU0FBT25HLE9BQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBUzBILFdBQVQsQ0FBc0JsQixTQUF0QixFQUFpQ25JLElBQWpDLEVBQXVDeEMsS0FBdkMsRUFBOEMrSyxnQkFBOUMsRUFBZ0U7QUFDOUQsTUFBSSxDQUFDL0ssS0FBTCxFQUFZO0FBQ1YsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxNQUFNbU0sUUFBUXhCLGFBQWFJLGdCQUEzQjtBQUNBLE1BQUksQ0FBQ29CLEtBQUwsRUFBWTtBQUNWLFdBQU8sS0FBUDtBQUNEO0FBQ0QsU0FBT0EsTUFBTTNKLElBQU4sRUFBWXhDLEtBQVosRUFBbUIrSyxnQkFBbkIsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkNuU2dCNUIsaUI7Ozs7OztvQkFBbUJDLGdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFBN0JnRCxNO1FBQ0EvSSxRO1FBQ0tnSixNO1FBRUxDLE8iLCJmaWxlIjoib3B0aW1hbC1zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDhkNjIyYmQwZjQzOGE3NmUwZWMiLCIvKipcbiAqICMgVXRpbGl0aWVzXG4gKlxuICogQ29udmVuaWVuY2UgaGVscGVycy5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhbiBhcnJheSB3aXRoIHRoZSBET00gbm9kZXMgb2YgdGhlIGxpc3RcbiAqXG4gKiBAcGFyYW0gIHtOb2RlTGlzdH0gICAgICAgICAgICAgbm9kZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48SFRNTEVsZW1lbnQ+fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0Tm9kZUxpc3QgKG5vZGVzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBub2Rlc1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gbm9kZXNbaV1cbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbi8qKlxuICogRXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbGluZSBicmVha3MgYXMgYSBzaW1wbGlmaWVkIHZlcnNpb24gb2YgJ0NTUy5lc2NhcGUoKSdcbiAqXG4gKiBEZXNjcmlwdGlvbiBvZiB2YWxpZCBjaGFyYWN0ZXJzOiBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvY3NzLWVzY2FwZXNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmc/fSB2YWx1ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlVmFsdWUgKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5yZXBsYWNlKC9bJ1wiYFxcXFwvOlxcPyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dL2csICdcXFxcJCYnKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICcnKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsaXRpZXMuanMiLCIvKipcbiAqICMgQ29tbW9uXG4gKlxuICogUHJvY2VzcyBjb2xsZWN0aW9ucyBmb3Igc2ltaWxhcml0aWVzLlxuICovXG5cbi8qKlxuICogRmluZCB0aGUgbGFzdCBjb21tb24gYW5jZXN0b3Igb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnRzPn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25BbmNlc3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBhbmNlc3RvcnMgPSBbXVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIHBhcmVudHMudW5zaGlmdChlbGVtZW50KVxuICAgIH1cbiAgICBhbmNlc3RvcnNbaW5kZXhdID0gcGFyZW50c1xuICB9KVxuXG4gIGFuY2VzdG9ycy5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gIGNvbnN0IHNoYWxsb3dBbmNlc3RvciA9IGFuY2VzdG9ycy5zaGlmdCgpXG5cbiAgdmFyIGFuY2VzdG9yID0gbnVsbFxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc2hhbGxvd0FuY2VzdG9yLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHBhcmVudCA9IHNoYWxsb3dBbmNlc3RvcltpXVxuICAgIGNvbnN0IG1pc3NpbmcgPSBhbmNlc3RvcnMuc29tZSgob3RoZXJQYXJlbnRzKSA9PiB7XG4gICAgICByZXR1cm4gIW90aGVyUGFyZW50cy5zb21lKChvdGhlclBhcmVudCkgPT4gb3RoZXJQYXJlbnQgPT09IHBhcmVudClcbiAgICB9KVxuXG4gICAgaWYgKG1pc3NpbmcpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgc2ltaWxhciBzdWItcGFyZW50cywgbm90IHRoZSB0b3Agcm9vdCwgZS5nLiBzaGFyaW5nIGEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgYW5jZXN0b3IgPSBwYXJlbnRcbiAgfVxuXG4gIHJldHVybiBhbmNlc3RvclxufVxuXG4vKipcbiAqIEdldCBhIHNldCBvZiBjb21tb24gcHJvcGVydGllcyBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25Qcm9wZXJ0aWVzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IGNvbW1vblByb3BlcnRpZXMgPSB7XG4gICAgY2xhc3NlczogW10sXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgdGFnOiBudWxsXG4gIH1cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cbiAgICB2YXIge1xuICAgICAgY2xhc3NlczogY29tbW9uQ2xhc3NlcyxcbiAgICAgIGF0dHJpYnV0ZXM6IGNvbW1vbkF0dHJpYnV0ZXMsXG4gICAgICB0YWc6IGNvbW1vblRhZ1xuICAgIH0gPSBjb21tb25Qcm9wZXJ0aWVzXG5cbiAgICAvLyB+IGNsYXNzZXNcbiAgICBpZiAoY29tbW9uQ2xhc3NlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgY2xhc3NlcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy50cmltKCkuc3BsaXQoJyAnKVxuICAgICAgICBpZiAoIWNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY2xhc3Nlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkNsYXNzZXMgPSBjb21tb25DbGFzc2VzLmZpbHRlcigoZW50cnkpID0+IGNsYXNzZXMuc29tZSgobmFtZSkgPT4gbmFtZSA9PT0gZW50cnkpKVxuICAgICAgICAgIGlmIChjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY29tbW9uQ2xhc3Nlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiByZXN0cnVjdHVyZSByZW1vdmFsIGFzIDJ4IHNldCAvIDJ4IGRlbGV0ZSwgaW5zdGVhZCBvZiBtb2RpZnkgYWx3YXlzIHJlcGxhY2luZyB3aXRoIG5ldyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IGF0dHJpYnV0ZXNcbiAgICBpZiAoY29tbW9uQXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBlbGVtZW50QXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKGVsZW1lbnRBdHRyaWJ1dGVzKS5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBlbGVtZW50QXR0cmlidXRlc1trZXldXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgICAgICAvLyBOT1RFOiB3b3JrYXJvdW5kIGRldGVjdGlvbiBmb3Igbm9uLXN0YW5kYXJkIHBoYW50b21qcyBOYW1lZE5vZGVNYXAgYmVoYXZpb3VyXG4gICAgICAgIC8vIChpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2FyaXlhL3BoYW50b21qcy9pc3N1ZXMvMTQ2MzQpXG4gICAgICAgIGlmIChhdHRyaWJ1dGUgJiYgYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJykge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyaWJ1dGUudmFsdWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgfSwge30pXG5cbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG4gICAgICBjb25zdCBjb21tb25BdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKVxuXG4gICAgICBpZiAoYXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIWNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKG5leHRDb21tb25BdHRyaWJ1dGVzLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbW1vbkF0dHJpYnV0ZXNbbmFtZV1cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gYXR0cmlidXRlc1tuYW1lXSkge1xuICAgICAgICAgICAgICBuZXh0Q29tbW9uQXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dENvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IHRhZ1xuICAgIGlmIChjb21tb25UYWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICghY29tbW9uVGFnKSB7XG4gICAgICAgIGNvbW1vblByb3BlcnRpZXMudGFnID0gdGFnXG4gICAgICB9IGVsc2UgaWYgKHRhZyAhPT0gY29tbW9uVGFnKSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLnRhZ1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gY29tbW9uUHJvcGVydGllc1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbW1vbi5qcyIsIi8qKlxuICogIyBPcHRpbWl6ZVxuICpcbiAqIDEuKSBJbXByb3ZlIGVmZmljaWVuY3kgdGhyb3VnaCBzaG9ydGVyIHNlbGVjdG9ycyBieSByZW1vdmluZyByZWR1bmRhbmN5XG4gKiAyLikgSW1wcm92ZSByb2J1c3RuZXNzIHRocm91Z2ggc2VsZWN0b3IgdHJhbnNmb3JtYXRpb25cbiAqL1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG4vKipcbiAqIEFwcGx5IGRpZmZlcmVudCBvcHRpbWl6YXRpb24gdGVjaG5pcXVlc1xuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcHRpbWl6ZSAoc2VsZWN0b3IsIGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICAvLyBjb252ZXJ0IHNpbmdsZSBlbnRyeSBhbmQgTm9kZUxpc3RcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gIWVsZW1lbnRzLmxlbmd0aCA/IFtlbGVtZW50c10gOiBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoIWVsZW1lbnRzLmxlbmd0aCB8fCBlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIHRvIGNvbXBhcmUgSFRNTEVsZW1lbnRzIGl0cyBuZWNlc3NhcnkgdG8gcHJvdmlkZSBhIHJlZmVyZW5jZSBvZiB0aGUgc2VsZWN0ZWQgbm9kZShzKSEgKG1pc3NpbmcgXCJlbGVtZW50c1wiKWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnRzWzBdLCBvcHRpb25zKVxuXG4gIC8vIGNodW5rIHBhcnRzIG91dHNpZGUgb2YgcXVvdGVzIChodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTY2MzcyOSlcbiAgdmFyIHBhdGggPSBzZWxlY3Rvci5yZXBsYWNlKC8+IC9nLCAnPicpLnNwbGl0KC9cXHMrKD89KD86KD86W15cIl0qXCIpezJ9KSpbXlwiXSokKS8pXG5cbiAgaWYgKHBhdGgubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiBvcHRpbWl6ZVBhcnQoJycsIHNlbGVjdG9yLCAnJywgZWxlbWVudHMpXG4gIH1cblxuICBjb25zdCBzaG9ydGVuZWQgPSBbcGF0aC5wb3AoKV1cbiAgd2hpbGUgKHBhdGgubGVuZ3RoID4gMSkgIHtcbiAgICBjb25zdCBjdXJyZW50ID0gcGF0aC5wb3AoKVxuICAgIGNvbnN0IHByZVBhcnQgPSBwYXRoLmpvaW4oJyAnKVxuICAgIGNvbnN0IHBvc3RQYXJ0ID0gc2hvcnRlbmVkLmpvaW4oJyAnKVxuXG4gICAgY29uc3QgcGF0dGVybiA9IGAke3ByZVBhcnR9ICR7cG9zdFBhcnR9YFxuICAgIGNvbnN0IG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoICE9PSBlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHNob3J0ZW5lZC51bnNoaWZ0KG9wdGltaXplUGFydChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMpKVxuICAgIH1cbiAgfVxuICBzaG9ydGVuZWQudW5zaGlmdChwYXRoWzBdKVxuICBwYXRoID0gc2hvcnRlbmVkXG5cbiAgLy8gb3B0aW1pemUgc3RhcnQgKyBlbmRcbiAgcGF0aFswXSA9IG9wdGltaXplUGFydCgnJywgcGF0aFswXSwgcGF0aC5zbGljZSgxKS5qb2luKCcgJyksIGVsZW1lbnRzKVxuICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGguc2xpY2UoMCwgLTEpLmpvaW4oJyAnKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgJycsIGVsZW1lbnRzKVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKS5yZXBsYWNlKC8+L2csICc+ICcpLnRyaW0oKVxufVxuXG4vKipcbiAqIEltcHJvdmUgYSBjaHVuayBvZiB0aGUgc2VsZWN0b3JcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZVBhcnQgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cykge1xuICBpZiAocHJlUGFydC5sZW5ndGgpIHByZVBhcnQgPSBgJHtwcmVQYXJ0fSBgXG4gIGlmIChwb3N0UGFydC5sZW5ndGgpIHBvc3RQYXJ0ID0gYCAke3Bvc3RQYXJ0fWBcblxuICAvLyByb2J1c3RuZXNzOiBhdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZSAoZ2VuZXJhbGl6YXRpb24pXG4gIGlmICgvXFxbKlxcXS8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGtleSA9IGN1cnJlbnQucmVwbGFjZSgvPS4qJC8sICddJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtrZXl9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IGtleVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByb2J1c3RuZXNzOiByZXBsYWNlIHNwZWNpZmljIGtleS12YWx1ZSB3aXRoIGJhc2UgdGFnIChoZXVyaXN0aWMpXG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwcmVQYXJ0fSR7a2V5fWApXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZmVyZW5jZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXNbaV1cbiAgICAgICAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IHJlZmVyZW5jZS5jb250YWlucyhlbGVtZW50KSkpIHtcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjcmlwdGlvbn0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gZGVzY3JpcHRpb25cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHJvYnVzdG5lc3M6IGRlc2NlbmRhbnQgaW5zdGVhZCBjaGlsZCAoaGV1cmlzdGljKVxuICBpZiAoLz4vLnRlc3QoY3VycmVudCkpIHtcbiAgICBjb25zdCBkZXNjZW5kYW50ID0gY3VycmVudC5yZXBsYWNlKC8+LywgJycpXG4gICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY2VuZGFudH0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICBjdXJyZW50ID0gZGVzY2VuZGFudFxuICAgIH1cbiAgfVxuXG4gIC8vIHJvYnVzdG5lc3M6ICdudGgtb2YtdHlwZScgaW5zdGVhZCAnbnRoLWNoaWxkJyAoaGV1cmlzdGljKVxuICBpZiAoLzpudGgtY2hpbGQvLnRlc3QoY3VycmVudCkpIHtcbiAgICAvLyBUT0RPOiBjb25zaWRlciBjb21wbGV0ZSBjb3ZlcmFnZSBvZiAnbnRoLW9mLXR5cGUnIHJlcGxhY2VtZW50XG4gICAgY29uc3QgdHlwZSA9IGN1cnJlbnQucmVwbGFjZSgvbnRoLWNoaWxkL2csICdudGgtb2YtdHlwZScpXG4gICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7dHlwZX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICBjdXJyZW50ID0gdHlwZVxuICAgIH1cbiAgfVxuXG4gIC8vIGVmZmljaWVuY3k6IGNvbWJpbmF0aW9ucyBvZiBjbGFzc25hbWUgKHBhcnRpYWwgcGVybXV0YXRpb25zKVxuICBpZiAoL1xcLlxcUytcXC5cXFMrLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgdmFyIG5hbWVzID0gY3VycmVudC50cmltKCkuc3BsaXQoJy4nKS5zbGljZSgxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcbiAgICB3aGlsZSAobmFtZXMubGVuZ3RoKSB7XG4gICAgICBuYW1lcyA9IG5hbWVzLnNsaWNlKDEpO1xuICAgICAgY29uc3QgcGFydGlhbCA9IG5hbWVzLmpvaW4oJycpO1xuXG4gICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtwYXJ0aWFsfSR7cG9zdFBhcnR9YC50cmltKClcbiAgICAgIGlmICghcGF0dGVybi5sZW5ndGggfHwgcGF0dGVybi5jaGFyQXQoMCkgPT09ICc+JyB8fCBwYXR0ZXJuLmNoYXJBdChwYXR0ZXJuLmxlbmd0aC0xKSA9PT0gJz4nKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgY3VycmVudCA9IHBhcnRpYWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByb2J1c3RuZXNzOiBkZWdyYWRlIGNvbXBsZXggY2xhc3NuYW1lIChoZXVyaXN0aWMpXG4gICAgbmFtZXMgPSBjdXJyZW50ICYmIGN1cnJlbnQubWF0Y2goL1xcLi9nKVxuICAgIGlmIChuYW1lcyAmJiBuYW1lcy5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwcmVQYXJ0fSR7Y3VycmVudH1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2ldXG4gICAgICAgIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiByZWZlcmVuY2UuY29udGFpbnMoZWxlbWVudCkgKSkge1xuICAgICAgICAgIC8vIFRPRE86XG4gICAgICAgICAgLy8gLSBjaGVjayB1c2luZyBhdHRyaWJ1dGVzICsgcmVnYXJkIGV4Y2x1ZGVzXG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSByZWZlcmVuY2UudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIEV2YWx1YXRlIG1hdGNoZXMgd2l0aCBleHBlY3RlZCBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IG1hdGNoZXMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZVJlc3VsdHMgKG1hdGNoZXMsIGVsZW1lbnRzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBtYXRjaGVzXG4gIHJldHVybiBsZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4ge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtYXRjaGVzW2ldID09PSBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29wdGltaXplLmpzIiwiLyoqXG4gKiAjIEFkYXB0XG4gKlxuICogQ2hlY2sgYW5kIGV4dGVuZCB0aGUgZW52aXJvbm1lbnQgZm9yIHVuaXZlcnNhbCB1c2FnZS5cbiAqL1xuXG4vKipcbiAqIE1vZGlmeSB0aGUgY29udGV4dCBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRUxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkYXB0IChlbGVtZW50LCBvcHRpb25zKSB7XG5cbiAgLy8gZGV0ZWN0IGVudmlyb25tZW50IHNldHVwXG4gIGlmIChnbG9iYWwuZG9jdW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuZG9jdW1lbnQgPSBvcHRpb25zLmNvbnRleHQgfHwgKCgpID0+IHtcbiAgICAgIHZhciByb290ID0gZWxlbWVudFxuICAgICAgd2hpbGUgKHJvb3QucGFyZW50KSB7XG4gICAgICAgIHJvb3QgPSByb290LnBhcmVudFxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3RcbiAgICB9KSgpXG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21oYW5kbGVyL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0w3NVxuICBjb25zdCBFbGVtZW50UHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbC5kb2N1bWVudClcblxuICAvLyBhbHRlcm5hdGl2ZSBkZXNjcmlwdG9yIHRvIGFjY2VzcyBlbGVtZW50cyB3aXRoIGZpbHRlcmluZyBpbnZhbGlkIGVsZW1lbnRzIChlLmcuIHRleHRub2RlcylcbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWVsZW1lbnR0eXBlL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0wxMlxuICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPT09ICd0YWcnIHx8IG5vZGUudHlwZSA9PT0gJ3NjcmlwdCcgfHwgbm9kZS50eXBlID09PSAnc3R5bGUnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycpKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0cmlidXRlc1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9OYW1lZE5vZGVNYXBcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgY29uc3QgeyBhdHRyaWJzIH0gPSB0aGlzXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnMpXG4gICAgICAgIGNvbnN0IE5hbWVkTm9kZU1hcCA9IGF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGF0dHJpYnV0ZU5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgYXR0cmlidXRlc1tpbmRleF0gPSB7XG4gICAgICAgICAgICBuYW1lOiBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGF0dHJpYnNbYXR0cmlidXRlTmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgICAgfSwgeyB9KVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmFtZWROb2RlTWFwLCAnbGVuZ3RoJywge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGhcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIE5hbWVkTm9kZU1hcFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnNbbmFtZV0gfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBmdW5jdGlvbiAodGFnTmFtZSkge1xuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyh0aGlzLmNoaWxkVGFncywgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQubmFtZSA9PT0gdGFnTmFtZSB8fCB0YWdOYW1lID09PSAnKicpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBuYW1lcyA9IGNsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnNwbGl0KCcgJylcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBjb25zdCBkZXNjZW5kYW50Q2xhc3NOYW1lID0gZGVzY2VuZGFudC5hdHRyaWJzLmNsYXNzXG4gICAgICAgIGlmIChkZXNjZW5kYW50Q2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBkZXNjZW5kYW50Q2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSkpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9jc3Mvc2VsZWN0b3JzX2FwaS9xdWVyeVNlbGVjdG9yQWxsXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvcXVlcnlTZWxlY3RvckFsbFxuICAgIEVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCA9IGZ1bmN0aW9uIChzZWxlY3RvcnMpIHtcbiAgICAgIHNlbGVjdG9ycyA9IHNlbGVjdG9ycy5yZXBsYWNlKC8oPikoXFxTKS9nLCAnJDEgJDInKS50cmltKCkgLy8gYWRkIHNwYWNlIGZvciAnPicgc2VsZWN0b3JcblxuICAgICAgLy8gdXNpbmcgcmlnaHQgdG8gbGVmdCBleGVjdXRpb24gPT4gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvY3NzLXNlbGVjdCNob3ctZG9lcy1pdC13b3JrXG4gICAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBnZXRJbnN0cnVjdGlvbnMoc2VsZWN0b3JzKVxuICAgICAgY29uc3QgZGlzY292ZXIgPSBpbnN0cnVjdGlvbnMuc2hpZnQoKVxuXG4gICAgICBjb25zdCB0b3RhbCA9IGluc3RydWN0aW9ucy5sZW5ndGhcbiAgICAgIHJldHVybiBkaXNjb3Zlcih0aGlzKS5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgdmFyIHN0ZXAgPSAwXG4gICAgICAgIHdoaWxlIChzdGVwIDwgdG90YWwpIHtcbiAgICAgICAgICBub2RlID0gaW5zdHJ1Y3Rpb25zW3N0ZXBdKG5vZGUsIHRoaXMpXG4gICAgICAgICAgaWYgKCFub2RlKSB7IC8vIGhpZXJhcmNoeSBkb2Vzbid0IG1hdGNoXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RlcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY29udGFpbnNcbiAgICBFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHZhciBpbmNsdXNpdmUgPSBmYWxzZVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50ID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgaW5jbHVzaXZlID0gdHJ1ZVxuICAgICAgICAgIGRvbmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGluY2x1c2l2ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogUmV0cmlldmUgdHJhbnNmb3JtYXRpb24gc3RlcHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gICBzZWxlY3RvcnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48RnVuY3Rpb24+fSAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEluc3RydWN0aW9ucyAoc2VsZWN0b3JzKSB7XG4gIHJldHVybiBzZWxlY3RvcnMuc3BsaXQoJyAnKS5yZXZlcnNlKCkubWFwKChzZWxlY3Rvciwgc3RlcCkgPT4ge1xuICAgIGNvbnN0IGRpc2NvdmVyID0gc3RlcCA9PT0gMFxuICAgIGNvbnN0IFt0eXBlLCBwc2V1ZG9dID0gc2VsZWN0b3Iuc3BsaXQoJzonKVxuXG4gICAgdmFyIHZhbGlkYXRlID0gbnVsbFxuICAgIHZhciBpbnN0cnVjdGlvbiA9IG51bGxcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuXG4gICAgICAvLyBjaGlsZDogJz4nXG4gICAgICBjYXNlIC8+Ly50ZXN0KHR5cGUpOlxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrUGFyZW50IChub2RlKSB7XG4gICAgICAgICAgcmV0dXJuICh2YWxpZGF0ZSkgPT4gdmFsaWRhdGUobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gY2xhc3M6ICcuJ1xuICAgICAgY2FzZSAvXlxcLi8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgbmFtZXMgPSB0eXBlLnN1YnN0cigxKS5zcGxpdCgnLicpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBub2RlQ2xhc3NOYW1lID0gbm9kZS5hdHRyaWJzLmNsYXNzXG4gICAgICAgICAgcmV0dXJuIG5vZGVDbGFzc05hbWUgJiYgbmFtZXMuZXZlcnkoKG5hbWUpID0+IG5vZGVDbGFzc05hbWUuaW5kZXhPZihuYW1lKSA+IC0xKVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tDbGFzcyAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShuYW1lcy5qb2luKCcgJykpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBhdHRyaWJ1dGU6ICdba2V5PVwidmFsdWVcIl0nXG4gICAgICBjYXNlIC9eXFxbLy50ZXN0KHR5cGUpOlxuICAgICAgICBjb25zdCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gPSB0eXBlLnJlcGxhY2UoL1xcW3xcXF18XCIvZywgJycpLnNwbGl0KCc9JylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhhc0F0dHJpYnV0ZSA9IE9iamVjdC5rZXlzKG5vZGUuYXR0cmlicykuaW5kZXhPZihhdHRyaWJ1dGVLZXkpID4gLTFcbiAgICAgICAgICBpZiAoaGFzQXR0cmlidXRlKSB7IC8vIHJlZ2FyZCBvcHRpb25hbCBhdHRyaWJ1dGVWYWx1ZVxuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSB8fCAobm9kZS5hdHRyaWJzW2F0dHJpYnV0ZUtleV0gPT09IGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBpZDogJyMnXG4gICAgICBjYXNlIC9eIy8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgaWQgPSB0eXBlLnN1YnN0cigxKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUuYXR0cmlicy5pZCA9PT0gaWRcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrSWQgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIHVuaXZlcnNhbDogJyonXG4gICAgICBjYXNlIC9cXCovLnRlc3QodHlwZSk6XG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHRydWVcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1VuaXZlcnNhbCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpKVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyB0YWc6ICcuLi4nXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PT0gdHlwZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tUYWcgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwc2V1ZG8pIHtcbiAgICAgIHJldHVybiBpbnN0cnVjdGlvblxuICAgIH1cblxuICAgIGNvbnN0IHJ1bGUgPSBwc2V1ZG8ubWF0Y2goLy0oY2hpbGR8dHlwZSlcXCgoXFxkKylcXCkkLylcbiAgICBjb25zdCBraW5kID0gcnVsZVsxXVxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQocnVsZVsyXSwgMTApIC0gMVxuXG4gICAgY29uc3QgdmFsaWRhdGVQc2V1ZG8gPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgdmFyIGNvbXBhcmVTZXQgPSBub2RlLnBhcmVudC5jaGlsZFRhZ3NcbiAgICAgICAgaWYgKGtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICAgIGNvbXBhcmVTZXQgPSBjb21wYXJlU2V0LmZpbHRlcih2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlSW5kZXggPSBjb21wYXJlU2V0LmZpbmRJbmRleCgoY2hpbGQpID0+IGNoaWxkID09PSBub2RlKVxuICAgICAgICBpZiAobm9kZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBlbmhhbmNlSW5zdHJ1Y3Rpb24gKG5vZGUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gaW5zdHJ1Y3Rpb24obm9kZSlcbiAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICByZXR1cm4gbWF0Y2gucmVkdWNlKChOb2RlTGlzdCwgbWF0Y2hlZE5vZGUpID0+IHtcbiAgICAgICAgICBpZiAodmFsaWRhdGVQc2V1ZG8obWF0Y2hlZE5vZGUpKSB7XG4gICAgICAgICAgICBOb2RlTGlzdC5wdXNoKG1hdGNoZWROb2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfSwgW10pXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWRhdGVQc2V1ZG8obWF0Y2gpICYmIG1hdGNoXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFdhbGtpbmcgcmVjdXJzaXZlIHRvIGludm9rZSBjYWxsYmFja3NcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxIVE1MRWxlbWVudD59IG5vZGVzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICAgICAgIGhhbmRsZXIgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlRGVzY2VuZGFudHMgKG5vZGVzLCBoYW5kbGVyKSB7XG4gIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSB0cnVlXG4gICAgaGFuZGxlcihub2RlLCAoKSA9PiBwcm9ncmVzcyA9IGZhbHNlKVxuICAgIGlmIChub2RlLmNoaWxkVGFncyAmJiBwcm9ncmVzcykge1xuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhub2RlLmNoaWxkVGFncywgaGFuZGxlcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQnViYmxlIHVwIGZyb20gYm90dG9tIHRvIHRvcFxuICpcbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSBub2RlICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSByb290ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICB2YWxpZGF0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFTGVtZW50fSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0QW5jZXN0b3IgKG5vZGUsIHJvb3QsIHZhbGlkYXRlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICAgIGlmICh2YWxpZGF0ZShub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IHJvb3QpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWRhcHQuanMiLCIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeSBzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogRm9yIGxvbmdldml0eSBpdCBhcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMuXG4gKi9cblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0IH0gZnJvbSAnLi91dGlsaXRpZXMnXG5pbXBvcnQgeyBnZXRDb21tb25BbmNlc3RvciwgZ2V0Q29tbW9uUHJvcGVydGllcyB9IGZyb20gJy4vY29tbW9uJ1xuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpbmdsZVNlbGVjdG9yIChlbGVtZW50LCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudCwgb3B0aW9ucylcblxuICBjb25zdCBzZWxlY3RvciA9IG1hdGNoKGVsZW1lbnQsIG9wdGlvbnMpXG4gIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHNlbGVjdG9yLCBlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKGBcbiAgLy8gICBzZWxlY3RvcjogICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiAke29wdGltaXplZH1cbiAgLy8gYClcblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gb3B0aW1pemVkXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgdG8gbWF0Y2ggbXVsdGlwbGUgZGVzY2VuZGFudHMgZnJvbSBhbiBhbmNlc3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD58Tm9kZUxpc3R9IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgLSBvbmx5IGFuIEFycmF5IG9mIEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBpcyBzdXBwb3J0ZWQhYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG5cbiAgY29uc3QgYW5jZXN0b3IgPSBnZXRDb21tb25BbmNlc3RvcihlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3QgYW5jZXN0b3JTZWxlY3RvciA9IGdldFNpbmdsZVNlbGVjdG9yKGFuY2VzdG9yLCBvcHRpb25zKVxuXG4gIC8vIFRPRE86IGNvbnNpZGVyIHVzYWdlIG9mIG11bHRpcGxlIHNlbGVjdG9ycyArIHBhcmVudC1jaGlsZCByZWxhdGlvbiArIGNoZWNrIGZvciBwYXJ0IHJlZHVuZGFuY3lcbiAgY29uc3QgY29tbW9uU2VsZWN0b3JzID0gZ2V0Q29tbW9uU2VsZWN0b3JzKGVsZW1lbnRzKVxuICBjb25zdCBkZXNjZW5kYW50U2VsZWN0b3IgPSBjb21tb25TZWxlY3RvcnNbMF1cblxuICBjb25zdCBzZWxlY3RvciA9IG9wdGltaXplKGAke2FuY2VzdG9yU2VsZWN0b3J9ICR7ZGVzY2VuZGFudFNlbGVjdG9yfWAsIGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3Rvck1hdGNoZXMgPSBjb252ZXJ0Tm9kZUxpc3QoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpXG5cbiAgaWYgKCFlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4gc2VsZWN0b3JNYXRjaGVzLnNvbWUoKGVudHJ5KSA9PiBlbnRyeSA9PT0gZWxlbWVudCkgKSkge1xuICAgIC8vIFRPRE86IGNsdXN0ZXIgbWF0Y2hlcyB0byBzcGxpdCBpbnRvIHNpbWlsYXIgZ3JvdXBzIGZvciBzdWIgc2VsZWN0aW9uc1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgVGhlIHNlbGVjdGVkIGVsZW1lbnRzIGNhblxcJ3QgYmUgZWZmaWNpZW50bHkgbWFwcGVkLlxuICAgICAgSXRzIHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCFcbiAgICBgLCBlbGVtZW50cylcbiAgfVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvclxufVxuXG4vKipcbiAqIEdldCBzZWxlY3RvcnMgdG8gZGVzY3JpYmUgYSBzZXQgb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnRzPn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENvbW1vblNlbGVjdG9ycyAoZWxlbWVudHMpIHtcblxuICBjb25zdCB7IGNsYXNzZXMsIGF0dHJpYnV0ZXMsIHRhZyB9ID0gZ2V0Q29tbW9uUHJvcGVydGllcyhlbGVtZW50cylcblxuICBjb25zdCBzZWxlY3RvclBhdGggPSBbXVxuXG4gIGlmICh0YWcpIHtcbiAgICBzZWxlY3RvclBhdGgucHVzaCh0YWcpXG4gIH1cblxuICBpZiAoY2xhc3Nlcykge1xuICAgIGNvbnN0IGNsYXNzU2VsZWN0b3IgPSBjbGFzc2VzLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YCkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChjbGFzc1NlbGVjdG9yKVxuICB9XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVTZWxlY3RvciA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnJlZHVjZSgocGFydHMsIG5hbWUpID0+IHtcbiAgICAgIHBhcnRzLnB1c2goYFske25hbWV9PVwiJHthdHRyaWJ1dGVzW25hbWVdfVwiXWApXG4gICAgICByZXR1cm4gcGFydHNcbiAgICB9LCBbXSkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChhdHRyaWJ1dGVTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChzZWxlY3RvclBhdGgubGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogY2hlY2sgZm9yIHBhcmVudC1jaGlsZCByZWxhdGlvblxuICB9XG5cbiAgcmV0dXJuIFtcbiAgICBzZWxlY3RvclBhdGguam9pbignJylcbiAgXVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAobXVsdGlwbGUvc2luZ2xlKVxuICpcbiAqIE5PVEU6IGV4dGVuZGVkIGRldGVjdGlvbiBpcyB1c2VkIGZvciBzcGVjaWFsIGNhc2VzIGxpa2UgdGhlIDxzZWxlY3Q+IGVsZW1lbnQgd2l0aCA8b3B0aW9ucz5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxOb2RlTGlzdHxBcnJheS48SFRNTEVsZW1lbnQ+fSBpbnB1dCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCAmJiAhaW5wdXQubmFtZSkge1xuICAgIHJldHVybiBnZXRNdWx0aVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuICB9XG4gIHJldHVybiBnZXRTaW5nbGVTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZWxlY3QuanMiLCIvKipcbiAqICMgTWF0Y2hcbiAqXG4gKiBSZXRyaWV2ZSBzZWxlY3RvciBmb3IgYSBub2RlLlxuICovXG5cbmltcG9ydCB7IGVzY2FwZVZhbHVlIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbmNvbnN0IGRlZmF1bHRJZ25vcmUgPSB7XG4gIGF0dHJpYnV0ZSAoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBbXG4gICAgICAnc3R5bGUnLFxuICAgICAgJ2RhdGEtcmVhY3RpZCcsXG4gICAgICAnZGF0YS1yZWFjdC1jaGVja3N1bSdcbiAgICBdLmluZGV4T2YoYXR0cmlidXRlTmFtZSkgPiAtMVxuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIG9mIHRoZSBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaCAobm9kZSwgb3B0aW9ucykge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnQsXG4gICAgc2tpcCA9IG51bGwsXG4gICAgcHJpb3JpdHkgPSBbJ2lkJywgJ2NsYXNzJywgJ2hyZWYnLCAnc3JjJ10sXG4gICAgaWdub3JlID0ge31cbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBwYXRoID0gW11cbiAgdmFyIGVsZW1lbnQgPSBub2RlXG4gIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICB2YXIgaWdub3JlQ2xhc3MgPSBmYWxzZVxuXG4gIGNvbnN0IHNraXBDb21wYXJlID0gc2tpcCAmJiAoQXJyYXkuaXNBcnJheShza2lwKSA/IHNraXAgOiBbc2tpcF0pLm1hcCgoZW50cnkpID0+IHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gKGVsZW1lbnQpID0+IGVsZW1lbnQgPT09IGVudHJ5XG4gICAgfVxuICAgIHJldHVybiBlbnRyeVxuICB9KVxuXG4gIGNvbnN0IHNraXBDaGVja3MgPSAoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiBza2lwICYmIHNraXBDb21wYXJlLnNvbWUoKGNvbXBhcmUpID0+IGNvbXBhcmUoZWxlbWVudCkpXG4gIH1cblxuICBPYmplY3Qua2V5cyhpZ25vcmUpLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICBpZiAodHlwZSA9PT0gJ2NsYXNzJykge1xuICAgICAgaWdub3JlQ2xhc3MgPSB0cnVlXG4gICAgfVxuICAgIHZhciBwcmVkaWNhdGUgPSBpZ25vcmVbdHlwZV1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdudW1iZXInKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUudG9TdHJpbmcoKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHByZWRpY2F0ZSA9IG5ldyBSZWdFeHAoZXNjYXBlVmFsdWUocHJlZGljYXRlKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUgPyAvKD86KS8gOiAvLl4vXG4gICAgfVxuICAgIC8vIGNoZWNrIGNsYXNzLS9hdHRyaWJ1dGVuYW1lIGZvciByZWdleFxuICAgIGlnbm9yZVt0eXBlXSA9IChuYW1lLCB2YWx1ZSkgPT4gcHJlZGljYXRlLnRlc3QodmFsdWUpXG4gIH0pXG5cbiAgaWYgKGlnbm9yZUNsYXNzKSB7XG4gICAgY29uc3QgaWdub3JlQXR0cmlidXRlID0gaWdub3JlLmF0dHJpYnV0ZVxuICAgIGlnbm9yZS5hdHRyaWJ1dGUgPSAobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpID0+IHtcbiAgICAgIHJldHVybiBpZ25vcmUuY2xhc3ModmFsdWUpIHx8IGlnbm9yZUF0dHJpYnV0ZSAmJiBpZ25vcmVBdHRyaWJ1dGUobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICBpZiAoc2tpcENoZWNrcyhlbGVtZW50KSAhPT0gdHJ1ZSkge1xuICAgICAgLy8gfiBnbG9iYWxcbiAgICAgIGlmIChjaGVja0F0dHJpYnV0ZXMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcm9vdCkpIGJyZWFrXG4gICAgICBpZiAoY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoLCByb290KSkgYnJlYWtcblxuICAgICAgLy8gfiBsb2NhbFxuICAgICAgY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja1RhZyhlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICB9XG5cbiAgICAgIC8vIGRlZmluZSBvbmx5IG9uZSBwYXJ0IGVhY2ggaXRlcmF0aW9uXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja0NoaWxkcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVsZW1lbnQgPT09IHJvb3QpIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSlcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kQXR0cmlidXRlc1BhdHRlcm4gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICBjb25zdCB3aXRob3V0UHJpb3JpdHkgPSBbXTtcbiAgY29uc3Qgc29ydGVkS2V5cyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG4gICAgLm1hcChpID0+IHtcbiAgICAgIGkgPSAraTtcbiAgICAgIGNvbnN0IHBvcyA9IHByaW9yaXR5LmluZGV4T2YoYXR0cmlidXRlc1tpXS5uYW1lKTtcbiAgICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICAgIHdpdGhvdXRQcmlvcml0eS5wdXNoKGkpXG4gICAgICB9XG4gICAgICByZXR1cm4geyBwb3MsIGkgfTtcbiAgICB9KVxuICAgIC5maWx0ZXIoaXRlbSA9PiBpdGVtLnBvcyAhPT0gLTEpXG4gICAgLnNvcnQoKGEsIGIpID0+IGEucG9zIC0gYi5wb3MpXG4gICAgLm1hcChpdGVtID0+IGl0ZW0uaSlcbiAgICAuY29uY2F0KHdpdGhvdXRQcmlvcml0eSk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzb3J0ZWRLZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IHNvcnRlZEtleXNbaV1cbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZS52YWx1ZSlcblxuICAgIGNvbnN0IGN1cnJlbnRJZ25vcmUgPSBpZ25vcmVbYXR0cmlidXRlTmFtZV0gfHwgaWdub3JlLmF0dHJpYnV0ZVxuICAgIGNvbnN0IGN1cnJlbnREZWZhdWx0SWdub3JlID0gZGVmYXVsdElnbm9yZVthdHRyaWJ1dGVOYW1lXSB8fCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZVxuICAgIGlmIChjaGVja0lnbm9yZShjdXJyZW50SWdub3JlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgY3VycmVudERlZmF1bHRJZ25vcmUpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHZhciBwYXR0ZXJuID0gYFske2F0dHJpYnV0ZU5hbWV9PVwiJHthdHRyaWJ1dGVWYWx1ZX1cIl1gXG5cbiAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ2lkJykge1xuICAgICAgcGF0dGVybiA9IGAjJHthdHRyaWJ1dGVWYWx1ZX1gXG4gICAgfVxuXG4gICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgIC8vIElmIHRoZXJlIGFyZW4ndCBhY3R1YWxseSBhbnkgY2xhc3Nlcywgc2tpcC5cbiAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCB2YWxpZENsYXNzTmFtZXMgPSBhdHRyaWJ1dGVWYWx1ZS50cmltKCkuc3BsaXQoL1xccysvKS5maWx0ZXIoKHZhbCkgPT4ge1xuICAgICAgICByZXR1cm4gL1xcRC8udGVzdCh2YWxbMF0pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGlmICh2YWxpZENsYXNzTmFtZXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICAgIFxuICAgICAgcGF0dGVybiA9IGAuJHt2YWxpZENsYXNzTmFtZXMuam9pbignLicpfWBcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0dGVyblxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnIChlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICBpZiAocGF0dGVybikge1xuICAgIGNvbnN0IG1hdGNoZXMgPSBwYXJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kVGFnUGF0dGVybiAoZWxlbWVudCwgaWdub3JlKSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLnRhZywgbnVsbCwgdGFnTmFtZSkpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHJldHVybiB0YWdOYW1lXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBzcGVjaWZpYyBjaGlsZCBpZGVudGlmaWVyXG4gKlxuICogTk9URTogJ2NoaWxkVGFncycgaXMgYSBjdXN0b20gcHJvcGVydHkgdG8gdXNlIGFzIGEgdmlldyBmaWx0ZXIgZm9yIHRhZ3MgdXNpbmcgJ2FkYXB0ZXIuanMnXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NoaWxkcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCkge1xuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgY2hpbGRyZW4gPSBwYXJlbnQuY2hpbGRUYWdzIHx8IHBhcmVudC5jaGlsZHJlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICBpZiAoY2hpbGQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNoaWxkUGF0dGVybiA9IGZpbmRQYXR0ZXJuKHByaW9yaXR5LCBjaGlsZCwgaWdub3JlKVxuICAgICAgaWYgKCFjaGlsZFBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICAgICAgRWxlbWVudCBjb3VsZG5cXCd0IGJlIG1hdGNoZWQgdGhyb3VnaCBzdHJpY3QgaWdub3JlIHBhdHRlcm4hXG4gICAgICAgIGAsIGNoaWxkLCBpZ25vcmUsIGNoaWxkUGF0dGVybilcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhdHRlcm4gPSBgPiAke2NoaWxkUGF0dGVybn06bnRoLWNoaWxkKCR7aSsxfSlgXG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kUGF0dGVybiAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSkge1xuICB2YXIgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKVxuICBpZiAoIXBhdHRlcm4pIHtcbiAgICBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICB9XG4gIHJldHVybiBwYXR0ZXJuXG59XG5cbi8qKlxuICogVmFsaWRhdGUgd2l0aCBjdXN0b20gYW5kIGRlZmF1bHQgZnVuY3Rpb25zXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IHByZWRpY2F0ZSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmc/fSAgbmFtZSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICB2YWx1ZSAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7RnVuY3Rpb259IGRlZmF1bHRQcmVkaWNhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tJZ25vcmUgKHByZWRpY2F0ZSwgbmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgY29uc3QgY2hlY2sgPSBwcmVkaWNhdGUgfHwgZGVmYXVsdFByZWRpY2F0ZVxuICBpZiAoIWNoZWNrKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGNoZWNrKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21hdGNoLmpzIiwiZXhwb3J0IHNlbGVjdCwgeyBnZXRTaW5nbGVTZWxlY3RvciwgZ2V0TXVsdGlTZWxlY3RvciB9IGZyb20gJy4vc2VsZWN0J1xuZXhwb3J0IG9wdGltaXplIGZyb20gJy4vb3B0aW1pemUnXG5leHBvcnQgKiBhcyBjb21tb24gZnJvbSAnLi9jb21tb24nXG5cbmV4cG9ydCBkZWZhdWx0IGZyb20gJy4vc2VsZWN0J1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==