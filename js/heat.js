class Heat extends EventTarget {

    constructor() {
        super();

        const params = (new URL(document.location)).searchParams;
        const channel = params.get("channel") || 97032862;

        const url = 'wss://heat-ebs.j38.net/';
        const socket = io(url, { transports: ['websocket'] });

        console.log("Heat for channel: " + channel + " " + url);

        //

        socket.on('connect', () => {
            console.log("Heat connected.");
            socket.emit("channel", channel);
        });

        socket.on('click', (data) => {
            const clickData = JSON.parse(data);
            let event = new CustomEvent("click", { detail: clickData });
            this.dispatchEvent(event);
        });

    }

}

(function () {
    window.heat = new Heat();
})();