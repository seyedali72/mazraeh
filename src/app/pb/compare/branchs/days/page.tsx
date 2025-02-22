'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import { convertToPersianDate } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import DDDatePicker from "@/app/components/DropDownDatePicker";
import CategoryAndProductDayCmp from "@/app/components/dayChart/CategoryAndProduct";
import SubGroupAndCategoryDayCmp from "@/app/components/dayChart/SubGroupAndCategory";
import TotalAndGroupDayCmp from "@/app/components/dayChart/TotalAndGroup";
import GroupAndSubGroupDayCmp from "@/app/components/dayChart/GroupAndSubGroup";
import { useReactToPrint } from "react-to-print";

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
    const [selectedDates, setSelectedDates] = useState<any>([]);

    const requestData = { branchs: selectedBranchs, group: selectedGroup, subGroup: selectedSubGroup, category: selectedCategory, days: selectedDates }

    const branches = ['فروشگاه کهنز', 'فروشگاه معلم', 'فروشگاه کلهر', 'فروشگاه رباط کریم']
    const renderItems = (items: string[], label: string, onClick: (item: string) => void, bgColor: string) => {
        if (items?.length === 0) return null;

        return (<div className="border-bottom py-2 d-flex flex-wrap align-item-center gap-1">
            <span className="fs80">{label}:</span>
            {items.map((item) => (<span key={nanoid()} onClick={() => onClick(item)} className={`p-1 fs75 cursorPointer rounded ${bgColor} btnStyle`} > {item} </span>))}
        </div>);
    };
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> مقایسه نمودار فروش چند شعبات در چند روز </li>
                </ol>
            </nav>
            <section ref={contentRef} className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    <div className="d-flex gap-3 col-12 ">
                        <button className="btn btn-sm bg-custom-2 text-nowrap" onClick={() => reactToPrintFn()}>پرینت</button>
                        <DDDatePicker selectDate={(e: any) => setSelectedDates([...selectedDates, e])} type='انتخاب تاریخ' date='' />

                        <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedBranch(e.target.value) }}>
                            {selectedBranch ? <option hidden value=''>{selectedBranch}</option> : <option hidden value=''>فروشگاه رو انتخاب کنید</option>}
                            {branches?.map((branch: any) => { return (<option key={nanoid()} value={branch}>{branch}</option>) })}
                        </select>

                        <button type="button" onClick={() => { !selectedBranchs?.includes(selectedBranch) ? setSelectedBranchs([...selectedBranchs, selectedBranch]) : toast.error('این شعبه قبلا انتخاب شده است'), setSelectedBranch(null) }} className="btn btn-sm bg-custom-2 text-nowrap">افزودن شعبه </button>
                        <button type="button" onClick={() => { setSelectedBranch(null), setSelectedBranchs([]), setSelectedDates([]) }} className="btn btn-sm bg-custom-1 text-nowrap">ریست فیلتر </button>
                        <button type="button" onClick={() => { setViewTotalCMP(true), setViewChart(!viewChart) }} className="btn btn-sm bg-custom-4 text-nowrap">انجام مقایسه</button>
                        <button type="button" onClick={() => { setAllCategory([]), setAllProduct([]), setAllGroup([]), setAllSubGroup([]), setViewCategoryCMP(false), setViewGroupCMP(false), setViewSubGroupCMP(false), setViewTotalCMP(false) }} className="btn btn-sm bg-custom-3 text-nowrap">ریست مقایسه </button>
                    </div>
                </section>
                <div className="col-12 py-2 border-bottom fs85">
                    مقایسه بین شعبات: {selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>))}{'  '}
                    در تاریخ های: {selectedDates?.map((day: string) => (<span key={nanoid()}>{convertToPersianDate(day, 'YMD')} - </span>))}
                </div>
                {renderItems(allGroup, "گروه کالا", (item) => { setViewCategoryCMP(false); setViewSubGroupCMP(false); setViewTotalCMP(false); setAllProduct([]); setAllCategory([]); setAllSubGroup([]); setSelectedGroup(item); setViewChart(!viewChart); setViewGroupCMP(true); }, "bg-custom-2")}

                {renderItems(allSubGroup, "زیرگروه کالا", (item) => { setViewCategoryCMP(false); setViewGroupCMP(false); setViewTotalCMP(false); setAllProduct([]); setAllCategory([]); setSelectedSubGroup(item); setViewChart(!viewChart); setViewSubGroupCMP(true); }, "bg-custom-4")}

                {renderItems(allCategory, "دسته کالا", (item) => { setViewGroupCMP(false); setViewSubGroupCMP(false); setViewTotalCMP(false); setSelectedCategory(item); setViewChart(!viewChart); setViewCategoryCMP(true); }, "bg-custom-1")}

                {renderItems(allProduct, "عنوان محصولات", () => { }, "bg-custom-3")}

                {(viewChart && viewCategoryCMP) && <CategoryAndProductDayCmp requestData={requestData} allProduct={(e: any) => setAllProduct(e)} />}
                {(viewChart && viewSubGroupCMP) && <SubGroupAndCategoryDayCmp requestData={requestData} allCategory={(e: any) => setAllCategory(e)} />}
                {(viewChart && viewGroupCMP) && <GroupAndSubGroupDayCmp requestData={requestData} allSubGroup={(e: any) => setAllSubGroup(e)} />}
                {(viewChart && viewTotalCMP) && <TotalAndGroupDayCmp requestData={requestData} allGroup={(e: any) => setAllGroup(e)} />}

            </section >

        </>
    )
}