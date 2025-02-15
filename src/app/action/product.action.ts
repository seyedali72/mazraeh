'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { buildQuery, convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray, } from '../utils/helpers'
import moment from 'jalali-moment'
import Seller from '@/models/Seller'

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
		return { error: 'خطا در دریافت فروشندهان' }
	}
}

export const getSingleProduct = async (id: string) => {
	await connect()

	try {
		const singleProduct = await Products.findById(id)
		return JSON.parse(JSON.stringify(singleProduct))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت فروشنده' }
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
					totalSell: [{   branch: data.branch, sell: data.sell, return: data.return, date: data.date, day: data.day }],
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
		return { error: 'خطا در تغییر فروشنده' }
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
		return { error: 'خطا در پاک کردن فروشنده' }
	}
}

export const getChartSellerInDays = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' }, { borderColor: '#078191', backgroundColor: '#078191' },
	{ borderColor: '#cc1220', backgroundColor: '#cc1220' }, { borderColor: '#e05212', backgroundColor: '#e05212' },
	{ borderColor: '#d31184', backgroundColor: '#d31184' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' },]
	const { selectedSellers, selectedDays, colors } = body
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	let allArray: any[] = [];
	for (let i = 0; i < selectedSellers?.length; i++) {
		let daysArray: any[] = [];
		let finalData = []
		for (const day of selectedDays) {
			body.seller = selectedSellers[i];
			body.day = day;
			const res = await getChartDays(body);
			if (res !== undefined) { daysArray.push(res); finalData.push(res.data[0]) }
		}

		allArray.push(daysArray)
		dataArray.push({
			label: daysArray[0].label, data: finalData, backgroundColor: colors[i].backgroundColor,
			fill: false, tension: 0.1,
			borderColor: colors[i].borderColor,
			pointBackgroundColor: colors[i].backgroundColor,
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: colors[i].borderColor,
		})
	}

	if (dataArray.length === 0) { throw new Error("No data received from selleres."); }
	// درست کردن لیبل های مقایسه ای
	let labels = allArray.flat().map((item: any, idx: number) => item.day).filter(onlyUnique).filter((unique: any) => unique !== undefined)
	let data = { labels, datasets: dataArray }

	return data
}
export const getChartDays = async (body: any) => {
	await connect()
	const { seller, day } = body
	let persianDate = convertToPersianDate(day, 'YMD')
	try {
		const find = await Seller.findOne({ date: day, name: seller })
		if (find !== null) {
			let chartData = { label: find?.name, data: [find?.totalSell], day: `${persianDate}-${find?.day}` };
			return JSON.parse(JSON.stringify(chartData))
		} else {
			let chartData = { label: seller, data: [0] };
			return JSON.parse(JSON.stringify(chartData))
		}
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت فروشنده' }
	}
}

export const getChartSellerInDuration = async (body: any) => {
	await connect()
	try {
		const find = await Seller.find({ isDeleted: false })
		let filter = find?.filter((item: any) => Date.parse(item.date) >= body.selectedStartDate && Date.parse(item.date) <= body.selectedEndDate)
		const allDates = filter.map((el: any) => Date.parse(el.date)).filter(onlyUnique);
		const sortDate = allDates.sort((a: any, b: any) => a - b)
		body.findSellers = filter
		body.dates = sortDate
		body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' }, { borderColor: '#078191', backgroundColor: '#078191' },
		{ borderColor: '#cc1220', backgroundColor: '#cc1220' }, { borderColor: '#e05212', backgroundColor: '#e05212' },
		{ borderColor: '#d31184', backgroundColor: '#d31184' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' },]
		const { selectedSellers, colors } = body
		// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
		let dataArray: any[] = [];
		for (const seller of selectedSellers) { body.seller = seller; const res = await getChartDuration(body); dataArray.push(res); }
		if (dataArray.length === 0) { throw new Error("No data received from branches."); }
		// درست کردن لیبل های مقایسه ای
		let newNames = dataArray.map((name: any, idx: number) => name.newName.map((el: any) => el[0]))
		let labels: any = [];
		for (let i = 0; i < newNames.length; i++) {
			let combinedProducts = newNames[0].concat(newNames[i])
			labels.push(combinedProducts.filter(onlyUnique))
		}
		let datasets = dataArray.map((item: any, index: number) => {
			return ({
				label: item?.seller, data: item?.data, backgroundColor: colors[index].backgroundColor,
				fill: false, tension: 0.1,
				borderColor: colors[index].borderColor,
				pointBackgroundColor: colors[index].backgroundColor,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: colors[index].borderColor,
			})
		})
		let data = { labels: labels[0], datasets }
		return data
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت فروشنده' }
	}
}
export const getChartDuration = async (body: any) => {
	await connect()
	const { seller, dates, findSellers } = body
	try {
		const salesByDate = dates.map((date: any) => {
			const salesForCurrentDate: any = findSellers.map((el: any) => (el?.name == seller && date == Date.parse(el.date)) && el.totalSell).filter(Boolean)
			const totalSales = sumArray(salesForCurrentDate);
			return totalSales
		});

		const dayByDate = dates.map((date: any) => {
			const dayCurrentDate: any = findSellers.filter((el: any) => Date.parse(el.date) === date).map((el: any) => `${convertToPersianDate(date, 'YMD')}-${el.day}`).filter(onlyUnique);
			return dayCurrentDate
		});
		return JSON.parse(JSON.stringify({ seller: seller, data: salesByDate, newName: dayByDate }))

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت فروشنده' }
	}
}