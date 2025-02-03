'use server'

 import connect from '../lib/db'
import Client from '@/models/Client'
import { buildQuery } from '../utils/helpers'
 
/* ----- CLIENT ----- */
export const getClients = async (search?: any) => {
	await connect()

	try {
		const allClients = await Client.find(buildQuery(search))
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allClients))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربران' }
	}
}

export const getSingleClient = async (id: string) => {
	await connect()

	try {
		const singleClient = await Client.findById(id)
		return JSON.parse(JSON.stringify(singleClient))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const createClient = async (body: any) => {
	await connect()

	try {
		await Client.create(body)
		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت کاربر' }
	}
}

export const editClient = async (id: string, body: any) => {
	await connect()

	try {
		let found = await Client.findByIdAndUpdate(id, body, { new: true }) 
 		return JSON.parse(JSON.stringify(found))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در تغییر کاربر' }
	}
}

export const deleteClient = async (Id: string) => {
	await connect()

	try {
		const found = await Client.findById(Id)

		if (!found) {
			return { error: 'مقاله وجود ندارد' }
		}

		await found.softDelete()
		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: 'خطا در پاک کردن کاربر' }
	}
}
