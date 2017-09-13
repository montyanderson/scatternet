const crypto = require("crypto");

module.exports = ({ address, port }) => {
	const hash = crypto.createHash("sha256");

	hash.update(`${address}:${port}`);
	return hash.digest("base64").slice(0, -1);
};
