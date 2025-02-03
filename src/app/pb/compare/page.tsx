'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { convertToPersianDate, spliteNumber } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { getDBSs } from "@/app/action/report.action";
import CompareLineChart from "@/app/components/report/CompareLineChart";
import { getCompare } from "@/app/action/convert.action";
import CompareBarChart from "@/app/components/report/CompareBarChart";

export default function ComparePage() {
    const [groupList, setGroupList] = useState(true)
    const [categoryList, setCategoryList] = useState(false)
    const [productList, setProductList] = useState(false)
    const [compareList, setCompareList] = useState<any>([]);
    const [compareIdList, setCompareIdList] = useState<any>([]);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [compareBtn, setCompareBtn] = useState(false)
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [compareData, setCompareData] = useState<any>(null);
    const fetchData = useCallback(async () => {
        let table = await getDBSs({ isDeleted: false })
        setData(table)
    }, [])
    useEffect(() => {
        fetchData()
    }, [fetchData])
    const handleCompareData = async () => {
        let res = await getCompare(compareList)
        setCompareData(res)
        return
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> مقایسه نمودار فروش </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    <div className="d-flex gap-3 col-12 ">
                        <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedBranch(e.target.value), setSelectedDate(null) }}>
                            {selectedBranch ? <option hidden value=''>{selectedBranch}</option> : <option hidden value=''>فروشگاه را انتخاب کنید</option>}
                            <option value="فروشگاه کهنز">فروشگاه کهنز</option>
                            <option value="فروشگاه رباط کریم">فروشگاه رباط کریم</option>
                            <option value="فروشگاه کلهر">فروشگاه کلهر</option>
                            <option value="فروشگاه معلم">فروشگاه معلم</option>
                        </select>
                        <select className="form-control form-control-sm" onChange={(e: any) => setSelectedDate(e.target.value)}>
                            {selectedDate ? <option hidden value=''>{convertToPersianDate(selectedDate,'YMD')}</option> : <option hidden value=''>تاریخ مورد نظر را انتخاب کنید</option>}
                            {data?.map((el: any) => {
                                if (el?.branch == selectedBranch) {
                                    return (
                                        <option key={nanoid()} value={el?.date}>{convertToPersianDate(el?.date,'YMD')}</option>
                                    )
                                }
                            })}
                        </select>
                        <button type="button" onClick={() => { setSelectedBranch(null), setSelectedDate(null) }} className="btn btn-sm bg-custom-1 text-nowrap">ریست فیلتر </button>
                        <button type="button" onClick={() => { handleCompareData(), setCompareBtn(true) }} className="btn btn-sm bg-custom-4 text-nowrap">انجام مقایسه</button>
                        <button type="button" onClick={() => { setCompareBtn(false), setCompareList([]), setCompareIdList([]) }} className="btn btn-sm bg-custom-3 text-nowrap">ریست مقایسه </button>
                    </div>
                </section>
                {!compareBtn ? <section className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>نام فروشگاه</th>
                                <th>تاریخ</th>
                                <th>مبلغ فروش</th>
                                <th>مبلغ مرجوعی</th>
                                <th>تعداد فاکتور</th>
                                <th >مقایسه براساس
                                    <button type="button" onClick={() => { setGroupList(true), setCategoryList(false), setProductList(false), setCompareList([]), setCompareIdList([]) }} className="btn btn-sm bg-gray text-nowrap">گروه کالایی </button>
                                    <button type="button" onClick={() => { setCategoryList(true), setGroupList(false), setProductList(false), setCompareList([]), setCompareIdList([]) }} className="btn btn-sm bg-gray text-nowrap">دسته بندی</button>
                                    <button type="button" onClick={() => { setGroupList(false), setCategoryList(false), setProductList(true), setCompareList([]), setCompareIdList([]) }} className="btn btn-sm bg-gray text-nowrap">محصول </button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((el: any, idx: number) => {
                                if (selectedBranch !== null ? selectedDate !== null ? el?.branch == selectedBranch && el?.date == selectedDate : el?.branch == selectedBranch : true) {
                                    return (<tr key={idx} className='fs80'>
                                        <td className='text-center'>{idx + 1}</td>
                                        <td>{el?.branch} </td>
                                        <td>{convertToPersianDate(el?.date, 'YMD')}</td>
                                        <td>{spliteNumber(el?.totalSell)} ريال</td>
                                        <td>{spliteNumber(el?.totalReturn)} ريال</td>
                                        <td>{spliteNumber(el?.totalInvoice)}</td>
                                        {!(el?.group[0]?.length > 0 && el?.category[0]?.length > 0 && el?.products[0]?.length > 0) ? <td>فاقد اطلاعات مقایسه ای</td>
                                            : groupList ?
                                                <td className="text-center">
                                                    {compareIdList?.includes(el?._id) ? 'افزوده شده به لیست مقایسه' : <button type="button" className="btn btn-sm bg-custom-1 ms-1" onClick={() => { setCompareList([...compareList, [`${el?.branch}-${convertToPersianDate(el?.date,'YMD')}`, el?.group[0]]]), setCompareIdList([...compareIdList, el?._id]) }} >
                                                        <i className="fa fa-cubes px-1"></i>افزودن گروه کالا به لیست
                                                    </button>}
                                                </td>
                                                : productList ?
                                                    <td className="text-center">
                                                        {compareIdList?.includes(el?._id) ? 'افزوده شده به لیست مقایسه' : <button type="button" className="btn btn-sm bg-custom-2 ms-1" onClick={() => { setCompareList([...compareList, [`${el?.branch}-${convertToPersianDate(el?.date,'YMD')}`, el?.products[0]]]), setCompareIdList([...compareIdList, el?._id]) }} >
                                                            <i className="fa fa-cubes px-1"></i>افزودن محصولات به لیست
                                                        </button>}
                                                    </td> : categoryList &&
                                                    <td className="text-center">
                                                        {compareIdList?.includes(el?._id) ? 'افزوده شده به لیست مقایسه' : <button type="button" className="btn btn-sm bg-custom-4 ms-1" onClick={() => { setCompareList([...compareList, [`${el?.branch}-${convertToPersianDate(el?.date,'YMD')}`, el?.category[0]]]), setCompareIdList([...compareIdList, el?._id]) }} >
                                                            <i className="fa fa-cubes px-1"></i>افزودن دسته بندی به لیست
                                                        </button>}
                                                    </td>}
                                    </tr>)
                                }
                            })}
                        </tbody>
                    </table>
                </section> :
                    <CompareBarChart compareData={compareData} />}
            </section >

        </>
    )
}