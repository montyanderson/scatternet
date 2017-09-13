const { Node } = require("./");

const room = process.argv[2] || "lobby";

const node = new Node(room);

node.directory(6000);
node.listen();

node.on("message", ({ peer, msg }) => {
	process.stdout.write(`\r${peer} - ${msg}`);
	process.stdout.write("- ");
});

process.stdin.on("readable", () => {
	const chunk = process.stdin.read();
	process.stdout.write("- ");
	node.broadcast(chunk);
});
