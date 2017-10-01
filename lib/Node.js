const EventEmitter = require("events");
const dgram = require("dgram");
const hashPeer = require("./hashPeer");

module.exports = class Node extends EventEmitter {
	constructor(network) {
		super();

		if(typeof network !== "string") {
			throw new TypeError("network must be a string");
		}

		this.network = network;
		this.socket = dgram.createSocket("udp4");
		this.directories = [];
		this.peers = {};

		this.socket.on("message", (msg, info) => this.message(msg, info));
	}

	message(msg, info) {
		for(let directory of this.directories) {
			if(info.address == directory.address && info.port == directory.port) {
				let [ address, port ] = msg.toString().split(":");
				port = +port;

				const hash = hashPeer({ address, port });

				const notify = !this.peers[hash];

				this.peers[hash] = {
					address, port
				};

				if(notify === true) {
					this.emit("peer", hash);
				}

				return;
			}
		}

		if(typeof this.peers[hashPeer(info)] === "object") {
			this.emit("message", {
				peer: hashPeer(info),
				msg
			});
		}
	}

	directory(port, address = "127.0.0.1") {
		this.directories.push({
			port, address
		});
	}

	shout() {
		for(let directory of this.directories) {
			this.socket.send(this.network, directory.port, directory.address);
		}
	}

	listen() {
		this.socket.bind(undefined, "0.0.0.0", () => {
			//this.socket.addMembership("0.0.0.0");
			this.socket.setMulticastLoopback(true);
			this.socket.setMulticastTTL(33);
		});

		this.shout();

		setInterval(() => this.shout(), 10 * 1000);
	}

	send(id, msg) {
		const { port, address } = this.peers[id];
		this.socket.send(msg, port, address);
	}

	broadcast(msg) {
		for(let id in this.peers) {
			const { port, address } = this.peers[id];
			this.socket.send(msg, port, address);
		}
	}
}
