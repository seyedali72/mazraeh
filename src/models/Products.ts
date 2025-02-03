import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IProducts } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseProductsSchema = new Schema<IProducts, Model<IProducts, any, any>, any>(
	{
		name: { type: String, required: [true, 'نام الزامی است'] },
		year: { type: String },
		month: { type: String },
		// week: { type: String },
		group: { type: String },
		subGroup: { type: String },
		category: { type: String },
		totalSell: [{ type: Object }],
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseProductsSchema.method({
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
baseProductsSchema.static('fillRandom', function () {
	return `branch-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseProductsSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Products = models.Products || model<IProducts>('Products', baseProductsSchema)
export default Products
