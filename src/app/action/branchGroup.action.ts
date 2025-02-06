'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray } from '../utils/helpers'


export const getChartBranchGroup = async (body: any) => {

	await connect()
	const { branch, startDate, endDate, startYear, startMonth, endYear, endMonth, group } = body

	const parsedStartDate = Date.parse(startDate);
	const parsedEndDate = Date.parse(endDate);
	try {
		const productsInStartMonth = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })
		const productsInEndMonth = await Products.find({ year: convertNumbersToEnglish(endYear), month: convertNumbersToEnglish(endMonth) })
		let combinedProducts = productsInStartMonth.concat(productsInEndMonth)
		const findGroup = combinedProducts.filter((el: any) => el.group == group)
		const allSubGroups = findGroup.map((el: any) => el.subGroup).filter(onlyUnique);

		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const allProGroup = combinedProducts.filter((el: any) => el.group === group);
		const filteredSales = allProGroup.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch && el.date >= parsedStartDate && el.date <= parsedEndDate)
		);
		const allDates = filteredSales.map((el: any) => el.date).filter(onlyUnique);
		const sortDate = allDates.sort((a: any, b: any) => a - b)
		const salesByDate = sortDate.map((date) => {
			const salesForCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((el: any) => el.sell);
			const dayCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((el: any) => el.day);
			const totalSales = sumArray(salesForCurrentDate) / 2;

			return { branch: `${convertToPersianDate(date, 'YMD')}-${dayCurrentDate[0]}`, dataset: { name: convertToPersianDate(date, 'YMD'), totalSell: totalSales } };
		});

		const lineChart = { labels: sortDate.map(date => convertToPersianDate(date, 'YMD')), data: salesByDate, title: `نمودار فروش گروه ${group} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول فروش گروه ${group} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch };
		const barChart = await getGiveSubGroupData(body, combinedProducts)
		return JSON.parse(JSON.stringify({ lineChart, barChart, allSubGroups }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveSubGroupData = async (body: any, combinedProducts: any) => {
	await connect()
	const { branch, startDate, endDate, group } = body
	// تبدیل تاریخ ها
	const parsedStartDate = Date.parse(startDate);
	const parsedEndDate = Date.parse(endDate);
	try {
		const allSubGroups = combinedProducts.filter((el: any) => el.group == group);
		let filtered = allSubGroups.map((el: any) => el.subGroup).filter(onlyUnique)
		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const salesByGroup = filtered.map((subGroup: string) => {
			const salesForCurrentGroup = combinedProducts.filter((el: any) => el.subGroup === subGroup);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date >= parsedStartDate && sale.date <= parsedEndDate);
				return accumulator + sumArray(filteredSales.map((sale: any) => sale.sell));
			}, 0);

			return totalSalesByGroup / 2;
		});

		// اماده سازی ابجکت خروجی
		const result = { labels: filtered, data: salesByGroup, title: `نمودار مبلغ کل فروش زیر گروه های ${group} ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول مبلغ کل فروش زیر گروه های ${group} ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch };

		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}