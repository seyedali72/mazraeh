'use client'

import CompareBarChartBranchs from "../report/CompareBarChartBranchs"
import CompareRadarChartBranch from "../report/CompareRadarChartBranchs"
import { useEffect, useState } from "react";
import { getChartBranchCategories } from "@/app/action/branchsCategory.action";
import Spinner from "../Spinner";
import { getChartBranchCategoriesForDay } from "@/app/action/branchsCategoryDay.action";

export default function CategoryAndProductDayCmp({ requestData, allProduct }: any) {
    const [barChartData, setBarChartData] = useState<any>(null);
    const [radarChartData, setRadarChartData] = useState<any>(null);
    const [totalChartToggle, setTotalChartToggle] = useState(false)
    const [detailChartToggle, setDetailChartToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [type, setType] = useState('sell')

    const handleCategoryAndProduct = async () => {
        setLoader(true);
        requestData.type = type
        let res = await getChartBranchCategoriesForDay(requestData)
        setBarChartData(res?.productChart)
        setRadarChartData(res?.categoryChart)
        allProduct(res?.allproducts)
        setLoader(false);
    }
    useEffect(() => { handleCategoryAndProduct() }, [type]);
    if (loader) { return <Spinner /> } else {
        return (
            <>
                <div className="py-3 border-bottom">
                    {totalChartToggle ? <button className="btn btn-sm bg-custom-2" onClick={() => setTotalChartToggle(!totalChartToggle)} type="button">تبدیل به نمایش بصورت نمودار میله ای</button> :
                        <button className="btn btn-sm bg-custom-4" onClick={() => setTotalChartToggle(!totalChartToggle)} type="button">تبدیل به نمایش بصورت نمودار راداری</button>}
                    {type == 'return' ? <button className="btn btn-sm mx-1 bg-custom-1" onClick={() => setType('sell')} type="button">تبدیل به نمایش اطلاعات فروش</button>
                        : <button className="btn btn-sm mx-1 bg-custom-3" onClick={() => setType('return')} type="button">تبدیل به نمایش اطلاعات مرجوعی</button>}
                </div>
                {totalChartToggle ? <CompareRadarChartBranch compareData={radarChartData} /> :
                    <CompareBarChartBranchs compareData={radarChartData} />}

                {detailChartToggle ? <button className="btn btn-sm bg-custom-2" onClick={() => setDetailChartToggle(!detailChartToggle)} type="button">تبدیل به نمایش بصورت نمودار میله ای</button> :
                    <button className="btn btn-sm bg-custom-4" onClick={() => setDetailChartToggle(!detailChartToggle)} type="button">تبدیل به نمایش بصورت نمودار راداری</button>}
                {detailChartToggle ? <CompareRadarChartBranch compareData={barChartData} /> :
                    <CompareBarChartBranchs compareData={barChartData} />}
            </>
        )
    }
}