const createElement = (tag, attrs, ...children) => {
    return {
        tag,
        attrs,
        children
    }
}

const render = (vnode, container) => {
    if (typeof vnode.tag === 'function') {
        vnode = vnode.tag({
            attrs: vnode.attrs,
            children: vnode.children
        });
    }

    if (typeof vnode === 'number') {
        vnode = vnode.toString();
    }

    if (typeof vnode === 'string') {
        const textNode = document.createTextNode(vnode);
        return container.appendChild(textNode);
    }

    const dom = document.createElement(vnode.tag);

    if (vnode.attrs) {
        Object.keys(vnode.attrs).forEach((key) => {
            const val = vnode.attrs[key];
            setAttribute(dom, key, val)
        });
    }

    vnode.children.forEach(child => render(child, dom));

    return container.appendChild(dom);
}

const setAttribute = (dom, name, value) => {
    if (name === 'className') {
        name = 'class';
    }
    
    if (/on\w+/.test(name)) {
        name = name.toLowerCase();
        dom[name] = value || '';
    } else if (name === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        } else if (value && typeof value === 'object') {
            for (let name in value) {
                dom.style[ name ] = typeof value[ name ] === 'number' ? value[ name ] + 'px' : value[ name ];
            }
        }
    } else {
        if (name in dom) {
            dom[name] = value || '';
        }
        if (value) {
            dom.setAttribute(name, value);
        } else {
            dom.removeAttribute(name);
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
        DomList.forEach(dom => {
            dom.rerender();
        });
    }
    return [state, setState];
}

const DomList = [];

export const MyReact = {
    createElement,
    useState
}

export const MyReactDom = {
    render: (vnode, container) => {
        const rerender = () => {
            container.innerHTML = '';
            return render(vnode, container);
        }
        DomList.push({rerender});
        rerender();
    }
}
