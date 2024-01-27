const flattenArray = (arr) => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val), []);

const createElement = (tag, attrs, ...children) => {

    attrs = attrs || {};

    return {
        tag,
        attrs,
        children: children && flattenArray(children),
        key: attrs.key || null,
    }
}

const isSameNodeType = ( el, n ) => {
    if ( typeof n === 'string' || typeof n === 'number' ) {
        return el.nodeType === Node.TEXT_NODE;
    }

    if ( typeof n?.tag === 'string' ) {
        return el.nodeName.toLowerCase() === n.tag.toLowerCase();
    }

    return el.nodeName.toLowerCase() === n?.tag?.toLowerCase();
}

/**
 * diff node attributes
 * @param {HTMLElement} el dom
 * @param {vnode} n vnode
 */
const diffAttributes = (el, n) => {
    const old = {};
    const nAttrs = n.attrs;

    for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        old[attr.name] = attr.value;
    }

    for (let name in old) {
        if (!(name in nAttrs)) {
            setAttribute(el, name, undefined);
        }
    }

    for (let name in nAttrs) {
        if (old[name] !== nAttrs[name]) {
            setAttribute(el, name, nAttrs[name]);
        }
    }
}

/**
 * diff child nodes
 * @param {HTMLElement} el 
 * @param {vnode[]} vc 
 */
const diffChildren = (el, vc) => {
    const elChildren = el.childNodes;
    const children = [];

    const keyed = {};

    if (elChildren.length > 0) {
        for (let i = 0; i < elChildren.length; i++) {
            const child = elChildren[i];
            const key = child?.getAttribute?.('key');
            
            if (key) {
                keyed[key] = child;
            } else {
                children.push(child);
            }
        }
    }

    if (vc && vc.length > 0) {
        let min = 0;
        let childrenLen = children.length;

        for (let i = 0; i < vc.length; i++) {
            const vchild = vc[i];
            const key = vchild?.key;
            let child;

            if (key) {
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            } else if (min < childrenLen) {
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j];
                    
                    if (c && (isSameNodeType(c, vchild))) {
                        child = c;
                        children[j] = undefined;

                        (j === childrenLen - 1) && childrenLen--;
                        (j === min) && min++;
                        break;
                    }
                }
            }

            child = diff(child, vchild);

            const f = elChildren[i];
            if (child && child !== el && child !== f) {
                if (!f) {
                    el.appendChild(child);
                } else if (child === f.nextSibling) {
                    f.parentNode.removeChild(f);
                } else {
                    el.insertBefore(child ,f);
                }
            }
        }
    }
}

/**
 * diff components
 * @param {HTMLElement} el dom
 * @param {vnode} n vnode
 */
const diffComponent = (el, n) => {
    // TODO
}

/**
 * diff incoming vnode and the real dom
 * @param {HTMLElement} el dom
 * @param {vnode} n vnode
 * @returns {HTMLElement}
 */
const diff = (el, n) => {
    let _el = el;

    if (n === null || n === undefined) {
        n = '';
    }

    if (typeof n === 'number') {
        n = n.toString();
    }

    if (typeof n === 'string') {
        if (el && el.nodeType === Node.TEXT_NODE) {
            el.textContent !== n && (el.textContent = n);
        } else {
            _el = document.createTextNode(n);
            if (el && el.parentNode) {
                el.parentNode.replaceChild(_el, el);
            }
        }

        return _el;
    }

    if (typeof n.tag === 'function') {
        n = n.tag({
            attrs: n.attrs,
            children: n.children
        });
        
        return diffChildren(_el, [n]);
    }

    if (!el || !isSameNodeType(el, n)) {
        _el = document.createElement(n.tag);

        if (el) {
            [...el.childNodes].map(_el.appendChild);

            if (el.parentNode) {
                el.parentNode.replaceChild(_el, el);
            }
        }
    }

    if (n.children && n.children.length > 0 || (_el.childNodes && _el.childNodes.length > 0)) {
        diffChildren(_el, n.children);
    }

    diffAttributes(_el, n);

    return _el;
}

/**
 * renders the vnode to real dom
 * @param {vnode} n 
 * @param {HTMLElement} el 
 * @returns {HTMLElement}
 */
const render = (n, el) => {
    if (n === null || n === undefined) {
        return;
    }

    if (typeof n.tag === 'function') {
        n = n.tag({
            attrs: n.attrs,
            children: n.children
        });
    }

    if (typeof n === 'number') {
        n = n.toString();
    }

    if (typeof n === 'string') {
        const textNode = document.createTextNode(n);
        return el.appendChild(textNode);
    }

    const dom = document.createElement(n.tag);

    if (n.attrs) {
        Object.keys(n.attrs).forEach((key) => {
            const val = n.attrs[key];
            setAttribute(dom, key, val)
        });
    }

    n.children.forEach(child => render(child, dom));

    return el.appendChild(dom);
}

const setAttribute = (el, label, val) => {
    if (label === 'className') {
        label = 'class';
    }

    if (/on\w+/.test(label)) {
        label = label.toLowerCase();
        el[label] = val || '';
    } else if (label === 'style') {
        if (!val || typeof val === 'string') {
            el.style.cssText = val || '';
        } else if (val && typeof val === 'object') {
            for (let _v in val) {
                el.style[_v] = typeof val[_v] === 'number' ? val[_v] + 'px' : val[_v];
            }
        }
    } else {
        if (label in el) {
            el[label] = val || '';
        }
        if (val) {
            el.setAttribute(label, val);
        } else {
            el.removeAttribute(label);
        }
    }
}

let statePointer = 0;
const stateList = [];
const setQueue = [];

const useState = (initVal) => {
    let state = initVal
    console.log(this);
    if (stateList[statePointer]) {
        state = stateList[statePointer];
    } else {
        stateList[statePointer] = state;
    }
    const curPointer = statePointer++;
    const setState = (state) => {
        if (setQueue.length === 0) {
            defer(flushSetQueue);
        }
        setQueue.push(() => {
            if (typeof state === 'function') {
                stateList[curPointer] = state(stateList[curPointer]);
            } else {
                stateList[curPointer] = state;
            }
        });
    }
    return [state, setState];
}

const flushSetQueue = () => {
    while(setQueue.length > 0) {
        const set = setQueue.shift();
        set();
    }
    domList.forEach(dom => {
        dom.rerender();
    });
}

const defer = ( fn ) => {
    // return Promise.resolve().then( fn );
    return setTimeout(fn, 16);
}

const arrayComp = (x, y) => {

    if (!x || !y) {
        return false;
    }

    if (x.length !== y.length) {
        return false;
    }

    for (let i = 0; i < x.length; i++) {
        if (x[i] !== y[i]) {
            return false;
        }
    }

    return true;
}

let effectPointer = 0;
const watchList = [];
const effectQueue = [];

const useEffect = (effect, watch = null) => {
    if (watch === null || !arrayComp(watch, watchList[effectPointer])) {
        effectQueue.push(effect);
        watchList[effectPointer] = watch;
    }
    effectPointer++;
}

const flushEffect = () => {
    while(effectQueue.length > 0) {
        const effect = effectQueue.shift();
        effect();
    }
}

let refPointer = 0;
const refList = [];

const useRef = (initVal) => {
    let ref = {current: initVal}
    if (refList[refPointer]) {
        ref = refList[refPointer];
    } else {
        refList[refPointer] = ref;
    }
    refPointer++;
    return ref;
}

const resetPointers = () => {
    statePointer = 0;
    effectPointer = 0;
    refPointer = 0;
}

const domList = [];

export const MyReact = {
    createElement,
    useState,
    useEffect,
    useRef,
}

export const MyReactDom = {
    render: (_n, _el) => {
        const rerender = () => {
            resetPointers();
            const n = diff(_el, _n);
            flushEffect();
            return n;
        }
        domList.push({ rerender });
        _el.innerHTML = '';
        const _dom = render(_n, _el);
        flushEffect();
        return _dom;
    }
}
