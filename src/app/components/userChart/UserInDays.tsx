'use client'

import CompareBarChartBranchs from "../report/CompareBarChartBranchs"
import CompareRadarChartBranch from "../report/CompareRadarChartBranchs"
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { getChartSellerInDays } from "@/app/action/product.action";

export default function UserInDays({ requestData }: any) {
    const [radarChartData, setRadarChartData] = useState<any>(null);
    const [totalChartToggle, setTotalChartToggle] = useState(false)
    const [loader, setLoader] = useState(false)

    const handleFunction = async () => {
        setLoader(true);
        let res = await getChartSellerInDays(requestData)
        setRadarChartData(res)
        setLoader(false);
    }
    useEffect(() => { handleFunction() }, []);
    if (loader) { return <Spinner /> } else {
        return (
            <>
                <div className="py-3 border-bottom">
                    {totalChartToggle ? <button className="btn btn-sm bg-custom-2" onClick={() => setTotalChartToggle(!totalChartToggle)} type="button">تبدیل به نمایش بصورت نمودار میله ای</button> :
                        <button className="btn btn-sm bg-custom-4" onClick={() => setTotalChartToggle(!totalChartToggle)} type="button">تبدیل به نمایش بصورت نمودار راداری</button>}
                </div>
                {totalChartToggle ? <CompareRadarChartBranch compareData={radarChartData} /> :
                    <CompareBarChartBranchs compareData={radarChartData} />}
            </>
        )
    }
}