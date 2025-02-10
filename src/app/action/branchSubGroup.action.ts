'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray } from '../utils/helpers'

export const getChartBranchSubGroup = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f55' }, { borderColor: '#078191', backgroundColor: '#07819155' },
	{ borderColor: '#cc1220', backgroundColor: '#cc122055' }, { borderColor: '#e05212', backgroundColor: '#e0521255' },
	{ borderColor: '#d31184', backgroundColor: '#d3118455' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f55' },]
	await connect()
	const { branch, startDate, endDate, startYear, startMonth, endYear, endMonth, subGroup, colors } = body

	const parsedStartDate = Date.parse(startDate);
	const parsedEndDate = Date.parse(endDate);
	try {
		const productsInStartMonth = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })
		const productsInEndMonth = (startYear !== endYear || startMonth !== endMonth) ? await Products.find({ year: convertNumbersToEnglish(endYear), month: convertNumbersToEnglish(endMonth) }) : []
		let combinedProducts = productsInStartMonth.concat(productsInEndMonth)
		const findGroup = combinedProducts.filter((el: any) => el.subGroup == subGroup)
		const allcategoies = findGroup.map((el: any) => el.category).filter(onlyUnique);
		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const filteredSales = findGroup.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch && el.date >= parsedStartDate && el.date <= parsedEndDate)
		);
		const allDates = filteredSales.map((el: any) => el.date).filter(onlyUnique);
		const sortDate = allDates.sort((a: any, b: any) => a - b)
		const salesByDate = sortDate.map((date) => {
			const salesForCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((el: any) => el.sell);
			const dayCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((el: any) => el.day);
			const totalSales = sumArray(salesForCurrentDate);

			return totalSales
		});

		const lineChart = {
			labels: sortDate.map(date => convertToPersianDate(date, 'YMD')), datasets: [{
				data: salesByDate, backgroundColor: colors[0].backgroundColor,
				fill:false,   tension: 0.1,
				borderColor: colors[0].borderColor,
				pointBackgroundColor: colors[0].backgroundColor,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: colors[0].borderColor,
			}], title: `نمودار فروش زیر گروه ${subGroup} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول فروش زیر گروه ${subGroup} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch
		};
		const barChart = await getGiveCategoryData(body, combinedProducts)
		return JSON.parse(JSON.stringify({ lineChart, barChart, allcategoies }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveCategoryData = async (body: any, combinedProducts: any) => {
	await connect()
	const { branch, startDate, endDate, subGroup, colors } = body
	// تبدیل تاریخ ها
	const parsedStartDate = Date.parse(startDate);
	const parsedEndDate = Date.parse(endDate);
	try {
		const allSubGroups = combinedProducts.filter((el: any) => el.subGroup == subGroup);
		let uniCategory = allSubGroups.map((el: any) => el.category).filter(onlyUnique)
		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const salesByGroup = uniCategory.map((category: string) => {
			const salesForCurrentGroup = combinedProducts.filter((el: any) => el.category === category);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date >= parsedStartDate && sale.date <= parsedEndDate);
				return accumulator + sumArray(filteredSales.map((sale: any) => sale.sell));
			}, 0);

			return totalSalesByGroup;
		});

		// اماده سازی ابجکت خروجی
		const result = {
			labels: uniCategory, datasets: [{
				data: salesByGroup, backgroundColor: colors[0].backgroundColor,
				fill:false,   tension: 0.1,
				borderColor: colors[0].borderColor,
				pointBackgroundColor: colors[0].backgroundColor,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: colors[0].borderColor,
			}], title: `نمودار مبلغ کل فروش دسته بندی های زیر گروه ${subGroup} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول مبلغ کل فروش دسته بندی های زیر گروه ${subGroup} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch
		};
		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}