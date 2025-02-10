'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import CompareLineChartBranch from "@/app/components/report/CompareLineChartBranch";
import CompareBarChartBranch from "@/app/components/report/CompareBarChartBranch";
import DDDatePicker from "@/app/components/DropDownDatePicker";
import { toast } from "react-toastify";
import { getSellers } from "@/app/action/seller.action";
import { convertToPersianDate, onlyUnique } from "@/app/utils/helpers";
import UserInDays from "@/app/components/userChart/UserInDays";
import UserInDuration from "@/app/components/userChart/UserInDuration";

export default function ComparePage() {
    const [selectedSeller, setSelectedSeller] = useState<any>('');
    const [selectedSellers, setSelectedSellers] = useState<any>([]);
    const [selectedDays, setSelectedDays] = useState<any>([]);
    const [toggle, setToggle] = useState<boolean>(false);
    const [viewChart, setViewChart] = useState<boolean>(false);
    const [viewDurationChart, setViewDurationChart] = useState<boolean>(false);
    const [selectedStartDate, setSelectedStartDate] = useState<any>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const fetchData = useCallback(async () => {
        let table = await getSellers({ isDeleted: false })
        setData(table)
    }, [])
    useEffect(() => { fetchData() }, [fetchData])
    let requestData = { selectedDays, selectedSellers,selectedStartDate,selectedEndDate }
    let sellers = data?.map((seller: any) => { return (seller?.name) }).filter(onlyUnique)
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> نمودار آمار فروش فروشنده </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <div className="col-6 "><button onClick={() => setToggle(!toggle)} className="btn btn-sm bg-custom-2 mb-2" type="button">{!toggle ? 'تبدیل به مقایسه در روزهای مختلف' : 'تبدیل به مقایسه در بازه زمانی'}</button></div>
                {toggle ? <div>
                    <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                        <div className="d-flex gap-3 col-12 ">
                            <DDDatePicker selectDate={(e: any) => setSelectedDays([...selectedDays, e])} type='انتخاب تاریخ' date='' />

                            <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedSeller(e.target.value) }}>
                                {<option hidden value=''>{selectedSeller ? selectedSeller : ' فروشنده رو انتخاب کنید'}</option>}
                                {sellers?.map((seller: any) => { return (<option key={nanoid()} value={seller}>{seller}</option>) })}
                            </select>

                            <button type="button" onClick={() => { !selectedSellers?.includes(selectedSeller) ? setSelectedSellers([...selectedSellers, selectedSeller]) : toast.error('این فروشنده قبلا انتخاب شده است'), setSelectedSeller(null) }} className="btn btn-sm bg-custom-2 text-nowrap">افزودن فروشنده </button>
                            <button type="button" onClick={() => { setSelectedSellers([]), setSelectedDays([]) }} className="btn btn-sm bg-custom-1 text-nowrap">ریست فیلتر </button>
                            <button type="button" onClick={() => { setViewChart(!viewChart) }} className="btn btn-sm bg-custom-4 text-nowrap">نمایش آمار</button>
                            <button type="button" onClick={() => { setViewChart(false) }} className="btn btn-sm bg-custom-3 text-nowrap">ریست آمار </button>
                        </div>
                    </section>
                    <div className="col-12 py-2 border-bottom fs85">
                        مقایسه بین فروشندگان: {selectedSellers?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>))}{'  '}
                        در تاریخ های: {selectedDays?.map((day: string) => (<span key={nanoid()}>{convertToPersianDate(day, 'YMD')} - </span>))}
                    </div>
                    {viewChart && <UserInDays requestData={requestData} />}
                </div>
                    : <div>
                        <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                            <div className="d-flex gap-3 col-12 ">
                                <DDDatePicker selectDate={(e: any) => setSelectedStartDate(e)} type='از تاریخ ....' date={selectedStartDate} />
                                <DDDatePicker selectDate={(e: any) => setSelectedEndDate(e)} type='تا تاریخ ....' date={selectedEndDate} />
                                <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedSeller(e.target.value) }}>
                                    {<option hidden value=''>{selectedSeller ? selectedSeller : ' فروشنده رو انتخاب کنید'}</option>}
                                    {sellers?.map((seller: any) => { return (<option key={nanoid()} value={seller}>{seller}</option>) })}
                                </select>

                                <button type="button" onClick={() => { !selectedSellers?.includes(selectedSeller) ? setSelectedSellers([...selectedSellers, selectedSeller]) : toast.error('این فروشنده قبلا انتخاب شده است'), setSelectedSeller(null) }} className="btn btn-sm bg-custom-2 text-nowrap">افزودن فروشنده </button>
                                <button type="button" onClick={() => { setSelectedSellers([]), setSelectedEndDate([]), setSelectedStartDate([]) }} className="btn btn-sm bg-custom-1 text-nowrap">ریست فیلتر </button>
                                <button type="button" onClick={() => { setViewDurationChart(!viewDurationChart) }} className="btn btn-sm bg-custom-4 text-nowrap">نمایش آمار</button>
                                <button type="button" onClick={() => { setViewDurationChart(false) }} className="btn btn-sm bg-custom-3 text-nowrap">ریست آمار </button>
                            </div>
                        </section>
                        <div className="col-12 py-2 border-bottom fs85">
                            مقایسه بین فروشندگان: {selectedSellers?.map((seller: string) => (<span key={nanoid()}>{seller} - </span>))}
                            در بازه زمانی {selectedStartDate !== null ? convertToPersianDate(selectedStartDate, 'YMD') : '----'}
                            {' '}الی{' '}{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '----'}
                        </div>
                        {viewDurationChart && <UserInDuration requestData={requestData} />}
                    </div>}

            </section >

        </>
    )
}