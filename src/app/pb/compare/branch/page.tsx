'use client'

import { useCallback, useEffect, useState } from "react";
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
import DDDatePicker from "@/app/components/DropDownDatePicker";

export default function ComparePage() {
    const [selectedGroup, setSelectedGroup] = useState<any>([]);
    const [selectedSubGroup, setSelectedSubGroup] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>([]);
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
    useEffect(() => { fetchData() }, [fetchData])
    let startYear = convertToPersianDate(selectedDate, 'Y')
    let startMonth = convertToPersianDate(selectedDate, 'M')
    let endYear = convertToPersianDate(selectedEndDate, 'Y')
    let endMonth = convertToPersianDate(selectedEndDate, 'M')
    let requestData: any = { branch: selectedBranch, startDate: selectedDate, endDate: selectedEndDate, startYear, startMonth, endYear, endMonth }

    const handleGroupOnList = async () => {
        setCompareBtn(false)
        let res = await getChartProduct(requestData)
        setLineChartData(res?.lineChart)
        setBarChartData(res?.barChart)
        setSelectedGroup(res?.allGroups)
        setCompareBtn(true)
    }
    const handleSubGroupOnGroup = async (group: any) => {
        setCompareBtn(false)
        requestData.group = group
        let res = await getChartBranchGroup(requestData)
        setLineChartData(res?.lineChart)
        setBarChartData(res?.barChart)
        setSelectedSubGroup(res?.allSubGroups)
        setCompareBtn(true)
    }
    const handleCategoryOnSubGroup = async (subGroup: any) => {
        setCompareBtn(false)
        requestData.subGroup = subGroup
        let res = await getChartBranchSubGroup(requestData)
        setLineChartData(res?.lineChart)
        setBarChartData(res?.barChart)
        setSelectedCategory(res?.allcategoies)
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


    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">  نمودار فروش شعبه </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    <div className="d-flex gap-3 col-12 ">
                        <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedBranch(e.target.value), setSelectedDate(null) }}>
                            <option hidden value=''>فروشگاه را انتخاب کنید</option>
                            <option value="فروشگاه کهنز">فروشگاه کهنز</option>
                            <option value="فروشگاه رباط کریم">فروشگاه رباط کریم</option>
                            <option value="فروشگاه کلهر">فروشگاه کلهر</option>
                            <option value="فروشگاه معلم">فروشگاه معلم</option>
                        </select>

                        <DDDatePicker selectDate={(e: any) => setSelectedDate(e)} type='از تاریخ ....' date={selectedDate} />
                        <DDDatePicker selectDate={(e: any) => setSelectedEndDate(e)} type='تا تاریخ ....' date={selectedEndDate} />
                        <button type="button" onClick={() => { setSelectedBranch(null), setSelectedDate(null), setSelectedEndDate(null) }} className="btn btn-sm bg-custom-1 text-nowrap">ریست فیلتر </button>
                        <button type="button" onClick={() => { handleGroupOnList() }} className="btn btn-sm bg-custom-4 text-nowrap">نمایش آمار</button>
                        <button type="button" onClick={() => { setCompareBtn(false), setSelectedCategory([]), setSelectedGroup([]), setSelectedSubGroup([]) }} className="btn btn-sm bg-custom-3 text-nowrap">ریست آمار </button>
                    </div>
                </section>
                {selectedGroup?.length !== 0 && <div className="border-bottom py-2 d-flex flex-wrap align-item-center gap-1">
                    <span className="fs80"> گروه های کالایی:</span> {selectedGroup?.map((item: any) => { return (<span key={nanoid()} onClick={() => { handleSubGroupOnGroup(item) }} className="p-1 fs75 cursorPointer rounded bg-custom-2 btnStyle ">{' '}{item}{' '}</span>) })}
                </div>}
                {selectedSubGroup?.length !== 0 && <div className="border-bottom py-2 d-flex flex-wrap align-item-center gap-1">
                    <span className="fs80"> زیرگروه های کالایی:</span> {selectedSubGroup?.map((item: any) => { return (<span key={nanoid()} onClick={() => { handleCategoryOnSubGroup(item) }} className="p-1 fs75 cursorPointer rounded bg-custom-4 btnStyle">{item}</span>) })}
                </div>}
                {selectedCategory?.length !== 0 && <div className="border-bottom py-2 d-flex flex-wrap align-item-center gap-1">
                    <span className="fs80"> دسته بندی محصولات:</span> {selectedCategory?.map((item: any) => { return (<span key={nanoid()} onClick={() => { handleProductsOnCategory(item) }} className="p-1 fs75 cursorPointer rounded bg-custom-1 btnStyle">{item}</span>) })}
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