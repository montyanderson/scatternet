const dgram = require("dgram");

module.exports = class Directory {
	constructor() {
		this.socket = dgram.createSocket("udp4");
		this.networks = [];

		this.socket.on("message", (msg, info) => {
			const { address, port } = info;
			const node = { address, port };
			const network = msg.toString();

			if(typeof this.networks[network] !== "object") {
				this.networks[network] = [];
			}

			for(let peer of this.networks[network]) {
				if(!(node.address == peer.address && node.port == peer.port)) {
					/* send address of node to peer */
					this.socket.send(`${peer.address}:${peer.port}`, node.port, node.address);
					/* send address of peer to node */
					this.socket.send(`${node.address}:${node.port}`, peer.port, peer.address);
				}
			}

			this.networks[network].push(node);
		});
	}

	listen() {
		this.socket.bind(...arguments);
	}
}
