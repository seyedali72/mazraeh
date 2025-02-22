'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Confirmation } from "../../components/Confirmation";
import { convertToPersianDate, sortingList, spliteNumber } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { deleteDBS, getDBSs } from "@/app/action/report.action";
import DailyReport from "@/app/components/report/Daily";

export default function DaliyListPage() {
    const [mutated, setMutated] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [dateTop, setDateTop] = useState(false)
    const [sellTop, setSellTop] = useState(false)
    const [returnTop, setReturnTop] = useState(false)
    const [invoiceTop, setInvoiceTop] = useState(false)
    const [basketTop, setBasketTop] = useState(false)
    const [sort, setSort] = useState<any>('');
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const fetchData = useCallback(async () => {
        let table = await getDBSs({ isDeleted: false })
        setData(table)
    }, [])

    const sortList = sortingList(data, sort)

    useEffect(() => { fetchData() }, [mutated, fetchData])

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> گزارشات روزانه</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    {uploaded ? <button type="button" onClick={() => { setUploaded(false), setMutated(!mutated) }} className="btn btn-sm bg-custom-2">نمایش لیست گزارشات</button> : <button type="button" onClick={() => { setUploaded(true), setMutated(!mutated) }} className="btn btn-sm bg-custom-2">افزودن گزارش جدید</button>}
                    {!uploaded && <div className="d-flex gap-3 col-12 col-lg-6 col-md-9">
                        <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedBranch(e.target.value), setSelectedDate(null) }}>
                            {selectedBranch ? <option hidden value=''>{selectedBranch}</option> : <option hidden value=''>فروشگاه را انتخاب کنید</option>}
                            <option value="فروشگاه کهنز">فروشگاه کهنز</option>
                            <option value="فروشگاه رباط کریم">فروشگاه رباط کریم</option>
                            <option value="فروشگاه کلهر">فروشگاه کلهر</option>
                            <option value="فروشگاه معلم">فروشگاه معلم</option>
                        </select>
                        <select className="form-control form-control-sm" onChange={(e: any) => setSelectedDate(e.target.value)}>
                            {selectedDate ? <option hidden value=''>{convertToPersianDate(selectedDate, 'YMD')}</option> : <option hidden value=''>تاریخ مورد نظر را انتخاب کنید</option>}
                            {data?.map((el: any) => {
                                if (el?.branch == selectedBranch) {
                                    return (
                                        <option key={nanoid()} value={el?.date}>{convertToPersianDate(el?.date, 'YMD')}</option>
                                    )
                                }
                            })}

                        </select>
                        <button type="button" onClick={() => { setSelectedBranch(null), setSelectedDate(null) }} className="btn btn-sm bg-custom-3">ریست</button>

                    </div>}
                </section>
                {uploaded ? <DailyReport /> :
                    <section className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr className="fs80">
                                    <th className="text-center">#</th>
                                    <th>نام فروشگاه</th>
                                    <th className="cursorPointer" onClick={() => { setSort(dateTop ? 'dateUptoBottom' : 'dateBottomToUp'), setDateTop(!dateTop) }}>
                                        تاریخ {dateTop ? <i className="fa fa-angle-down" /> : <i className="fa fa-angle-up" />} </th>
                                    <th>روز</th>
                                    <th className="cursorPointer" onClick={() => { setSort(sellTop ? 'sellUptoBottom' : 'sellBottomToUp'), setSellTop(!sellTop) }}>
                                        مبلغ فروش {sellTop ? <i className="fa fa-angle-down" /> : <i className="fa fa-angle-up" />} </th>
                                    <th className="cursorPointer" onClick={() => { setSort(returnTop ? 'returnUptoBottom' : 'returnBottomToUp'), setReturnTop(!returnTop) }}>
                                        مبلغ مرجوعی {returnTop ? <i className="fa fa-angle-down" /> : <i className="fa fa-angle-up" />} </th>
                                    <th className="cursorPointer" onClick={() => { setSort(invoiceTop ? 'invoiceUptoBottom' : 'invoiceBottomToUp'), setInvoiceTop(!invoiceTop) }}>
                                        تعداد فاکتور {invoiceTop ? <i className="fa fa-angle-down" /> : <i className="fa fa-angle-up" />} </th>
                                    <th className="cursorPointer" onClick={() => { setSort(basketTop ? 'basketUptoBottom' : 'basketBottomToUp'), setBasketTop(!basketTop) }}>
                                        میانگین سبد خرید {basketTop ? <i className="fa fa-angle-down" /> : <i className="fa fa-angle-up" />} </th>
                                    {/* <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {sortList?.map((el: any, idx: number) => {
                                    let basket: any = (el?.totalSell / el?.totalInvoice).toFixed()
                                    if (selectedBranch !== null ? selectedDate !== null ? el?.branch == selectedBranch && el?.date == selectedDate : el?.branch == selectedBranch : true) {
                                        return (<tr key={idx} className='fs80'>
                                            <td className='text-center'>{idx + 1}</td>
                                            <td>{el?.branch} </td>
                                            <td>{convertToPersianDate(el?.date, 'YMD')}</td>
                                            <td>{el?.day} </td>
                                            <td>{spliteNumber(el?.totalSell)} ريال</td>
                                            <td>{spliteNumber(el?.totalReturn)} ريال</td>
                                            <td>{spliteNumber(el?.totalInvoice)}</td>
                                            <td>{spliteNumber(basket)}</td>
                                         
                                        </tr>)
                                    }
                                })}
                            </tbody>
                        </table>
                    </section>}
            </section>

        </>
    )
}