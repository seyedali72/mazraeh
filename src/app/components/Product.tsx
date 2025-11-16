'use client'

import { useEffect, useState } from "react";
import { getChartProductsForTotal } from "@/app/action/branchsTotal.action";
import Spinner from "./Spinner";
import CompareRadarChartBranch from "./report/CompareRadarChartBranchs";
import CompareBarChartBranchs from "./report/CompareBarChartBranchs";
import { getChartProductsDuration } from "../action/productsTotal.action";

export default function ProductChartCmp({ requestData, allGroup }: any) {
    const [barChartData, setBarChartData] = useState<any>(null);
    const [radarChartData, setRadarChartData] = useState<any>(null);
    const [totalChartToggle, setTotalChartToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [type, setType] = useState('sell')

    const handleTotalAndGroup = async () => {
        setLoader(true);
        requestData.type = type
        let res = await getChartProductsDuration(requestData)
         setRadarChartData(res?.RadarData)
        // setBarChartData(res?.BarData)
        // allGroup(res?.allGroups)
        setLoader(false);
    }
    useEffect(() => { handleTotalAndGroup() }, [type]);
    if (loader) { return <Spinner /> } else {
        return (
            <>
                <div className="py-3 border-bottom">
                    {totalChartToggle ? <button className="btn btn-sm bg-custom-2" onClick={() => setTotalChartToggle(!totalChartToggle)} type="button">تبدیل به نمایش بصورت نمودار میله ای</button> :
                        <button className="btn btn-sm bg-custom-4" onClick={() => setTotalChartToggle(!totalChartToggle)} type="button">تبدیل به نمایش بصورت نمودار راداری</button>}
                    {type == 'return' ? <button className="btn btn-sm mx-1 bg-custom-1" onClick={() => setType('sell')} type="button">تبدیل به نمایش اطلاعات فروش</button>
                        : <button className="btn btn-sm mx-1 bg-custom-3" onClick={() => setType('return')} type="button">تبدیل به نمایش اطلاعات مرجوعی</button>}
                </div>
                {totalChartToggle ? <CompareRadarChartBranch compareData={radarChartData} /> : <CompareBarChartBranchs compareData={radarChartData} />}
            </>
        )
    }
}