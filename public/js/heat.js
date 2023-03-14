class Heat extends EventTarget {
    channelId;
    users;

    constructor(channelId) {
        super();

        if (!channelId) {
            this.log("Invalid channel ID.");
            return;
        }

        this.channelId = channelId
        this.connect();

        this.users = new Map();
    }

    connect() {
        let url = `wss://heat-api.j38.net/channel/${this.channelId}`;
        this.log(`Connecting to ${url}.`);
        let ws = new WebSocket(url);

        // Initial connection.
        ws.addEventListener('open', () => {
            this.log(`Connection open to Heat API server, channel ${this.channelId}.`);
        });

        // Message received.
        ws.addEventListener('message', (message) => {
            let data = JSON.parse(message.data);
            let event = new CustomEvent(data.type, { detail: data });
            this.dispatchEvent(event);

            if (data.type == "system") {
                this.log("System message: " + data.message);
            }
        });

        // Error handling.
        ws.addEventListener('error', (event) => {
            this.log("Error:");
            console.log(event);
        });

        // Handle close and reconnect.
        ws.addEventListener('close', (event) => {
            this.log("Connection closed:");
            console.log(event);
            ws = null
            setTimeout(() => { this.connect(); }, 1000)
        });
    }

    async getUserById(id) {
        // Check user map first.
        if (this.users.has(id)) return this.users.get(id);

        // Ignore invalid names.
        if (id.startsWith("A")) return { display_name: "Anonymous" };
        if (id.startsWith("U")) return { display_name: "Unverified" };

        // Query Twitch for user details.
        const url = `https://heat-api.j38.net/user/${id}`;

        // Handle response.
        let response = await fetch(url);
        if (response.ok) {
            let data = await response.json();
            this.users.set(id, data);
            this.log("User for id " + id + " found: " + data.display_name);
            return data;
        } else {
            return { display_name: "Unknown" };
        }
    }

    log(message) {
        let prefix = "%c::HEAT::%c"
        console.log(prefix + " " + message, "color: white; background:orange;", "color:initial;background:initial;");
    }
}

(function (window) {
    window.Heat = Heat;
})(window);