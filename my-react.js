const createElement = (tag, attrs, ...children) => {
    return {
        tag,
        attrs,
        children
    }
}

const render = (n, el) => {
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

const useState = (initVal) => {
    let state = initVal
    if (stateList[statePointer]) {
        state = stateList[statePointer];
    }
    const curPointer = statePointer++;
    const setState = (state) => {
        stateList[curPointer] = state;
        statePointer = 0;
        effectPointer = 0;
        domList.forEach(dom => {
            dom.rerender();
        });
    }
    return [state, setState];
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

const execEffect = () => {
    while(effectQueue.length > 0) {
        const effect = effectQueue.shift();
        effect();
    }
}

const domList = [];

export const MyReact = {
    createElement,
    useState,
    useEffect,
}

export const MyReactDom = {
    render: (_n, _el) => {
        const rerender = () => {
            _el.innerHTML = '';
            const n = render(_n, _el);
            execEffect();
            return n;
        }
        domList.push({ rerender });
        return rerender();
    }
}
