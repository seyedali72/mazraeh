import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ISeller } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseSellerSchema = new Schema<ISeller, Model<ISeller, any, any>, any>(
	{
		name: { type: String, required: [true, 'نام الزامی است'] },
		branch: { type: String  },
		day: { type: String  },
		date: { type: Date },
		totalSell: { type: Number, trim: true }, 
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseSellerSchema.method({
	softDelete: async function () {
		this.branch += '-deleted'
		this.$isDeleted(true)
		this.isDeleted = true
		this.deletedAt = new Date()
		return this.save()
	},
	restore: async function () {
		this.branch = this.branch.replace('-deleted', '')
		this.$isDeleted(false)
		this.isDeleted = false
		this.deletedAt = null
		return this.save()
	},
})

// calling methods
baseSellerSchema.static('fillRandom', function () {
	return `branch-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseSellerSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Seller = models.Seller || model<ISeller>('Seller', baseSellerSchema)
export default Seller
