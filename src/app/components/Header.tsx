'use client'

import { nanoid } from "nanoid"
import { useState } from "react"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePicker from 'react-multi-date-picker'
import { convertToPersianDate } from "../utils/helpers"
import { toast } from "react-toastify"

export default function HeaderPage({ sellers = [], toggle, sellerType = '', sellerChartType = false, viewTotalCMP, resetCompare, viewChart, branchs, dates, print, branch, startDate, endDate, viewBranchAnaltics, type, values, searchType, selectSellers }: any) {
    const branches = ['فروشگاه کهنز', 'فروشگاه معلم', 'فروشگاه کلهر', 'فروشگاه رباط کریم']
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
                            مقایسه بین شعبات: {selectedBranchs?.length > 0 ? selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>)) : '...........'}{'  '}
                            در تاریخ های: {selectedDates?.length > 0 ? selectedDates?.map((day: string) => (<span key={nanoid()}>{convertToPersianDate(day, 'YMD')} - </span>)) : '.......'}
                        </div>}
                        {type == 'packing' && <div className="col-11 pb-2 fs85 ">
                            مقایسه بین شعبات: {selectedBranchs?.length > 0 ? selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>)) : '...........'}{'  '}
                            در تاریخ های: {selectedValues?.length > 0 ? selectedValues?.map((val: string) => (<span key={nanoid()}>{val} - </span>)) : '.......'}
                        </div>}
                        {type == 'singleBranch' && <div className="col-11 pb-2 fs85 ">
                            آمار شعبه:  <span >{selectedBranch !== null ? selectedBranch : '............'} </span>{'  '}
                            از تاریخ: <span >{selectedStartDate !== null ? convertToPersianDate(selectedStartDate, 'YMD') : '...'}</span>{'  '}
                            الی تاریخ: <span >{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '...'}</span>
                        </div>}
                        {type == 'branchsInDuration' && <div className="col-11 pb-2 fs85 ">
                            مقایسه بین شعبات: {selectedBranchs?.length > 0 ? selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>)) : '...........'}{'  '}
                            از تاریخ: <span >{selectedStartDate !== null ? convertToPersianDate(selectedStartDate, 'YMD') : '...'}</span>{'  '}
                            الی تاریخ: <span >{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '...'}</span>
                        </div>}
                        {sellerType == 'duration' && <div className="col-11 pb-2 fs85 ">
                            مقایسه بین فروشندگان: {selectedSellers?.length > 0 ? selectedSellers?.map((seller: string) => (<span key={nanoid()}>{seller} , </span>)) : '...........'}{'  '}
                            از تاریخ: <span >{selectedStartDate !== null ? convertToPersianDate(selectedStartDate, 'YMD') : '...'}</span>{'  '}
                            الی تاریخ: <span >{selectedEndDate !== null ? convertToPersianDate(selectedEndDate, 'YMD') : '...'}</span>
                        </div>}
                        {sellerType == 'days' && <div className="col-11 pb-2 fs85 ">
                            مقایسه بین فروشندگان: {selectedSellers?.length > 0 ? selectedSellers?.map((seller: string) => (<span key={nanoid()}>{seller} , </span>)) : '...........'}{'  '}
                            در تاریخ های: {selectedDates?.length > 0 ? selectedDates?.map((day: string) => (<span key={nanoid()}>{convertToPersianDate(day, 'YMD')} - </span>)) : '.......'}
                        </div>}
                        <button onClick={() => setPopup(false)} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                    </div>
                    <div className="col-8 gap-2 d-flex flex-column mx-auto my-3 fs90">
                        {(type == 'singleBranch' || type == 'branchsInDuration' || type == 'sellerDuration') && <div className="col-12 d-flex ">
                            <div className="col-4">تاریخ  شروع</div>
                            <div className="col-8 datePicker"> <DatePicker placeholder="تاریخ شروع را انتخاب کنید" className="form-control " format="YYYY/MM/DD" value={selectedStartDate || ''} calendar={persian} locale={persian_fa} onChange={(date: any) => { setSelectedStartDate(Date.parse(date?.toDate?.().toDateString())), startDate(Date.parse(date?.toDate?.().toDateString())) }} /></div>
                        </div>}
                        {(type == 'singleBranch' || type == 'branchsInDuration' || type == 'sellerDuration') && <div className="col-12 d-flex ">
                            <div className="col-4">تاریخ  پایان</div>
                            <div className="col-8 datePicker"> <DatePicker placeholder="تاریخ پایان را انتخاب کنید" className="form-control " format="YYYY/MM/DD" value={selectedEndDate || ''} calendar={persian} locale={persian_fa} onChange={(date: any) => { setSelectedEndDate(Date.parse(date?.toDate?.().toDateString())), endDate(Date.parse(date?.toDate?.().toDateString())) }} /></div>
                        </div>}
                        {(type == 'branchsInDays' || type == 'sellerDays') && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب تاریخ</div>
                            <div className="col-8 datePicker d-flex gap-1 text-nowrap"> <DatePicker multiple placeholder="تاریخ مورد نظر را انتخاب کنید" className="form-control " format="YYYY/MM/DD" value={selectedDate || ''} calendar={persian} locale={persian_fa} onChange={(date: any) => { convertMultipleDates(date) }} /></div>
                        </div>}
                        {type == 'singleBranch' && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب فروشگاه</div>
                            <div className="col-8 ">  {branches?.map((branch: any) => {
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
                        {(type == 'branchsInDays' || type == 'branchsInDuration' || type == 'packing') && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب فروشگاه</div>
                            <div className="col-8 ">  {branches?.map((branch: any) => {
                                return (<span className={`btn btn-sm m-1 fs75 ${selectedBranchs.includes(branch) ? 'bg-custom-2' : 'bg-light border'}`} key={nanoid()} onClick={() => {
                                    selectedBranchs.includes(branch) ? setSelectedBranchs(selectedBranchs?.filter((el: any) => el !== branch))
                                        : setSelectedBranchs([...selectedBranchs, branch])
                                }} >{branch}</span>)
                            })}</div>
                        </div>}
                        {(type == 'sellerDays' || type == 'sellerDuration') && <div className="col-12 d-flex ">
                            <div className="col-4">انتخاب فروشنده</div>
                            <div className="col-8 ">  {sellers?.map((seller: any) => {
                                return (<span className={`btn btn-sm m-1 fs75 ${selectedSellers.includes(seller) ? 'bg-custom-2' : 'bg-light border'}`} key={nanoid()} onClick={() => {
                                    selectedSellers.includes(seller) ? setSelectedSellers(selectedSellers?.filter((el: any) => el !== seller))
                                        : setSelectedSellers([...selectedSellers, seller])
                                }} >{seller}</span>)
                            })}</div>
                        </div>}
                    </div>
                    <div className="d-flex justify-content-center gap-2 border-top pt-2">
                        <button type="button" className="btn btn-sm bg-custom-5" onClick={() => { startDate(null), endDate(null), setSelectedDates([]), setSelectedDate(null), setSelectedValues([]), setSelectedValue(null), setSelectedBranch(null), setSelectedBranchs([]), setSelectPackType(null), setSelectedSellers([]) }}>ریست فیلتر</button>
                        <button type="button" className="btn btn-sm bg-custom-2"
                            onClick={() => {
                                viewTotalCMP(), viewChart(),
                                    branchs(selectedBranchs), branch(selectedBranch),
                                    dates(selectedDates), setPopup(false),
                                    startDate(selectedStartDate), endDate(selectedEndDate),
                                    viewBranchAnaltics(selectedBranch), selectSellers(selectedSellers)
                                values(selectedValues), searchType(selectPackType)
                            }}>انجام مقایسه</button>

                    </div>
                </section>
            </div> : ''}
        </header>
    )
}