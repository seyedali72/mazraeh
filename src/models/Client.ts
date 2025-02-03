import { Schema, models } from 'mongoose'
import User from './User'
import { IClient } from '@/app/utils/types'

const clientSchema = new Schema<IClient, any>({
	mobile_number: {
		type: Number,
		index: { unique: true, sparse: true },
		required: [true, 'شماره همراه الزامی است'],
	},
	clientId: { type: String, trim: true },
	clientName: { type: String, trim: true },
})

const Client =
	models.User.discriminators?.client ||
	User.discriminator('client', clientSchema)

export default Client
