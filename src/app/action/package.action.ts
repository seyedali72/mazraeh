'use server'

import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Category from '@/models/Category'
import Material from '@/models/Material'

/* ----- Package ----- */
export const getPackages = async (search?: any) => {
	await connect()

	try {
		const allPackages = await Material.find(buildQuery(search)).populate({ path: 'categoryId', select: '_id name', model: Category })
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allPackages))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}



export const getSinglePackage = async (id: string) => {
	await connect()

	try {
		const singlePackage = await Material.findById(id).populate([{ path: 'items.material', model: Material }, { path: 'categoryId', select: '_id name', model: Category }])
		return JSON.parse(JSON.stringify(singlePackage))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}

export const createPackage = async (body: any) => {
	await connect();
	try {
		await Material.create(body)
		
		return { success: true }
	} catch (error) {
		return { error: 'خطا در ساخت محصول' };
	}
}

export const editPackage = async (id: string, body: any) => {
	await connect()

	try {
		let found = await Material.findByIdAndUpdate(id, body, { new: true })
		return JSON.parse(JSON.stringify(found))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در تغییر اطلاعات' }
	}
}

export const deletePackage = async (Id: string) => {
	await connect()

	try {
		const found = await Material.findById(Id)

		if (!found) {
			return { error: 'اطلاعات وجود ندارد' }
		}

		await found.softDelete()
		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: 'خطا در پاک کردن اطلاعات' }
	}
}

