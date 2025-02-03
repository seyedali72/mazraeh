import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IDBS } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseDBSSchema = new Schema<IDBS, Model<IDBS, any, any>, any>(
	{
		branch: { type: String, required: [true, 'نام الزامی است']  },
		date: { type: Date },
		totalSell: { type: Number, trim: true  },
		totalReturn: { type: Number, trim: true  },
		totalInvoice: { type: Number, trim: true  },
		products: [{ type: Object }], 
		category: [{ type: Object }],  
		group: [{ type: Object }],  
		sellers: [{ type: Object }],  
 		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseDBSSchema.method({
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
baseDBSSchema.static('fillRandom', function () {
	return `branch-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseDBSSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const DBS = models.DBS || model<IDBS>('DBS', baseDBSSchema)
export default DBS
