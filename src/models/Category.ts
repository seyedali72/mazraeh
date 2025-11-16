import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ICategory } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseCategorySchema = new Schema<ICategory, Model<ICategory, any, any>, any>(
	{
		name: { type: String, required: [true, 'نام الزامی است'], maxLength: [150, 'نام دسته بندی باید حداکثر 150 کاراکتر باشد'], },
		parent: { type: Schema.Types.ObjectId, ref: 'Category' },
		products: [{ type: Schema.Types.ObjectId, ref: 'Material' }],
		level: { type: Number, trim: true, default: 1 },
		serial: { type: String, trim: true },
		status: { type: String, trim: true, default: 'فعال' },
		description: { type: String, trim: true },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseCategorySchema.method({
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
baseCategorySchema.static('fillRandom', function () {
	return `category-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseCategorySchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Category = models.Category || model<ICategory>('Category', baseCategorySchema)
export default Category
