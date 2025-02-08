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
	await connect();

	try {
		const operations = body.map((data: any) => {
			try {
				let miladiDate = moment.from(data.date, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
				let year = convertToPersianDate(miladiDate, 'Y');
				let month = convertToPersianDate(miladiDate, 'M');
				data.date = Date.parse(miladiDate);

				const englishWeek = convertNumbersToEnglish(week);
				const englishYear = convertNumbersToEnglish(year);
				const englishMonth = convertNumbersToEnglish(month);
				const newProduct = {
					name: data.product,
					group: data.group,
					subGroup: data.subGroup,
					category: data.category,
					year: englishYear,
					month: englishMonth,
					week: englishWeek,
					totalSell: [{ branch: data.branch, sell: data.sell, return: data.return, date: data.date, day: data.day }],
				};

				return {
					updateOne: {
						filter: {
							name: data.product,
							year: englishYear,
							month: englishMonth,
							week: englishWeek,
							group: data.group,
							subGroup: data.subGroup,
							category: data.category,
							isDeleted: false,
						},
						update: { $push: { totalSell: newProduct.totalSell[0] } },
						upsert: true,
					},
				};
			} catch (error) {
				console.error("Error processing product:", error);
				return null; // Handle error appropriately
			}
		}).filter(Boolean); // Remove any null operations

		if (operations.length > 0) {
			await Products.bulkWrite(operations, { ordered: false });
		}

		return { success: 'بارگذاری موفقیت امیز بود' };
	} catch (error) {
		console.error("Error in createProduct:", error);
		return { error: 'خطا در پردازش کلی محصولات' };
	}
};


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

