'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { convertToPersianDate } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { getDBSs } from "@/app/action/report.action";
import { toast } from "react-toastify";
import TotalAndGroupCmp from "@/app/components/charts/TotalAndGroup";
import GroupAndSubGroupCmp from "@/app/components/charts/GroupAndSubGroup";
import SubGroupAndCategoryCmp from "@/app/components/charts/SubGroupAndCategory";
import CategoryAndProductCmp from "@/app/components/charts/CategoryAndProduct";
import DDDatePicker from "@/app/components/DropDownDatePicker";

export default function ComparePage() {
    const [allGroup, setAllGroup] = useState<any>([]);
    const [selectedGroup, setSelectedGroup] = useState<any>('');
    const [allSubGroup, setAllSubGroup] = useState<any>([]);
    const [selectedSubGroup, setSelectedSubGroup] = useState<any>('');
    const [allCategory, setAllCategory] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>([]);
    const [allProduct, setAllProduct] = useState<any>([]);
    const [viewChart, setViewChart] = useState(false)
    const [viewTotalCMP, setViewTotalCMP] = useState(false)
    const [viewGroupCMP, setViewGroupCMP] = useState(false)
    const [viewSubGroupCMP, setViewSubGroupCMP] = useState(false)
    const [viewCategoryCMP, setViewCategoryCMP] = useState(false)
    const [selectedBranchs, setSelectedBranchs] = useState<any>([]);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const fetchData = useCallback(async () => {
        let table = await getDBSs({ isDeleted: false })
        setData(table)
    }, [])
    useEffect(() => { fetchData() }, [fetchData])
    let startYear = convertToPersianDate(selectedDate, 'Y')
    let startMonth = convertToPersianDate(selectedDate, 'M')
    let endYear = convertToPersianDate(selectedEndDate, 'Y')
    let endMonth = convertToPersianDate(selectedEndDate, 'M')
    const requestData = { branchs: selectedBranchs, startDate: selectedDate, endDate: selectedEndDate, startYear, startMonth, endYear, endMonth, group: selectedGroup, subGroup: selectedSubGroup, category: selectedCategory }

    const branches = ['فروشگاه کهنز', 'فروشگاه معلم', 'فروشگاه کلهر', 'فروشگاه رباط کریم']
    const renderItems = (items: string[], label: string, onClick: (item: string) => void, bgColor: string) => {
        if (items.length === 0) return null;

        return (<div className="border-bottom py-2 d-flex flex-wrap align-item-center gap-1">
            <span className="fs80">{label}:</span>
            {items.map((item) => (<span key={nanoid()} onClick={() => onClick(item)} className={`p-1 fs75 cursorPointer rounded ${bgColor} btnStyle`} > {item} </span>))}
        </div>);
    };
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> مقایسه نمودار فروش چند شعبه در یک بازه زمانی </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    <div className="d-flex gap-3 col-12 ">
                        <DDDatePicker selectDate={(e: any) => setSelectedDate(e)} type='از تاریخ ....' date={selectedDate}/>
                        <DDDatePicker selectDate={(e: any) => setSelectedEndDate(e)} type='تا تاریخ ....' date={selectedEndDate}/>
                        <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedBranch(e.target.value) }}>
                            {selectedBranch ? <option hidden value=''>{selectedBranch}</option> : <option hidden value=''>فروشگاه رو انتخاب کنید</option>}
                            {branches?.map((branch: any) => { return (<option key={nanoid()} value={branch}>{branch}</option>) })}
                        </select>
                        {/* 
                        <select className="form-control form-control-sm" onChange={(e: any) => setSelectedDate(e.target.value)}>
                            <option hidden value=''>{selectedDate ? convertToPersianDate(selectedDate, 'YMD') : ' از تاریخ ....'}</option>
                            {data?.map((el: any) => { if (el?.branch == selectedBranch) { return (<option key={nanoid()} value={el?.date}>{convertToPersianDate(el?.date, 'YMD')}</option>) } })}
                        </select>
                        <select className="form-control form-control-sm" onChange={(e: any) => setSelectedEndDate(e.target.value)}>
                            <option hidden value=''>{selectedEndDate ? convertToPersianDate(selectedEndDate, 'YMD') : ' الی تاریخ ....'}</option>
                            {data?.map((el: any) => {
                                if (el?.branch == selectedBranch && el?.date >= selectedDate) { return (<option key={nanoid()} value={el?.date}>{convertToPersianDate(el?.date, 'YMD')}</option>) }
                            })}
                        </select> */}

                        <button type="button" onClick={() => { !selectedBranchs?.includes(selectedBranch) ? setSelectedBranchs([...selectedBranchs, selectedBranch]) : toast.error('این شعبه قبلا انتخاب شده است'), setSelectedBranch(null) }} className="btn btn-sm bg-custom-2 text-nowrap">افزودن شعبه </button>
                        <button type="button" onClick={() => { setSelectedBranch(null), setSelectedBranchs([]), setSelectedDate(null), setSelectedEndDate(null) }} className="btn btn-sm bg-custom-1 text-nowrap">ریست فیلتر </button>
                        <button type="button" onClick={() => { setViewTotalCMP(true), setViewChart(!viewChart) }} className="btn btn-sm bg-custom-4 text-nowrap">انجام مقایسه</button>
                        <button type="button" onClick={() => { setAllCategory([]), setAllProduct([]), setAllGroup([]), setAllSubGroup([]), setViewCategoryCMP(false), setViewGroupCMP(false), setViewSubGroupCMP(false), setViewTotalCMP(false) }} className="btn btn-sm bg-custom-3 text-nowrap">ریست مقایسه </button>
                    </div>
                </section>
                <div className="col-12 py-2 border-bottom fs85">
                    مقایسه بین شعبات: {selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} - </span>))}
                    در بازه زمانی {selectedDate !== null ? convertToPersianDate(selectedDate, 'YMD') : '----'}
                    {' '}الی{' '}{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '----'}
                </div>
                {renderItems(allGroup, "گروه های کالایی", (item) => { setViewCategoryCMP(false); setViewSubGroupCMP(false); setViewTotalCMP(false); setAllProduct([]); setAllCategory([]); setAllSubGroup([]); setSelectedGroup(item); setViewChart(!viewChart); setViewGroupCMP(true); }, "bg-custom-2")}

                {renderItems(allSubGroup, "زیرگروه های کالایی", (item) => { setViewCategoryCMP(false); setViewGroupCMP(false); setViewTotalCMP(false); setAllProduct([]); setAllCategory([]); setSelectedSubGroup(item); setViewChart(!viewChart); setViewSubGroupCMP(true); }, "bg-custom-4")}

                {renderItems(allCategory, "دسته بندی محصولات", (item) => { setViewGroupCMP(false); setViewSubGroupCMP(false); setViewTotalCMP(false); setSelectedCategory(item); setViewChart(!viewChart); setViewCategoryCMP(true); }, "bg-custom-1")}

                {renderItems(allProduct, "عنوان محصولات", () => { }, "bg-custom-3")}

                {(viewChart && viewCategoryCMP) && <CategoryAndProductCmp requestData={requestData} allProduct={(e: any) => setAllProduct(e)} />}
                {(viewChart && viewSubGroupCMP) && <SubGroupAndCategoryCmp requestData={requestData} allCategory={(e: any) => setAllCategory(e)} />}
                {(viewChart && viewGroupCMP) && <GroupAndSubGroupCmp requestData={requestData} allSubGroup={(e: any) => setAllSubGroup(e)} />}
                {(viewChart && viewTotalCMP) && <TotalAndGroupCmp requestData={requestData} allGroup={(e: any) => setAllGroup(e)} />}

            </section >

        </>
    )
}