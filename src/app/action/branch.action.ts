'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray } from '../utils/helpers'

export const getChartProduct = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' }, { borderColor: '#078191', backgroundColor: '#078191' },
	{ borderColor: '#cc1220', backgroundColor: '#cc1220' }, { borderColor: '#e05212', backgroundColor: '#e05212' },
	{ borderColor: '#d31184', backgroundColor: '#d31184' }, { borderColor: '#2d7c4f', backgroundColor: '#0aa04b' },]
	await connect()
	const { branch, startDate, endDate, startYear, startMonth, endYear, endMonth, colors } = body
	let loop = (endDate - startDate) / 86400000
	let spliteDateArray: any = []
	for (let i = 0; i <= loop; i++) {
		let value = startDate + (86400000 * i)
		spliteDateArray.push(value)
	}

	try {
		const productsInStartMonth = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })
		const productsInEndMonth = (startYear !== endYear || startMonth !== endMonth) ? await Products.find({ year: convertNumbersToEnglish(endYear), month: convertNumbersToEnglish(endMonth) }) : []
		let combinedProducts = productsInStartMonth.concat(productsInEndMonth)
		const allGroups = combinedProducts.map((el: any) => el.group).filter(onlyUnique);
		const filteredSales = combinedProducts.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch && el.date >= startDate && el.date <= endDate)
		);

		const salesByDate = spliteDateArray.map((date: any) => {
			const salesForCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((el: any) => el.sell);
			const totalSales = sumArray(salesForCurrentDate);
			return totalSales
		});
		const dayName = spliteDateArray.map((date: any) => {
			const dayCurrentDate: any = filteredSales.map((el: any) => el.date === date && el.day).filter(Boolean).filter(onlyUnique)
			let name = `${convertToPersianDate(date, 'YMD')}-${dayCurrentDate[0]}`
			return name.length > 0 ? name : [`${convertToPersianDate(date, 'YMD')}`]
		});

		const lineChart = {
			labels: dayName, datasets: [{
				label: branch,
				data: salesByDate, backgroundColor: colors[0].backgroundColor,
				fill: false, tension: 0.1,
				borderColor: colors[0].borderColor,
				pointBackgroundColor: colors[0].backgroundColor,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: colors[0].borderColor,
			}], title: `نمودار فروش ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول فروش ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `
		};
		const barChart = await getGiveGroupData(body, combinedProducts)
		return JSON.parse(JSON.stringify({ lineChart, barChart, allGroups }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveGroupData = async (body: any, combinedProducts: any) => {
	await connect()
	const { branch, startDate, endDate, colors } = body

	try {
		const allGroups = combinedProducts.map((el: any) => el.group).filter(onlyUnique);

		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const salesByGroup = allGroups.map((group: string) => {
			const salesForCurrentGroup = combinedProducts.filter((el: any) => el.group === group);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date >= startDate && sale.date <= endDate);
				return accumulator + sumArray(filteredSales.map((sale: any) => sale.sell));
			}, 0);

			return totalSalesByGroup;
		});

		// اماده سازی ابجکت خروجی
		const result = {
			labels: allGroups, datasets: [{
				label: branch,
				data: salesByGroup, backgroundColor: colors[0].backgroundColor,
				fill: false, tension: 0.1,
				borderColor: colors[0].borderColor,
				pointBackgroundColor: colors[0].backgroundColor,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: colors[0].borderColor,
			}], title: `نمودار مبلغ کل فروش گروه کالا  ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول مبلغ کل فروش گروه کالا  ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch
		};
		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}