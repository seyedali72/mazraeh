'use server'

import { cookies } from 'next/headers'
import connect from '../lib/db'
import User from '@/models/User'
import { buildQuery } from '../utils/helpers'
import File from '@/models/File'
 
/* ----- USER ----- */
export const getUsers = async (search?: any) => {
	await connect()

	try {
		const allUsers = await User.find(buildQuery(search))
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allUsers))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربران' }
	}
}

export const getSingleUser = async (id: string) => {
	await connect()

	try {
		const singleUser = await User.findById(id)
		return JSON.parse(JSON.stringify(singleUser))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const createUser = async (body: any) => {
	await connect()

	try {
		await User.create(body)
		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت کاربر' }
	}
}

export const editUser = async (id: string, body: any) => {
	await connect()

	try {
		let found = await User.findByIdAndUpdate(id, body, { new: true }).populate([ { path: 'avatar', select: 'fileAddress', model: File }])
		const forCoockie = { name: found.name, employee_id: found.employe_id, avatar: found?.avatar?.fileAddress, mobile_number: found.mobile_number, user_name: found.user_name, clientName: found.clientName, clientId: found.clientId, _id: found._id, role: found.role, userType: 'client', isDeleted: false }
		cookies().set('user', JSON.stringify(forCoockie))
		return JSON.parse(JSON.stringify(found))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در تغییر کاربر' }
	}
}

export const deleteUser = async (userId: string) => {
	await connect()

	try {
		const found = await User.findById(userId)

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
