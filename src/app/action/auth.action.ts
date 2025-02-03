'use server'
import User from '@/models/User'
import { customAlphabet, nanoid } from 'nanoid'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import connect from '../lib/db'
import Client from '@/models/Client'
import File from '@/models/File'

export const signinAll = async (body: any) => {

	await connect()
	try {
		const found = await User.findOne({ isDeleted: false, user_name: body.user_name, password: body.password, })
		if (found?.userType == 'client') {
			const forCoockie = { name: found.name, mobile_number: found.mobile_number, user_name: found.user_name, clientName: found.clientName, _id: found._id, role: found.role, isDeleted: false }
			if (forCoockie) {
				cookies().set('user', JSON.stringify(forCoockie))
				return JSON.parse(JSON.stringify(forCoockie))
			}
		}
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ورود کاربر' }
	}
}
export const signinUser = async (body: any) => {

	await connect()
	try {
		const found = await User.findOne({
			isDeleted: false,
			user_name: body.user_name,
			password: body.password,
		})
		if (found) {
			cookies().set('user', JSON.stringify(found))
			return JSON.parse(JSON.stringify(found))
		}
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ورود کاربر' }
	}
}

export const signupUser = async (body: any) => {
	await connect()
	try {
		const newUser = await User.create({ user_name: body.user_name, name: nanoid(), password: body.password, role: body.role })
		cookies().set('user', JSON.stringify(newUser))
		return JSON.parse(JSON.stringify(newUser))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت نام کاربر' }
	}
}
 
export const signupClient = async (body: any) => {
	let clientId = customAlphabet('1234567890', 6)()
	await connect()
	 
	try {
		const newUser = await Client.create({ user_name: body.user_name, clientName: body.clientName, name: nanoid(6), password: body.password, mobile_number: body.mobile_number, role: body.role, clientId })
		cookies().set('user', JSON.stringify(newUser))
		return JSON.parse(JSON.stringify(newUser))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت نام کاربر' }
	}
}

export const signoutUser = async () => {
	cookies().delete('user')
	redirect('/')
}
