import { ObjectId, Types } from 'mongoose'

interface ISeller {
	date: Date
	branch: String
	day: String
	name: String
	totalSell: Number
	isDeleted?: boolean
	deletedAt?: Date
}
interface IProducts {
	name: String
	year: String
	month: String
	week: String
	group: String
	subGroup: String
	category: String
	totalSell: []
	isDeleted?: boolean
	deletedAt?: Date
}
interface ICategory {
	name: String
	parent: ObjectId
	products: [ObjectId]
	status: String
	level: Number
	serial: String
	description: String
	isDeleted?: boolean
	deletedAt?: Date
}
interface IDBS {
	date: Date
	branch: String
	day: String
	totalSell: Number
	totalReturn: Number
	totalInvoice: Number
	isDeleted?: boolean
	deletedAt?: Date
}
interface IMaterial {
	name: String
	barcode: String
	coding: String
	unit: String
	type: String
	qty: Number
	price: Number
	level: Number
	over: Number
	categoryId: ObjectId
	items: Object
	price_over: Number
	weight: Number
	BPercent: Number
	NPercent: Number
	MNPercent: Number
	MHPercent: Number
	MCPercent: Number
	lastCostUpdate: Date
	isDeleted?: boolean
	deletedAt?: Date
}
interface IUser {
	name: string
	user_name: string
	password: string
	role?: string
	avatar: Types.ObjectId
	employe_id?: Types.ObjectId
	email?: string
	isDeleted?: boolean
	deletedAt?: Date
}
interface IClient extends IUser {
	clientId: string
	clientName: string
	mobile_number: number
}
interface IFile {
	fileName: string
	fileAddress: string
	fileSize?: string
	altText?: string
	clientId: string
	mimeType?: string
	thumbnails?: [
		{
			url: string
			size: string
		},
	]
}
export type {
	IDBS, ISeller, IClient, IUser, IProducts, IMaterial, ICategory
}
