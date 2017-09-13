# scatternet

A lightweight peer-to-peer network framework.

## Decentralised chat appliction example

``` javascript
const { Node } = require("scatternet");

const node = new Node("simplechat");

node.directory(6000, "public-directory-example.net");
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
```
