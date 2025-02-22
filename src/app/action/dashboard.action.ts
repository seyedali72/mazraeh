'use server'

import connect from '../lib/db'
import { onlyUnique, sumArray } from '../utils/helpers'
import DBS from '@/models/DBS'

/* ----- dashboard ----- */
export const getAdminDashboard = async () => {
    const bgColors = ['#2d7c4f', '#cc1220', '#078191', '#e05212', '#d31184', '#2d7c4f',]
    const borderColors = ['#2d7c4f', '#cc1220', '#078191', '#e05212', '#d31184', '#2d7c4f',]

    await connect()
    const time = Date.now()
    try {

        const AllReports = await DBS.find({ isDeleted: false }).lean()
        const lastWeekData = AllReports.filter((el: any) => (time - el.createdAt) < 604800000)

        let totalSellArray: any = AllReports.map((el: any) => el?.totalSell)
        const totalSumSell = sumArray(totalSellArray);

        let totalReturnArray: any = AllReports.map((el: any) => el?.totalReturn)
        const totalSumReturn = sumArray(totalReturnArray);

        let totalInvoiceArray: any = AllReports.map((el: any) => el?.totalInvoice)
        const totalSumInvoice = sumArray(totalInvoiceArray);

        let totalLastWeekSellArray: any = lastWeekData.map((el: any) => el?.totalSell)
        const totalLastWeekSumSell = sumArray(totalLastWeekSellArray);

        let totalLastWeekReturnArray: any = lastWeekData.map((el: any) => el?.totalReturn)
        const totalLastWeekSumReturn = sumArray(totalLastWeekReturnArray);

        let totalLastWeekInvoiceArray: any = lastWeekData.map((el: any) => el?.totalInvoice)
        const totalLastWeekSumInvoice = sumArray(totalLastWeekInvoiceArray);

        let ReportLength = AllReports.length / 4; let ReportLastLength = lastWeekData.length / 4

        let branchsArray = AllReports?.map((report: any) => report.branch)?.filter(onlyUnique)
        let avrageTotalSell = branchsArray?.map((branch: any) => {
            let find: any = AllReports?.map((rep: any) => rep.branch == branch && rep.totalSell)
            let total = sumArray(find)
            return total / ReportLength
        })
        let totalSell = branchsArray?.map((branch: any) => {
            let find: any = AllReports?.map((rep: any) => rep.branch == branch && rep.totalSell)
            let total = sumArray(find)
            return total
        })

        let totalReturn = branchsArray?.map((branch: any) => {
            let find: any = AllReports?.map((rep: any) => rep.branch == branch && rep.totalReturn)
            let total = sumArray(find)
            return total
        })

        let totalInvoice = branchsArray?.map((branch: any) => {
            let find: any = AllReports?.map((rep: any) => rep.branch == branch && rep.totalInvoice)
            let total = sumArray(find)
            return total
        })

        let totalBascket = totalSell.map((arr: any, index: number) => (arr / totalInvoice[index]).toFixed(0))

        let totalSellChart = { labels: branchsArray, datasets: [{ label: 'مبلغ به ريال', data: totalSell, backgroundColor: bgColors, borderColor: borderColors }], title: 'نمودار فروش کل به تفکیک شعب' }
        let totalReturnChart = { labels: branchsArray, datasets: [{ label: 'مبلغ به ريال', data: totalReturn, backgroundColor: bgColors, borderColor: borderColors }], title: 'نمودار مرجوعی کل به تفکیک شعب' }
        let totalInvoiceChart = { labels: branchsArray, datasets: [{ label: 'مبلغ به ريال', data: totalInvoice, backgroundColor: bgColors, borderColor: borderColors }], title: 'نمودار تعداد فاکتور کل به تفکیک شعب' }
        let avrageTotalSellChart = { labels: branchsArray, datasets: [{ label: 'مبلغ به ريال', data: avrageTotalSell, backgroundColor: bgColors, borderColor: borderColors }], title: 'نمودار میانگین فروش کل به تفکیک شعب' }
        let bascketBranchChart = { labels: branchsArray, datasets: [{ label: 'مبلغ به ريال', data: totalBascket, backgroundColor: bgColors, borderColor: borderColors }], title: 'نمودار میانگین سبدخرید به تفکیک شعب' }

        let data = { avrageTotalSellChart, bascketBranchChart, totalInvoiceChart, totalSellChart, totalReturnChart, ReportLength, ReportLastLength, totalSumSell, totalLastWeekSumSell, totalSumReturn, totalLastWeekSumReturn, totalSumInvoice, totalLastWeekSumInvoice }
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت اطلاعات' }
    }
}
