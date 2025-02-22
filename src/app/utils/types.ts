import { Types } from 'mongoose'

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
	date: Date
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
	IDBS, ISeller, IClient, IUser,IProducts
}
