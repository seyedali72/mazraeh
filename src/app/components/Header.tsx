'use client'

import { nanoid } from "nanoid"
import { useState } from "react"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePicker from 'react-multi-date-picker'
import { convertToPersianDate } from "../utils/helpers"
import { toast } from "react-toastify"
import SearchComponent from "./SearchComponent"

export default function HeaderPage({ sellers = [], products = [], toggle, sellerType = '', sellerChartType = false, viewTotalCMP, resetCompare, viewChart, branchs, dates, print, branch, startDate, endDate, viewBranchAnaltics, type, values, searchType, selectSellers, productsList }: any) {
    const branches = ['فروشگاه امیریه', 'فروشگاه معلم', 'فروشگاه کلهر', 'فروشگاه رباط کریم']
    const packType = ['سال', 'ماه', 'هفته']
    const [selectedStartDate, setSelectedStartDate] = useState<any>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<any>(null);
    const [popup, setPopup] = useState(false)
    const [selectedDates, setSelectedDates] = useState<any>([]);
    const [selectedDate, setSelectedDate] = useState<any>();
    const [selectedValues, setSelectedValues] = useState<any>([]);
    const [selectedValue, setSelectedValue] = useState<any>();
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedBranchs, setSelectedBranchs] = useState<any>([]);
    const [selectedProducts, setSelectedProducts] = useState<any>([]);
    const [selectPackType, setSelectPackType] = useState<any>(null);
    const [selectedSellers, setSelectedSellers] = useState<any>([]);
    const convertMultipleDates = ((items: any) => {
        const ddd = items.map((item: any) => Date.parse(item?.toDate?.().toDateString()))
        setSelectedDates(ddd)
    })

    return (
        <header>
            <div className="header">
                {sellerChartType && <button onClick={() => { toggle(), resetCompare() }} className="btn btn-sm bg-custom-2 m-2" type="button">{sellerType == 'duration' ? 'تبدیل به مقایسه در روزهای مختلف' : 'تبدیل به مقایسه در بازه زمانی'}</button>}
                <button type="button" onClick={() => { setPopup(!popup), resetCompare() }} className="btn btn-sm fs100 bg-custom-3 text-white m-2"><i className="fa fa-filter"></i></button>
                <button type="button" className="btn btn-sm fs100 bg-custom-2 text-white m-2" onClick={() => print()}><i className="fa fa-print"></i></button>
            </div>
            {popup ? <div className="popupCustom">
                <section className="main-body-container rounded">
                    <div className="d-flex border-bottom justify-content-between">
                        {type == 'branchsInDays' && <div className="col-11 pb-2 fs85 ">
                            <b> مقایسه بین شعبات: </b>{selectedBranchs?.length > 0 ? selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>)) : '...........'}{' '}
                            <b> در تاریخ های: </b>{selectedDates?.length > 0 ? selectedDates?.map((day: string) => (<span key={nanoid()}>{convertToPersianDate(day, 'YMD')} - </span>)) : '.......'}
                        </div>}
                        {type == 'packing' && <div className="col-11 pb-2 fs85 ">
                            <b> مقایسه بین شعبات:</b> {selectedBranchs?.length > 0 ? selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>)) : '...........'}{' '}
                            <b> در تاریخ های:</b> {selectedValues?.length > 0 ? selectedValues?.map((val: string) => (<span key={nanoid()}>{val} - </span>)) : '.......'}
                        </div>}
                        {type == 'singleBranch' && <div className="col-11 pb-2 fs85 ">
                            <b> آمار شعبه: </b><span >{selectedBranch !== null ? selectedBranch : '............'} </span>{' '}
                            <b> از تاریخ:</b> <span >{selectedStartDate !== null ? convertToPersianDate(selectedStartDate, 'YMD') : '...'}</span>{' '}
                            <b> الی تاریخ:</b> <span >{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '...'}</span>
                        </div>}
                        {type == 'branchsInDuration' && <div className="col-11 pb-2 fs85 ">
                            <b> مقایسه بین شعبات: </b>{selectedBranchs?.length > 0 ? selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>)) : '...........'}{' '}
                            <b> از تاریخ: </b><span >{selectedStartDate !== null ? convertToPersianDate(selectedStartDate, 'YMD') : '...'}</span>{' '}
                            <b>  الی تاریخ: </b><span >{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '...'}</span>
                        </div>}
                        {type == 'productInDuration' && <div className="col-11 pb-2 fs85 ">
                            <b> مقایسه بین محصولات: </b>{selectedProducts?.length > 0 ? selectedProducts?.map((product: string) => (<span key={nanoid()}>{product} , </span>)) : '...........'}{' '}
                            <b> در بین شعبات:</b> {selectedBranchs?.length > 0 ? selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>)) : '...........'}{' '}
                            <b> از تاریخ:</b> <span >{selectedStartDate !== null ? convertToPersianDate(selectedStartDate, 'YMD') : '...'}</span>{' '}
                            <b>  الی تاریخ: </b><span >{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '...'}</span>
                        </div>}
                        {sellerType == 'duration' && <div className="col-11 pb-2 fs85 ">
                            <b> مقایسه بین فروشندگان: </b>{selectedSellers?.length > 0 ? selectedSellers?.map((seller: string) => (<span key={nanoid()}>{seller} , </span>)) : '...........'}{' '}
                            <b> از تاریخ: </b><span >{selectedStartDate !== null ? convertToPersianDate(selectedStartDate, 'YMD') : '...'}</span>{' '}
                            <b> الی تاریخ:</b> <span >{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '...'}</span>
                        </div>}
                        {sellerType == 'days' && <div className="col-11 pb-2 fs85 ">
                            <b> مقایسه بین فروشندگان:</b> {selectedSellers?.length > 0 ? selectedSellers?.map((seller: string) => (<span key={nanoid()}>{seller} , </span>)) : '...........'}{' '}
                            <b> در تاریخ های: </b>{selectedDates?.length > 0 ? selectedDates?.map((day: string) => (<span key={nanoid()}>{convertToPersianDate(day, 'YMD')} - </span>)) : '.......'}
                        </div>}
                        <button onClick={() => setPopup(false)} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                    </div>
                    <div className="col-8 gap-2 d-flex flex-column mx-auto my-3 fs90">
                        {(type == 'singleBranch' || type == 'branchsInDuration' || type == 'sellerDuration' || type == "productInDuration") && <div className="col-12 d-flex ">
                            <div className="col-4">تاریخ شروع</div>
                            <div className="col-8 datePicker"> <DatePicker placeholder="تاریخ شروع را انتخاب کنید" className="form-control " format="YYYY/MM/DD" value={selectedStartDate || ''} calendar={persian} locale={persian_fa} onChange={(date: any) => { setSelectedStartDate(Date.parse(date?.toDate?.().toDateString())), startDate(Date.parse(date?.toDate?.().toDateString())) }} /></div>
                        </div>}
                        {(type == 'singleBranch' || type == 'branchsInDuration' || type == 'sellerDuration' || type == "productInDuration") && <div className="col-12 d-flex ">
                            <div className="col-4">تاریخ پایان</div>
                            <div className="col-8 datePicker"> <DatePicker placeholder="تاریخ پایان را انتخاب کنید" className="form-control " format="YYYY/MM/DD" value={selectedEndDate || ''} calendar={persian} locale={persian_fa} onChange={(date: any) => { setSelectedEndDate(Date.parse(date?.toDate?.().toDateString())), endDate(Date.parse(date?.toDate?.().toDateString())) }} /></div>
                        </div>}
                        {(type == 'branchsInDays' || type == 'sellerDays') && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب تاریخ</div>
                            <div className="col-8 datePicker d-flex gap-1 text-nowrap"> <DatePicker multiple placeholder="تاریخ مورد نظر را انتخاب کنید" className="form-control " format="YYYY/MM/DD" value={selectedDate || ''} calendar={persian} locale={persian_fa} onChange={(date: any) => { convertMultipleDates(date) }} /></div>
                        </div>}
                        {type == 'singleBranch' && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب فروشگاه</div>
                            <div className="col-8 "> {branches?.map((branch: any) => {
                                return (<span className={`btn btn-sm m-1 fs75 ${selectedBranch?.includes(branch) ? 'bg-custom-2' : 'bg-light border'}`} key={nanoid()} onClick={() => {
                                    setSelectedBranch(branch)
                                }} >{branch}</span>)
                            })}</div>
                        </div>}
                        {type == 'packing' && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب تایپ</div>
                            <div className="col-8 "><select className="form-control form-control-sm" onChange={(e: any) => { setSelectPackType(e.target.value) }}>
                                {selectPackType ? <option hidden value=''>{selectPackType}</option> : <option hidden value=''>تایپ رو انتخاب کنید</option>}
                                {packType?.map((item: any) => { return (<option key={nanoid()} value={item}>براساس {item}</option>) })}
                            </select></div>
                        </div>}
                        {type == 'packing' && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب مقدار</div>
                            <div className="col-8 d-flex gap-1 text-nowrap"> <input type="number" className="form-control form-control-sm " placeholder="مقدار عددی وارد کنید " value={selectedValue || ''} onChange={(e: any) => { setSelectedValue(e.target.value) }} />
                                <button type="button" className="btn btn-sm bg-custom-3 fs75" onClick={() => { selectedValue !== null ? setSelectedValues([...selectedValues, selectedValue]) : toast.warning('فیلد بدون مقدار می باشد'), setSelectedValue(null) }}>افزودن مقدار</button></div>
                        </div>}
                        {(type == 'branchsInDays' || type == 'branchsInDuration' || type == 'packing' || type == 'productInDuration') && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب فروشگاه</div>
                            <div className="col-8 "><SearchComponent data={branches} forward={(e: any) => setSelectedBranchs(e)} /></div>
                        </div>}
                        {(type == 'sellerDays' || type == 'sellerDuration') && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب فروشنده</div>
                            <div className="col-8 "> <SearchComponent data={sellers} forward={(e: any) => setSelectedSellers(e)} /> </div>
                        </div>}
                        {(type == 'productInDuration') && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب محصول</div>
                            <div className="col-8 "> <SearchComponent data={products} forward={(e: any) => setSelectedProducts(e)} /> </div>
                        </div>}
                    </div>
                    <div className="d-flex justify-content-center gap-2 border-top pt-2">
                        <button type="button" className="btn btn-sm bg-custom-5" onClick={() => { startDate(null), endDate(null), setSelectedDates([]), setSelectedDate(null), setSelectedValues([]), setSelectedValue(null), setSelectedBranch(null), setSelectedBranchs([]), setSelectPackType(null), setSelectedSellers([]), setSelectedProducts([]), setSelectedStartDate(null), setSelectedEndDate(null) }}>ریست فیلتر</button>
                        <button type="button" className="btn btn-sm bg-custom-2"
                            onClick={() => {
                                viewTotalCMP(), viewChart(),
                                    branchs(selectedBranchs), branch(selectedBranch),
                                    dates(selectedDates), setPopup(false),
                                    startDate(selectedStartDate), endDate(selectedEndDate),
                                    viewBranchAnaltics(selectedBranch), selectSellers(selectedSellers),
                                    values(selectedValues), searchType(selectPackType), productsList(selectedProducts)
                            }}>انجام مقایسه</button>

                    </div>
                </section>
            </div> : ''}
        </header>
    )
}