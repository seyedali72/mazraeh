'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { buildQuery, convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray } from '../utils/helpers'
import moment from 'jalali-moment'

/* ----- Product ----- */
export const getProducts = async (search?: any) => {
	await connect()

	try {
		const allProducts = await Products.find(buildQuery(search))
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allProducts))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربران' }
	}
}

export const getSingleProduct = async (id: string) => {
	await connect()

	try {
		const singleProduct = await Products.findById(id)
		return JSON.parse(JSON.stringify(singleProduct))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const createProduct = async (body: any, week: any) => {
	await connect()
	
	const results = await Promise.all(body.map(async (data: any) => {
		try {
			let miladiDate = moment.from(data.date, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
			let year = convertToPersianDate(miladiDate, 'Y');
			let month = convertToPersianDate(miladiDate, 'M');
			data.date = Date.parse(miladiDate);

			let newProduct = { name: data.product, group: data.group, subGroup: data.subGroup, category: data.category, year: convertNumbersToEnglish(year), month: convertNumbersToEnglish(month), week: convertNumbersToEnglish(week), totalSell: [{ branch: data.branch, sell: data.sell, return: data.return, date: data.date, day: data.day }] };

			let find = await Products.findOne({ name: data.product, year: year, month: month, isDeleted: false });

			if (!find) {
				let res = await Products.create(newProduct);
				return JSON.parse(JSON.stringify(res));
			} else {
				find.totalSell.push({ branch: data.branch, sell: data.sell, return: data.return, date: data.date });
				await find.save();
				return { success: 'بارگذاری موفقیت امیز بود' };
			}
		} catch (error) {
			console.log(error);
			return { error: 'خطا در پردازش محصول' };
		}
	}));

	return { success: 'بارگذاری موفقیت امیز بود' };
}

export const editProduct = async (id: string, body: any) => {
	await connect()

	try {
		let found = await Products.findByIdAndUpdate(id, body, { new: true })
		return JSON.parse(JSON.stringify(found))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در تغییر کاربر' }
	}
}

export const deleteProduct = async (Id: string) => {
	await connect()

	try {
		const found = await Products.findById(Id)

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

