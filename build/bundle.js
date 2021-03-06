/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/** JSX/hyperscript reviver
*	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

/** Copy own-properties from `props` onto `obj`.
 *	@returns obj
 *	@private
 */
function extend(obj, props) {
	for (var i in props) {
		obj[i] = props[i];
	}return obj;
}

/** Call a function asynchronously, as soon as possible.
 *	@param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
	return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

// DOM properties that should NOT have "px" added when numeric
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */
function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

/** Check if an Element has a given normalized name.
*	@param {Element} node
*	@param {String} nodeName
 */
function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) old(null);
		if (value) value(node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) flushMounts();
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if (component.__ref = props.ref) delete props.ref;
	if (component.__key = props.key) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) flushMounts();
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) component.__ref(null);
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) this.prevState = extend({}, s);
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		enqueueRender(this);
	},

	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		renderComponent(this, 2);
	},

	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
	return diff(merge, vnode, {}, false, parent, false);
}

var preact = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};

exports.h = h;
exports.createElement = h;
exports.cloneElement = cloneElement;
exports.Component = Component;
exports.render = render;
exports.rerender = rerender;
exports.options = options;
exports.default = preact;
//# sourceMappingURL=preact.esm.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var View;
(function (View) {
    View[View["Start"] = 0] = "Start";
    View[View["Examples"] = 1] = "Examples";
    View[View["Reviews"] = 2] = "Reviews";
    View[View["Snake"] = 3] = "Snake";
})(View = exports.View || (exports.View = {}));
;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _preact = __webpack_require__(0);

__webpack_require__(3);

// this holds our rendered root element so we can re-render in response to HMR updates.
// This is the entry file, which kicks off all rendering.
//
// We import h() here because that's the function our JSX elements transpile to.
// That is to say - this:
//     <div a="b">foo</div>
// ... is converted to this:
//     h('div', { a: 'b' }, 'foo')

var root = void 0;

// Making our app's initialization a function means it's repeatable.
function init() {
	// HMR requires that this be a require()
	var App = __webpack_require__(4).default;

	// render the app and save the new root element:
	root = (0, _preact.render)((0, _preact.h)(App, null), document.body, root);
}

// initial render!
init();

// If this is webpack-dev-server, set up HMR :)
if (false) module.hot.accept('./components/app', init);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var header_1 = __webpack_require__(5);
var content_1 = __webpack_require__(6);
var examples_1 = __webpack_require__(7);
var reviews_1 = __webpack_require__(9);
var footer_1 = __webpack_require__(10);
var snake_1 = __webpack_require__(11);
var view_1 = __webpack_require__(1);
var App = /** @class */function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderCallback = function (view) {
            _this.setState({ currentView: view });
        };
        _this.renderStart = function () {
            return preact_1.h(content_1.default, null);
        };
        _this.renderExamples = function () {
            return preact_1.h(examples_1.default, null);
        };
        _this.renderReviews = function () {
            return preact_1.h(reviews_1.default, null);
        };
        _this.renderSnake = function () {
            return preact_1.h(snake_1.default, null);
        };
        _this.renderContent = function () {
            var html = _this.renderStart();
            if (_this.state.currentView === view_1.View.Examples) html = _this.renderExamples();
            if (_this.state.currentView === view_1.View.Reviews) html = _this.renderReviews();
            if (_this.state.currentView === view_1.View.Snake) html = _this.renderSnake();
            return preact_1.h("div", { className: "content-container" }, html);
        };
        return _this;
    }
    App.prototype.render = function () {
        return preact_1.h("div", null, preact_1.h(header_1.default, { renderCallback: this.renderCallback }), this.renderContent(), preact_1.h(footer_1.default, null));
    };
    return App;
}(preact_1.Component);
exports.default = App;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var view_1 = __webpack_require__(1);
var Header = /** @class */function (_super) {
    __extends(Header, _super);
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Header.prototype.render = function () {
        var _this = this;
        return preact_1.h("header", { className: "top-header" }, preact_1.h("nav", { className: "wrapper" }, preact_1.h("div", { className: "logo" }), preact_1.h("input", { type: "checkbox", id: "menu-toggle" }), preact_1.h("label", { for: "menu-toggle", class: "label-toggle" }), preact_1.h("ul", { id: "nav-menu" }, preact_1.h("li", null, preact_1.h("a", { href: "#", onClick: function onClick() {
                return _this.props.renderCallback(view_1.View.Start);
            } }, "Me")), preact_1.h("li", null, preact_1.h("a", { href: "#", onClick: function onClick() {
                return _this.props.renderCallback(view_1.View.Snake);
            } }, "Snake!")), preact_1.h("li", null, preact_1.h("a", { href: "#", onClick: function onClick() {
                return _this.props.renderCallback(view_1.View.Examples);
            } }, "Stuff I did")), preact_1.h("li", null, preact_1.h("a", { href: "#", onClick: function onClick() {
                return _this.props.renderCallback(view_1.View.Reviews);
            } }, "Reviews")))));
    };
    return Header;
}(preact_1.Component);
exports.default = Header;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var Content = /** @class */function (_super) {
    __extends(Content, _super);
    function Content() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Content.prototype.render = function () {
        return preact_1.h("h1", null, "MEE");
    };
    return Content;
}(preact_1.Component);
exports.default = Content;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var example_1 = __webpack_require__(8);
var Examples = /** @class */function (_super) {
    __extends(Examples, _super);
    function Examples() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Examples.prototype.render = function () {
        return preact_1.h("div", { className: "examples" }, preact_1.h("div", { className: "example-row" }, preact_1.h(example_1.default, null), preact_1.h(example_1.default, null)), preact_1.h("div", { className: "example-row" }, preact_1.h(example_1.default, null), preact_1.h(example_1.default, null)));
    };
    return Examples;
}(preact_1.Component);
exports.default = Examples;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var Example = /** @class */function (_super) {
    __extends(Example, _super);
    function Example() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Example.prototype.render = function () {
        return preact_1.h("div", { className: "example" }, preact_1.h("div", { className: "box" }, preact_1.h("img", null), preact_1.h("div", { className: "info" }, preact_1.h("div", { className: "title" }, "Example"), preact_1.h("a", { href: "example.com" }, "example.com"), preact_1.h("div", { className: "text" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim leo, lobortis quis pretium in, viverra ut nibh. Cras sollicitudin arcu dignissim dui dapibus, vel dapibus arcu mattis. Nunc dapibus lacinia purus, non scelerisque odio congue ac. Etiam cursus tempus fringilla. Maecenas et purus nibh. Duis orci augue, ullamcorper sed nulla ac, ultricies tincidunt massa. Praesent erat nibh, euismod et vehicula non, eleifend at elit."))));
    };
    return Example;
}(preact_1.Component);
exports.default = Example;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var Reviews = /** @class */function (_super) {
    __extends(Reviews, _super);
    function Reviews() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Reviews.prototype.render = function () {
        return preact_1.h("div", { className: "reviews" }, preact_1.h("div", { className: "review-container" }, preact_1.h("div", { className: "review-image" }, preact_1.h("img", null)), preact_1.h("div", { className: "review-content" }, preact_1.h("h1", null, "Review title"), preact_1.h("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim leo, lobortis quis pretium in, viverra ut nibh. Cras sollicitudin arcu dignissim dui dapibus, vel dapibus arcu mattis. Nunc dapibus lacinia purus, non scelerisque odio congue ac. Etiam cursus tempus fringilla. Maecenas et purus nibh. Duis orci augue, ullamcorper sed nulla ac, ultricies tincidunt massa. Praesent erat nibh, euismod et vehicula non, eleifend at elit. Vivamus aliquet tortor at condimentum vulputate. Aliquam lobortis a dolor nec porta. Proin in ipsum in leo euismod ultrices ut scelerisque leo. Donec rutrum feugiat orci, id vestibulum est pellentesque ac. In commodo vehicula eleifend. Phasellus quam sem, semper at auctor nec, volutpat et dolor.")), preact_1.h("div", { className: "review-score" }, preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-half-o", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-o", "aria-hidden": "true" }))), preact_1.h("div", { className: "review-container" }, preact_1.h("div", { className: "review-image" }, preact_1.h("img", null)), preact_1.h("div", { className: "review-content" }, preact_1.h("h1", null, "Review title"), preact_1.h("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim leo, lobortis quis pretium in, viverra ut nibh. Cras sollicitudin arcu dignissim dui dapibus, vel dapibus arcu mattis. Nunc dapibus lacinia purus, non scelerisque odio congue ac. Etiam cursus tempus fringilla. Maecenas et purus nibh. Duis orci augue, ullamcorper sed nulla ac, ultricies tincidunt massa. Praesent erat nibh, euismod et vehicula non, eleifend at elit. Vivamus aliquet tortor at condimentum vulputate. Aliquam lobortis a dolor nec porta. Proin in ipsum in leo euismod ultrices ut scelerisque leo. Donec rutrum feugiat orci, id vestibulum est pellentesque ac. In commodo vehicula eleifend. Phasellus quam sem, semper at auctor nec, volutpat et dolor.")), preact_1.h("div", { className: "review-score" }, preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-half-o", "aria-hidden": "true" }))), preact_1.h("div", { className: "review-container" }, preact_1.h("div", { className: "review-image" }, preact_1.h("img", null)), preact_1.h("div", { className: "review-content" }, preact_1.h("h1", null, "Review title"), preact_1.h("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim leo, lobortis quis pretium in, viverra ut nibh. Cras sollicitudin arcu dignissim dui dapibus, vel dapibus arcu mattis. Nunc dapibus lacinia purus, non scelerisque odio congue ac. Etiam cursus tempus fringilla. Maecenas et purus nibh. Duis orci augue, ullamcorper sed nulla ac, ultricies tincidunt massa. Praesent erat nibh, euismod et vehicula non, eleifend at elit. Vivamus aliquet tortor at condimentum vulputate. Aliquam lobortis a dolor nec porta. Proin in ipsum in leo euismod ultrices ut scelerisque leo. Donec rutrum feugiat orci, id vestibulum est pellentesque ac. In commodo vehicula eleifend. Phasellus quam sem, semper at auctor nec, volutpat et dolor.")), preact_1.h("div", { className: "review-score" }, preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-o", "aria-hidden": "true" }))), preact_1.h("div", { className: "review-container" }, preact_1.h("div", { className: "review-image" }, preact_1.h("img", null)), preact_1.h("div", { className: "review-content" }, preact_1.h("h1", null, "Review title"), preact_1.h("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim leo, lobortis quis pretium in, viverra ut nibh. Cras sollicitudin arcu dignissim dui dapibus, vel dapibus arcu mattis. Nunc dapibus lacinia purus, non scelerisque odio congue ac. Etiam cursus tempus fringilla. Maecenas et purus nibh. Duis orci augue, ullamcorper sed nulla ac, ultricies tincidunt massa. Praesent erat nibh, euismod et vehicula non, eleifend at elit. Vivamus aliquet tortor at condimentum vulputate. Aliquam lobortis a dolor nec porta. Proin in ipsum in leo euismod ultrices ut scelerisque leo. Donec rutrum feugiat orci, id vestibulum est pellentesque ac. In commodo vehicula eleifend. Phasellus quam sem, semper at auctor nec, volutpat et dolor.")), preact_1.h("div", { className: "review-score" }, preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-half-o", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-o", "aria-hidden": "true" }))), preact_1.h("div", { className: "review-container" }, preact_1.h("div", { className: "review-image" }, preact_1.h("img", null)), preact_1.h("div", { className: "review-content" }, preact_1.h("h1", null, "Review title"), preact_1.h("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim leo, lobortis quis pretium in, viverra ut nibh. Cras sollicitudin arcu dignissim dui dapibus, vel dapibus arcu mattis. Nunc dapibus lacinia purus, non scelerisque odio congue ac. Etiam cursus tempus fringilla. Maecenas et purus nibh. Duis orci augue, ullamcorper sed nulla ac, ultricies tincidunt massa. Praesent erat nibh, euismod et vehicula non, eleifend at elit. Vivamus aliquet tortor at condimentum vulputate. Aliquam lobortis a dolor nec porta. Proin in ipsum in leo euismod ultrices ut scelerisque leo. Donec rutrum feugiat orci, id vestibulum est pellentesque ac. In commodo vehicula eleifend. Phasellus quam sem, semper at auctor nec, volutpat et dolor.")), preact_1.h("div", { className: "review-score" }, preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-o", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-o", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-o", "aria-hidden": "true" }))), preact_1.h("div", { className: "review-container" }, preact_1.h("div", { className: "review-image" }, preact_1.h("img", null)), preact_1.h("div", { className: "review-content" }, preact_1.h("h1", null, "Review title"), preact_1.h("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim leo, lobortis quis pretium in, viverra ut nibh. Cras sollicitudin arcu dignissim dui dapibus, vel dapibus arcu mattis. Nunc dapibus lacinia purus, non scelerisque odio congue ac. Etiam cursus tempus fringilla. Maecenas et purus nibh. Duis orci augue, ullamcorper sed nulla ac, ultricies tincidunt massa. Praesent erat nibh, euismod et vehicula non, eleifend at elit. Vivamus aliquet tortor at condimentum vulputate. Aliquam lobortis a dolor nec porta. Proin in ipsum in leo euismod ultrices ut scelerisque leo. Donec rutrum feugiat orci, id vestibulum est pellentesque ac. In commodo vehicula eleifend. Phasellus quam sem, semper at auctor nec, volutpat et dolor.")), preact_1.h("div", { className: "review-score" }, preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-o", "aria-hidden": "true" }), preact_1.h("i", { class: "fa fa-star-o", "aria-hidden": "true" }))));
    };
    return Reviews;
}(preact_1.Component);
exports.default = Reviews;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var Footer = /** @class */function (_super) {
    __extends(Footer, _super);
    function Footer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Footer.prototype.render = function () {
        return preact_1.h("footer", null, preact_1.h("div", { className: "label" }, preact_1.h("i", { className: "fa fa-facebook-official" }), preact_1.h("a", { href: "http://facebook.com/kakanss" }, "Jonathan Boellke")), preact_1.h("div", { className: "label" }, preact_1.h("i", { className: "fa fa-phone" }), preact_1.h("span", null, "070 - 555 72 75")), preact_1.h("div", { className: "label" }, preact_1.h("i", { className: "fa fa-envelope" }), preact_1.h("span", null, "jonathanboellke@gmail.com")));
    };
    return Footer;
}(preact_1.Component);
exports.default = Footer;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var Coordinate = /** @class */function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    Coordinate.prototype.Equals = function (cord) {
        return cord.x === this.x && cord.y === this.y;
    };
    return Coordinate;
}();
exports.Coordinate = Coordinate;
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Right"] = 2] = "Right";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction = exports.Direction || (exports.Direction = {}));
var GameState;
(function (GameState) {
    GameState[GameState["Won"] = 0] = "Won";
    GameState[GameState["Lost"] = 1] = "Lost";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Paused"] = 3] = "Paused";
})(GameState = exports.GameState || (exports.GameState = {}));
var Snake = /** @class */function (_super) {
    __extends(Snake, _super);
    function Snake() {
        var _this = _super.call(this) || this;
        _this.boxSize = 32;
        _this.columns = 23;
        _this.rows = 23;
        _this.direction = Direction.Left;
        _this.gameState = GameState.Playing;
        _this.dead_audio = new Audio();
        _this.dead_audio.src = "../src/audio/dead.mp3";
        _this.eat_audio = new Audio();
        _this.eat_audio.src = "../src/audio/eat.mp3";
        _this.left_audio = new Audio();
        _this.left_audio.src = "../src/audio/left.mp3";
        _this.up_audio = new Audio();
        _this.up_audio.src = "../src/audio/up.mp3";
        _this.right_audio = new Audio();
        _this.right_audio.src = "../src/audio/right.mp3";
        _this.down_audio = new Audio();
        _this.down_audio.src = "../src/audio/down.mp3";
        _this.heart_img = new Image();
        _this.heart_img.className = "heart";
        _this.heart_img.src = "../src/images/heart.png";
        _this.initiateSnake();
        _this.generateHeart();
        return _this;
    }
    Object.defineProperty(Snake.prototype, "ctx", {
        get: function get() {
            return this.cvs ? this.cvs.getContext("2d") : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Snake.prototype, "score", {
        get: function get() {
            return this.snake ? this.snake.length - 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Snake.prototype.generateHeart = function () {
        var heart = null;
        do {
            heart = new Coordinate(Math.floor(Math.random() * (this.columns - 3) + 1) * this.boxSize, Math.floor(Math.random() * (this.rows - 4) + 3) * this.boxSize);
        } while (this.snake.some(function (part) {
            return heart.Equals(part);
        }));
        this.heart = heart;
    };
    Snake.prototype.initiateSnake = function () {
        var snake = [];
        snake[0] = new Coordinate(11 * this.boxSize, 11 * this.boxSize);
        this.snake = snake;
    };
    // ----------------- Update -----------------
    Snake.prototype.update = function () {
        if (this.gameState != GameState.Playing) return;
        this.updateSnake();
        this.updateHeart();
    };
    Snake.prototype.updateSnake = function () {
        var snake = this.snake;
        var snakeX = snake[0].x;
        var snakeY = snake[0].y;
        var tail = snake.pop();
        snakeX -= this.direction === Direction.Left ? 1 * this.boxSize : 0;
        snakeY -= this.direction === Direction.Up ? 1 * this.boxSize : 0;
        snakeX += this.direction === Direction.Right ? 1 * this.boxSize : 0;
        snakeY += this.direction === Direction.Down ? 1 * this.boxSize : 0;
        var newHeadPosition = new Coordinate(snakeX, snakeY);
        snake.unshift(newHeadPosition);
        if (newHeadPosition.Equals(this.heart)) {
            this.eat_audio.play();
            snake.push(tail);
        }
        this.snake = snake;
    };
    Snake.prototype.updateHeart = function () {
        if (this.snake[0].Equals(this.heart)) this.generateHeart();
    };
    // ------------------ Draw ------------------
    Snake.prototype.draw = function () {
        if (!this.ctx) return;
        if (this.gameState === GameState.Playing) {
            this.drawGround();
            this.drawHeart();
            this.drawSnake();
            this.drawScore();
        }
        if (this.gameState === GameState.Won) this.drawWinScreen();
        if (this.gameState === GameState.Lost) this.drawGameover();
        if (this.gameState === GameState.Paused) this.drawPauseScreen();
    };
    Snake.prototype.drawGround = function () {
        this.ctx.fillStyle = "#232323";
        this.ctx.fillRect(0, 0, this.boxSize * this.columns, this.boxSize * this.rows);
        for (var x = 1; x < this.columns - 1; x++) {
            for (var y = 3; y < this.rows - 1; y++) {
                var xy = (x + y) % 2;
                this.ctx.fillStyle = xy === 1 ? "black" : "white";
                this.ctx.fillRect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
            }
        }
    };
    Snake.prototype.drawHeart = function () {
        this.ctx.drawImage(this.heart_img, this.heart.x, this.heart.y, this.boxSize, this.boxSize);
    };
    Snake.prototype.drawSnake = function () {
        if (this.snake.length === 2) console.log("Snake p1: (" + this.snake[0].x + ", " + this.snake[0].y + "), p2: (" + this.snake[1].x + ", " + this.snake[1].y + ")");
        for (var i = 0; i < this.snake.length; i++) {
            this.ctx.fillStyle = i === 0 ? "purple" : "#eac67a";
            // this.ctx.fillStyle = "#eac67a";
            this.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.boxSize, this.boxSize);
            this.ctx.strokeStyle = "#eac67a";
            this.ctx.strokeRect(this.snake[i].x, this.snake[i].y, this.boxSize, this.boxSize);
        }
    };
    Snake.prototype.drawScore = function () {
        this.ctx.drawImage(this.heart_img, 1 * this.boxSize, 1 * this.boxSize, this.boxSize, this.boxSize);
        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Oswald, monospace";
        this.ctx.textAlign = "start";
        this.ctx.fillText("" + this.score, 2 * this.boxSize, 1.9 * this.boxSize);
    };
    Snake.prototype.drawWinScreen = function () {
        this.drawScreen("You beat snake!");
    };
    Snake.prototype.drawGameover = function () {
        this.drawScreen("Game over");
    };
    Snake.prototype.drawScreen = function (message) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.fillRect(0, 0, this.columns * this.boxSize, this.rows * this.boxSize);
        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Oswald, monospace";
        this.ctx.textAlign = "center";
        var boardCenterX = this.columns / 2;
        var boardCenterY = this.rows / 2;
        this.ctx.fillText(message, boardCenterX * this.boxSize, boardCenterY * this.boxSize);
        this.ctx.fillText("Final score: " + this.score, boardCenterX * this.boxSize, (1 + boardCenterY) * this.boxSize);
        this.ctx.fillText("Press R to play again", boardCenterX * this.boxSize, (3 + boardCenterY) * this.boxSize);
    };
    Snake.prototype.drawPauseScreen = function () {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.fillRect(0, 0, this.columns * this.boxSize, this.rows * this.boxSize);
        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Oswald, monospace";
        this.ctx.textAlign = "center";
        var boardCenterX = this.columns / 2;
        var boardCenterY = this.rows / 2;
        this.ctx.fillText("Paused", boardCenterX * this.boxSize, boardCenterY * this.boxSize);
        this.ctx.fillText("Press C to continue", boardCenterX * this.boxSize, (2 + boardCenterY) * this.boxSize);
    };
    // ---------------- Conditions ----------------
    Snake.prototype.checkEndConditions = function () {
        var _this = this;
        var snakeMaxLength = this.columns * this.rows;
        if (this.snake.length === snakeMaxLength) this.gameState = GameState.Won;
        var snakeCrash = this.snake.filter(function (val, i, snake) {
            return i !== 0;
        }).some(function (val) {
            return val.Equals(_this.snake[0]);
        });
        var snakeOffBoard = this.snake[0].x < 1 * this.boxSize || this.snake[0].x > (this.columns - 2) * this.boxSize || this.snake[0].y < 3 * this.boxSize || this.snake[0].y > (this.rows - 2) * this.boxSize;
        if (snakeCrash || snakeOffBoard) {
            this.dead_audio.play();
            this.gameState = GameState.Lost;
        }
    };
    // ---------------- Game loop ----------------
    Snake.prototype.gameLoop = function () {
        this.update();
        this.checkEndConditions();
        this.draw();
    };
    Snake.prototype.runSnake = function () {
        var self = this;
        document.addEventListener("keydown", function (event) {
            self.handleKeypress(event);
        });
        var game = setInterval(function () {
            self.gameLoop();
        }, 100);
    };
    Snake.prototype.handleKeypress = function (event) {
        if (this.gameState === GameState.Playing) {
            if (event.keyCode == 37) {
                this.left_audio.play();
                this.direction = Direction.Left;
            } else if (event.keyCode == 38) {
                this.up_audio.play();
                this.direction = Direction.Up;
            } else if (event.keyCode == 39) {
                this.right_audio.play();
                this.direction = Direction.Right;
            } else if (event.keyCode == 40) {
                this.down_audio.play();
                this.direction = Direction.Down;
            } else if (event.keyCode == 80) {
                this.gameState = GameState.Paused;
            }
        }
        if (this.gameState === GameState.Lost || this.gameState === GameState.Won) {
            if (event.keyCode == 82) {
                this.initiateSnake();
                this.generateHeart();
                this.direction = Direction.Left;
                this.gameState = GameState.Playing;
            }
        }
        if (this.gameState === GameState.Paused) {
            if (event.keyCode == 67) {
                this.gameState = GameState.Playing;
            }
        }
    };
    Snake.prototype.render = function () {
        var _this = this;
        return preact_1.h("div", { className: "game-container" }, preact_1.h("div", { className: "snake-container" }, preact_1.h("h1", null, "Snake is currently only available for desktop"), preact_1.h("canvas", { id: "snake-canvas", width: "736", height: "736", ref: function ref(canvas) {
                return _this.cvs = canvas;
            } })));
    };
    Snake.prototype.componentDidMount = function () {
        this.runSnake();
    };
    return Snake;
}(preact_1.Component);
exports.default = Snake;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map