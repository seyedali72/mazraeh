import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'
import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IUser } from '@/app/utils/types'

const baseUserSchema = new Schema<IUser, Model<IUser, any, any>, any>(
	{
		name: { type: String, default: 'کاربر ' },
		user_name: { type: String, text: true, trim: true, index: { unique: true, sparse: true }, required: [true, 'نام الزامی است'], maxLength: [150, 'نام کاربر باید حداکثر 150 کاراکتر باشد'], },
		password: { trim: true, type: String, required: [true, 'شماره همراه الزامی است'], },
		employe_id: { type: Schema.Types.ObjectId, ref: 'Employe' },
		email: { type: String, trim: true, maxLength: [100, 'ایمیل کاربر باید حداکثر 100 کاراکتر باشد'], },
		avatar: { type: Schema.Types.ObjectId, ref: 'File' },
		role: { type: Number, default: 1, },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		discriminatorKey: 'userType',
		timestamps: true,
	},
)

baseUserSchema.method({
	softDelete: async function () {
		this.user_name += '-deleted'
		this.$isDeleted(true)
		this.isDeleted = true
		this.deletedAt = new Date()
		return this.save()
	},
	restore: async function () {
		this.user_name = this.user_name.replace('-deleted', '')
		this.$isDeleted(false)
		this.isDeleted = false
		this.deletedAt = null
		return this.save()
	},
})

// calling methods
baseUserSchema.static('fillRandom', function () {
	return `user-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseUserSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const User = models.User || model<IUser>('User', baseUserSchema)
export default User
