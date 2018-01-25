'use strict'
///Evenr proxy to listen events from react components
class EventProxy {
    constructor() {
        this.onObj = {};
        this.oneObj = {};
    }
    //register an event handler function, to process the event EACH time, which event identifier should be a string.
    on(key, fn) {
        if (this.onObj[key] === undefined) {
            this.onObj[key] = [];
        }
        this.onObj[key].push(fn);
    }
    //register an event handler function, to process the event ONCE, which event identifier should be a string.
    one(key, fn) {
        if (this.oneObj[key] === undefined) {
            this.oneObj[key] = [];
        }
        this.oneObj[key].push(fn);
    }
    //unregister an event handler
    off(key) {
        this.oneObj[key] = [];
        this.onObj[key] = [];
    }
    //trig an event and call the handler function
    trigger() {
        let key, args;
        if (arguments.length === 0)
            return false;
        key = arguments[0];
        args = [].concat(Array.prototype.slice.call(arguments, 1));
        if (this.onObj[key] !== undefined && this.onObj[key].length > 0) {
            for (let i in this.onObj[key]) {
                this.onObj[key][i].apply(null, args);
            }
        }
        if (this.oneObj[key] !== undefined && this.oneObj[key].length > 0) {
            for (let i in this.oneObj[key]) {
                this.oneObj[key][i].apply(null, args);
                this.oneObj[key][i] = undefined;
            }
            this.oneObj[key] = [];
        }
        return true;
    }
}

//create an eventproxy poll, every key has a eventproxy object, which have some events and handler functions.
let EventListenerPoll = (function(){
    var _singleton = {};
    function creatProxy(key) {
        if(key === undefined 
            || key === null 
            || typeof key !== "string" 
            || key.length === 0 
            || _singleton[key] !== undefined) {
                console.log("Invalid key in EventListener poll!");
                return null;
        }

        _singleton[key] = new EventProxy;
        return _singleton[key];
    };

    function getProxy(key) {
        return _singleton[key];
    }

    return {
        create: creatProxy,
        get:    getProxy
    };
})();

export {EventProxy as EventListener, EventListenerPoll};




