'use server'

import connect from '../lib/db'
import { sumArray } from '../utils/helpers'
import DBS from '@/models/DBS'

/* ----- dashboard ----- */
export const getAdminDashboard = async () => {
    await connect()
    const time = Date.now()
    try {
        // const allSeller = await Seller.find({ isDeleted: false }).select('createdAt name').lean()
        // let allNameSeller = allSeller.map((el: any) => el?.name)
        // const uniSeller = allNameSeller.filter(onlyUnique);

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

        let ReportLength = AllReports.length
        let ReportLastLength = lastWeekData.length
        // let SellerLength = uniSeller.length

        let data = { ReportLength, ReportLastLength, totalSumSell, totalLastWeekSumSell, totalSumReturn, totalLastWeekSumReturn, totalSumInvoice, totalLastWeekSumInvoice }
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت اطلاعات' }
    }
}
