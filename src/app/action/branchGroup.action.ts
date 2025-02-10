'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray } from '../utils/helpers'

export const getChartBranchGroup = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f55' }, { borderColor: '#078191', backgroundColor: '#07819155' },
	{ borderColor: '#cc1220', backgroundColor: '#cc122055' }, { borderColor: '#e05212', backgroundColor: '#e0521255' },
	{ borderColor: '#d31184', backgroundColor: '#d3118455' }, { borderColor: '#2d7c4f', backgroundColor: '#0aa0ebb' },]
	await connect()
	const { branch, startDate, endDate, startYear, startMonth, endYear, endMonth, group, colors } = body

	const parsedStartDate = Date.parse(startDate);
	const parsedEndDate = Date.parse(endDate);
	try {
		const productsInStartMonth = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })
		const productsInEndMonth = (startYear !== endYear || startMonth !== endMonth) ? await Products.find({ year: convertNumbersToEnglish(endYear), month: convertNumbersToEnglish(endMonth) }) : []
		let combinedProducts = productsInStartMonth.concat(productsInEndMonth)
		const findGroup = combinedProducts.filter((el: any) => el.group == group)
		const allSubGroups = findGroup.map((el: any) => el.subGroup).filter(onlyUnique);
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
			}], title: `نمودار فروش گروه ${group} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول فروش گروه ${group} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch
		};
		const barChart = await getGiveSubGroupData(body, combinedProducts)
		return JSON.parse(JSON.stringify({ lineChart, barChart, allSubGroups }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveSubGroupData = async (body: any, combinedProducts: any) => {
	await connect()
	const { branch, startDate, endDate, group, colors } = body
	// تبدیل تاریخ ها
	const parsedStartDate = Date.parse(startDate);
	const parsedEndDate = Date.parse(endDate);
	try {
		const allGroups = combinedProducts.filter((el: any) => el.group == group);
		let filtered = allGroups.map((el: any) => el.subGroup).filter(onlyUnique)
		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const salesByGroup = filtered.map((subGroup: string) => {
			const salesForCurrentGroup = combinedProducts.filter((el: any) => el.subGroup === subGroup);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date >= parsedStartDate && sale.date <= parsedEndDate);
				return accumulator + sumArray(filteredSales.map((sale: any) => sale.sell));
			}, 0);

			return totalSalesByGroup;
		});

		// اماده سازی ابجکت خروجی
		const result = {
			labels: filtered, datasets: [{
				data: salesByGroup, backgroundColor: colors[0].backgroundColor,
				fill:false,   tension: 0.1,
				borderColor: colors[0].borderColor,
				pointBackgroundColor: colors[0].backgroundColor,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: colors[0].borderColor,
			}], title: `نمودار مبلغ کل فروش زیر گروه های ${group} ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول مبلغ کل فروش زیر گروه های ${group} ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch
		};
		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}