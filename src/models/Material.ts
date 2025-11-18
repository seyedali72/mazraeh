import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IMaterial } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseMaterialSchema = new Schema<IMaterial, Model<IMaterial, any, any>, any>(
	{
		name: { type: String, required: [true, 'نام الزامی است'] },
		barcode: { type: String, trim: true },
		coding: { type: String, trim: true },
		unit: { type: String, trim: true },
		type: { type: String, trim: true },
		categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
		price: { type: Number, trim: true },
		items: [{ type: Object }],
		level: { type: Number, trim: true, default: 0 },
		qty: { type: Number, trim: true, default: 0 },
		weight: { type: Number, trim: true, default: 1 },
		over: { type: Number, trim: true, default: 5 },
		price_over: { type: Number, trim: true },
		BPercent: { type: Number, trim: true, default: 0 },
		NPercent: { type: Number, trim: true, default: 0 },
		MNPercent: { type: Number, trim: true, default: 0 },
		MHPercent: { type: Number, trim: true, default: 0 },
		MCPercent: { type: Number, trim: true, default: 0 },
		lastCostUpdate: { type: Date },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseMaterialSchema.method({
	softDelete: async function () {
		this.name += '-deleted'
		this.$isDeleted(true)
		this.isDeleted = true
		this.deletedAt = new Date()
		return this.save()
	},
	restore: async function () {
		this.name = this.name.replace('-deleted', '')
		this.$isDeleted(false)
		this.isDeleted = false
		this.deletedAt = null
		return this.save()
	},
})

// calling methods
baseMaterialSchema.static('fillRandom', function () {
	return `name-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseMaterialSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Material = models.Material || model<IMaterial>('Material', baseMaterialSchema)
export default Material
