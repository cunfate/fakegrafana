import io from "socket.io-client";
import { EventListenerPoll } from "../eventlistener"

class DataCapture {
    constructor(...args) {
        this.internalSocket = io.connect(`http://${document.domain}:${location.port}`);
        this.dataRequired = [];
    }
};

export default DataCapture;


