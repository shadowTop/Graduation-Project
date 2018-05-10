const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')
module.exports = {
	async generate(data) {
		const created = Math.floor(Date.now() / 1000)
		const exp = created + 3600 * 24 * 30

		const cert = fs.readFileSync('D:/desktop/bulb/config/rsa_private_key.pem')
		const token = await jwt.sign({ data, exp }, cert, { algorithm: 'RS256' })
		return token
	}
}
