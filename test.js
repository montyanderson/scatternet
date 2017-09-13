const { Node } = require("./");

const room = process.argv[2] || "lobby";

const node = new Node(room);

node.directory(6000);
node.listen();

node.on("message", ({ peer, msg }) => {
	process.stdout.write(`\r${peer} - ${msg}`);
	process.stdout.write("- ");
});

node.on("peer", peer => {
	process.stdout.write(`\r${peer} joined the chat!\n`);
	process.stdout.write("- ");
});

process.stdout.write("- ");

process.stdin.on("readable", () => {
	const chunk = process.stdin.read();

	if(chunk) {
		process.stdout.write("- ");
		node.broadcast(chunk);
	}
});
