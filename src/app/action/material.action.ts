'use server'

import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Material from '@/models/Material'
import Category from '@/models/Category'

/* ----- Material ----- */
export const getMaterials = async (search?: any) => {
	await connect()

	try {
		const allMaterials = await Material.find(buildQuery(search)).populate({ path: 'categoryId', select: '_id name serial', model: Category })
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allMaterials))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}
export const getSingleMaterial = async (id: string) => {
	await connect()

	try {
		const singleMaterial = await Material.findById(id).populate([{ path: 'items.material', model: Material }, { path: 'categoryId', select: '_id name', model: Category }])
		return JSON.parse(JSON.stringify(singleMaterial))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}
export const createMaterial = async (body: any) => {
	await connect();

	try {
		body.map(async (data: any) => {
			data.type = 'material'
			data.unit = 'کیلوگرم'
			let price = parseInt(data.price)
			let barcode = data.barcode?.toString().trim()
			data.price_over = price * 1.1
			let found = await Material.findOne({ isDeleted: false, barcode })
			if (found == null) {
				await Material.create(data)
			} else {
				await Material.findOneAndUpdate({ barcode }, { price: price, price_over: data.price_over }, { new: true })
			}
		})


		return { success: 'بارگذاری موفقیت امیز بود' };
	} catch (error) {
		console.error("Error in createMaterial:", error);
		return { error: 'خطا در پردازش کلی کالا' };
	}
};
export const editMaterial = async (id: string, body: any) => {
	await connect()

	try {
		let found = await Material.findByIdAndUpdate(id, body, { new: true })
		return JSON.parse(JSON.stringify(found))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در تغییر اطلاعات' }
	}
}
export const deleteMaterial = async (Id: string) => {
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
export const createProduct = async (body: any) => {
	await connect();
	try {
		let found = await Material.findOne({ isDeleted: false, barcode: body.barcode })
		if (found?._id !== undefined) { return { error: 'متاسفانه این بارکد قبلا استفاده شده است' } }
		else {
			await Material.create(body)
		}
		return { success: true }
	} catch (error) {
		return { error: 'خطا در ساخت کالا' };
	}
}
export const getFinalList = async (search?: any) => {
	await connect()

	const query: any = { ...(search || {}) }
	query.type = { $nin: ['material'] }

	const filter: any = {}
	if (query.type) filter.type = query.type
	if (query.categoryId) filter.categoryId = query.categoryId
	if (query.q) {
		filter.$or = [
			{ name: { $regex: query.q, $options: 'i' } },
			{ barcode: { $regex: query.q, $options: 'i' } },
		]
	}

	const pipeline: any[] = [
		{ $match: filter },

		// مرحله ۱: دسته‌بندی سطح اول
		{
			$lookup: {
				from: 'categories',
				localField: 'categoryId',
				foreignField: '_id',
				as: 'categoryId',
				pipeline: [
					{ $project: { name: 1, parent: 1 } },

					// مرحله ۲: parent سطح اول (سطح دوم دسته‌بندی)
					{
						$lookup: {
							from: 'categories',
							localField: 'parent',
							foreignField: '_id',
							as: 'parent',
							pipeline: [
								{ $project: { name: 1, parent: 1 } },

								// مرحله ۳: parent سطح دوم (سطح سوم دسته‌بندی)
								{
									$lookup: {
										from: 'categories',
										localField: 'parent',
										foreignField: '_id',
										as: 'parent',
										pipeline: [
											{ $project: { name: 1, parent: 1 } }, // اینجا parent دیگه نداره، فقط name
										],
									},
								},
								{ $unwind: { path: '$parent', preserveNullAndEmptyArrays: true } },
							],
						},
					},
					{ $unwind: { path: '$parent', preserveNullAndEmptyArrays: true } },
				],
			},
		},
		{ $unwind: { path: '$categoryId', preserveNullAndEmptyArrays: true } },

		{ $sort: { createdAt: -1 } },
		{ $skip: query.skip ?? 0 },
		// { $limit: query.limit && query.limit > 0 ? query.limit : 20 },
	]

	try {
		const materials = await Material.aggregate(pipeline).option({ allowDiskUse: true })


		return JSON.parse(JSON.stringify(materials))

	} catch (error: any) {
		console.error('خطا در getFinalList:', error.message)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}

export const getProductsList = async (search?: any) => {
	await connect()
	// search.type = { $nin: ['material', 'package'] }
	try {
		const allMaterials = await Material.find(buildQuery(search)).populate({ path: 'categoryId', select: '_id name parent', model: Category })
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allMaterials))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}

export const getSingleProduct = async (id: string) => {
	await connect()

	try {
		const singleMaterial = await Material.findById(id).populate([{ path: 'items.material', model: Material }, { path: 'categoryId', select: '_id name', model: Category }])


		return JSON.parse(JSON.stringify(singleMaterial))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}

export const getMaterialsForCreateFianl = async (search?: any) => {
	await connect()
	search.type = { $nin: ['package','final'] }

	try {
		const allMaterials = await Material.find(buildQuery(search)).populate({ path: 'categoryId', select: '_id name serial', model: Category })
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allMaterials))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}
export const getMaterialsForCreateMiddle = async (search?: any) => {
	await connect()
	search.type = { $nin: ['package','final'] }

	try {
		const allMaterials = await Material.find(buildQuery(search)).populate({ path: 'categoryId', select: '_id name serial', model: Category })
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allMaterials))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}
export const getMaterialsForCreateConvert = async (search?: any) => {
	await connect()
	search.type = { $nin: ['package','final'] }

	try {
		const allMaterials = await Material.find(buildQuery(search)).populate({ path: 'categoryId', select: '_id name serial', model: Category })
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allMaterials))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت اطلاعات' }
	}
}