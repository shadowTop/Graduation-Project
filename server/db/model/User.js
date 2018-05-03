const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Regular = require('../../utils/regular')
const Token = require('../../utils/token')

const SALT_WORK_FACTOR = 10

const User = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		account: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			trim: true
		},
		address: {
			province: {
				type: String,
				required: true,
				trim: true
			},
			city: {
				type: String,
				required: false,
				trim: true
			},
			county: {
				type: String,
				required: false,
				trim: true
			}
		}
	},
	{
		collection: 'User',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)
User.set('toJSON', { getters: true, virtuals: true })
User.set('toObject', { getters: true, virtuals: true })

User.virtual('address.full').get(function() {
	return this.address.province + this.address.city + this.address.county
})

User.pre('save', function(next) {
	const user = this
	if (!user.isModified('password')) return next()

	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err)
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) return next(err)
			user.password = hash
			next()
		})
	})
})

User.methods = {
	comparePassword(newPass, hadBcryptPass) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(newPass, hadBcryptPass, (err, isMatch) => {
				if (!err) {
					resolve(isMatch)
				} else {
					reject(err)
				}
			})
		})
	}
}
User.statics = {
	fetch: function(cb) {
		return this.find({})
			.sort('update_at')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this.findOne({ _id: id }).exec(cb)
	},
	hasExisted: async function(account) {
		let result = true
		await this.findOne({ account: account }, (err, data) => {
			result = !!data
		})
		return result
	}
}

module.exports = mongoose.model('User', User)
