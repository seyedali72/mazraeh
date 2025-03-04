'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { convertToPersianDate, spliteNumber } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { getDBSs } from "@/app/action/report.action";
import CompareLineChartBranch from "@/app/components/report/CompareLineChartBranch";
import CompareBarChartBranch from "@/app/components/report/CompareBarChartBranch";
import { getChartProduct } from "@/app/action/branch.action";
import { getChartBranchGroup } from "@/app/action/branchGroup.action";
import { getChartBranchSubGroup } from "@/app/action/branchSubGroup.action";
import { getChartBranchCategory } from "@/app/action/branchCategory.action";
import { useReactToPrint } from "react-to-print";
import HeaderPage from "@/app/components/Header";

export default function ComparePage() {
    const [allGroup, setAllGroup] = useState<any>([]);
    const [allSubGroup, setAllSubGroup] = useState<any>([]);
    const [allCategory, setAllCategory] = useState<any>([]);
    const [compareBtn, setCompareBtn] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [lineChartData, setLineChartData] = useState<any>(null);
    const [barChartData, setBarChartData] = useState<any>(null);
    const fetchData = useCallback(async () => {
        let table = await getDBSs({ isDeleted: false })
        setData(table)
    }, [])
    const branches = ['فروشگاه کهنز', 'فروشگاه معلم', 'فروشگاه کلهر', 'فروشگاه رباط کریم']
    useEffect(() => { fetchData() }, [fetchData])
    let startYear = convertToPersianDate(selectedDate, 'Y')
    let startMonth = convertToPersianDate(selectedDate, 'M')
    let endYear = convertToPersianDate(selectedEndDate, 'Y')
    let endMonth = convertToPersianDate(selectedEndDate, 'M')
    let requestData: any = { branch: selectedBranch, startDate: selectedDate, endDate: selectedEndDate, startYear, startMonth, endYear, endMonth }

    const handleGroupOnList = async (branch: any) => {
        requestData.branch = branch
        setCompareBtn(false)
        let res = await getChartProduct(requestData)
        setLineChartData(res?.lineChart)
        setBarChartData(res?.barChart)
        setAllGroup(res?.allGroups)
        setCompareBtn(true)
    }
    const handleSubGroupOnGroup = async (group: any) => {
        setCompareBtn(false)
        requestData.group = group
        let res = await getChartBranchGroup(requestData)
        setLineChartData(res?.lineChart)
        setBarChartData(res?.barChart)
        setAllSubGroup(res?.allSubGroups)
        setCompareBtn(true)
    }
    const handleCategoryOnSubGroup = async (subGroup: any) => {
        setCompareBtn(false)
        requestData.subGroup = subGroup
        let res = await getChartBranchSubGroup(requestData)
        setLineChartData(res?.lineChart)
        setBarChartData(res?.barChart)
        setAllCategory(res?.allcategoies)
        setCompareBtn(true)
    }
    const handleProductsOnCategory = async (category: any) => {
        setCompareBtn(false)
        requestData.category = category
        let res = await getChartBranchCategory(requestData)
        setLineChartData(res?.lineChart)
        setBarChartData(res?.barChart)
        setCompareBtn(true)
    }

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    return (
        <>
            <HeaderPage type='singleBranch'
                print={() => reactToPrintFn()} branchs={(e: any) => console.log(e)}
                startDate={(e: any) => setSelectedDate(e)} endDate={(e: any) => setSelectedEndDate(e)}
                viewBranchAnaltics={(e: any) => handleGroupOnList(e)}
                dates={(e: any) => console.log(e)} viewTotalCMP={() => console.log(true)}
                viewChart={() => setCompareBtn(true)} branch={(e: any) => setSelectedBranch(e)}
                resetCompare={() => { setAllCategory([]), setAllGroup([]), setAllSubGroup([]), setCompareBtn(false) }}
                selectSellers={(e: any) => console.log(e)}  
                values={(e: any) => console.log(e)} searchType={(e: any) => console.log(e)}
            />
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">  نمودار فروش شعبه </li>
                </ol>
            </nav>
            <section ref={contentRef} className="main-body-container rounded">

                {allGroup?.length !== 0 && <div className="border-bottom pb-2 d-flex flex-wrap align-item-center gap-1">
                    <span className="fs80"> گروه کالا:</span> {allGroup?.map((item: any) => { return (<span key={nanoid()} onClick={() => { handleSubGroupOnGroup(item) }} className="p-1 fs75 cursorPointer rounded bg-custom-2 btnStyle ">{' '}{item}{' '}</span>) })}
                </div>}
                {allSubGroup?.length !== 0 && <div className="border-bottom py-2 d-flex flex-wrap align-item-center gap-1">
                    <span className="fs80"> زیرگروه کالا:</span> {allSubGroup?.map((item: any) => { return (<span key={nanoid()} onClick={() => { handleCategoryOnSubGroup(item) }} className="p-1 fs75 cursorPointer rounded bg-custom-4 btnStyle">{item}</span>) })}
                </div>}
                {allCategory?.length !== 0 && <div className="border-bottom py-2 d-flex flex-wrap align-item-center gap-1">
                    <span className="fs80"> دسته کالا:</span> {allCategory?.map((item: any) => { return (<span key={nanoid()} onClick={() => { handleProductsOnCategory(item) }} className="p-1 fs75 cursorPointer rounded bg-custom-1 btnStyle">{item}</span>) })}
                </div>}

                {!compareBtn ?
                    <section className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>نام فروشگاه</th>
                                    <th>تاریخ</th>
                                    <th>مبلغ فروش</th>
                                    <th>مبلغ مرجوعی</th>
                                    <th>تعداد فاکتور</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.filter((el: any) => {
                                    const isBranchMatch = selectedBranch ? el.branch === selectedBranch : true;
                                    const isDateMatch = selectedDate ? Date.parse(el.date) >= selectedDate : true;
                                    const isDateEndMatch = selectedDate ? Date.parse(el.date) <= selectedEndDate : true;
                                    return isBranchMatch && isDateMatch && isDateEndMatch;
                                }).map((el: any, idx: number) => (
                                    <tr key={idx} className='fs80'>
                                        <td className='text-center'>{idx + 1}</td>
                                        <td>{el.branch}</td>
                                        <td>{convertToPersianDate(el.date, 'YMD')}</td>
                                        <td>{spliteNumber(el.totalSell)} ریال</td>
                                        <td>{spliteNumber(el.totalReturn)} ریال</td>
                                        <td>{spliteNumber(el.totalInvoice)}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </section> :
                    <>
                        <CompareLineChartBranch compareData={lineChartData} />
                        <CompareBarChartBranch compareData={barChartData} />
                    </>}
            </section >

        </>
    )
}