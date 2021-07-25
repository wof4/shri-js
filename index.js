

function allKeysAndSymbols(obj) {
    let objKeys = []
    objKeys.push(...Object.getOwnPropertyNames(obj))
    objKeys.push(...Object.getOwnPropertySymbols(obj))
    let prototype = Object.getPrototypeOf(obj);
    while (prototype) {
        objKeys.push(...Object.getOwnPropertyNames(prototype));
        objKeys.push(...Object.getOwnPropertySymbols(prototype));
        prototype = Object.getPrototypeOf(prototype);
    }
    const set = new Set(objKeys);
    set.delete('__proto__');
    return Array.from(set);
}




function inProxy(obj) {
    return new Proxy(obj, {
        has(target, prop) {
            return (
                Object.getOwnPropertyNames(target).includes(prop) ||
                Object.getOwnPropertySymbols(target).includes(prop)
            );
        },
    });
}


class MySet {
    constructor(data) {
        this.data = [];
        if (data && data[Symbol.iterator]) {
            for (const item of data) {
                if (!this.data.includes(item)) {
                    this.data.push(item);
                }
            }
        }
        this.size = this.data.length;
        this.keys = this.values;

        this[Symbol.iterator] = this.values;
        this[Symbol.toStringTag] = 'MySet';
    }

    clear() {
        this.data = [];
        this.size = 0;
    }

    has(value) {
        return this.data.includes(value);
    }

    add(value) {
        if (!this.data.includes(value)) {
            this.data.push(value);
            this.size++;
        }
        return this;
    }

    delete(value) {
        const index = this.data.indexOf(value);
        if (index !== -1) {
            this.data.splice(index, 1);
            this.size--;
            return true;
        }
        return false;
    }

    values() {
        const call = this;
        return {
            i: 0,
            next() {
                if (this.i < call.size) {
                    return { value: call.data[this.i++], done: false };
                }
                return { value: undefined, done: true };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }

    entries() {
        const call = this;
        return {
            i: 0,
            next() {
                if (this.i < call.size) {
                    const value = call.data[this.i++];
                    return { value: [value, value], done: false };
                }
                return { value: undefined, done: true };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }

    forEach(callbackFn, thisArg) {
        const call = this;
        this.data.forEach((item, index) => {
            callbackFn.call(thisArg, item, index, call);
        });
    }
}