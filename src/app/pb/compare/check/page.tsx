'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import TotalAndGroupTotalCmp from "@/app/components/totalityCharts/TotalAndGroup";
import GroupAndSubGroupTotalCmp from "@/app/components/totalityCharts/GroupAndSubGroup";
import SubGroupAndCategoryTotalCmp from "@/app/components/totalityCharts/SubGroupAndCategory";
import CategoryAndProductTotalCmp from "@/app/components/totalityCharts/CategoryAndProduct";

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
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedBranchs, setSelectedBranchs] = useState<any>([]);
    const [type, setType] = useState<any>('');
    const [selectedDate, setSelectedDate] = useState<any>('');
    const [selectedDates, setSelectedDates] = useState<any>([]);

    const requestData = { branchs: selectedBranchs, group: selectedGroup, subGroup: selectedSubGroup, category: selectedCategory, valueArray: selectedDates, typeSearch: type }

    const types = ['سال', 'ماه', 'هفته',]
    const branches = ['فروشگاه امیریه', 'فروشگاه معلم', 'فروشگاه کلهر', 'فروشگاه رباط کریم']
    const renderItems = (items: string[], label: string, onClick: (item: string) => void, bgColor: string) => {
        if (items?.length === 0) return null;

        return (<div className="border-bottom py-2 d-flex flex-wrap align-items-center gap-1">
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
                    <li className="breadcrumb-item active" aria-current="page"> مقایسه نمودار فروش شعبات در سال / ماه / هفته های انتخابی </li>
                </ol>
            </nav>
            <section ref={contentRef} className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1 mb-3 border-bottom pb-3" >
                    <div className="d-flex gap-3 col-12 ">
                        <button className="btn btn-sm bg-custom-2 text-nowrap" onClick={() => reactToPrintFn()}>پرینت</button>
                        <select className="form-control form-control-sm" onChange={(e: any) => { setType(e.target.value) }}>
                            {type ? <option hidden value=''>{type}</option> : <option hidden value=''>فیلتر براساس</option>}
                            {types?.map((item: any) => { return (<option key={nanoid()} value={item}>{item}</option>) })}
                        </select>
                        <input type="number" className="form-control form-control-sm" onChange={(e: any) => { setSelectedDate(e.target.value) }} value={selectedDate} placeholder="مقدار را عددی وارد کنید" />
                        <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedBranch(e.target.value) }}>
                            {selectedBranch ? <option hidden value=''>{selectedBranch}</option> : <option hidden value=''>فروشگاه رو انتخاب کنید</option>}
                            {branches?.map((branch: any) => { return (<option key={nanoid()} value={branch}>{branch}</option>) })}
                        </select>

                        <button type="button" onClick={() => { !selectedDates?.includes(selectedDate) ? setSelectedDates([...selectedDates, selectedDate]) : toast.error('این مقدار قبلا انتخاب شده است'), setSelectedDate('') }} className="btn btn-sm bg-custom-5 text-nowrap">افزودن مقدار </button>
                        <button type="button" onClick={() => { !selectedBranchs?.includes(selectedBranch) ? setSelectedBranchs([...selectedBranchs, selectedBranch]) : toast.error('این شعبه قبلا انتخاب شده است'), setSelectedBranch(null) }} className="btn btn-sm bg-custom-2 text-nowrap">افزودن شعبه </button>
                        <button type="button" onClick={() => { setSelectedBranch(null), setSelectedBranchs([]), setSelectedDates([]) }} className="btn btn-sm bg-custom-1 text-nowrap">ریست فیلتر </button>
                        <button type="button" onClick={() => { setViewTotalCMP(true), setViewChart(!viewChart) }} className="btn btn-sm bg-custom-4 text-nowrap">انجام مقایسه</button>
                        <button type="button" onClick={() => { setAllCategory([]), setAllProduct([]), setAllGroup([]), setAllSubGroup([]), setViewCategoryCMP(false), setViewGroupCMP(false), setViewSubGroupCMP(false), setViewTotalCMP(false) }} className="btn btn-sm bg-custom-3 text-nowrap">ریست مقایسه </button>
                    </div>
                </section>
                <div className="col-12 py-2 border-bottom fs85">
                    مقایسه بین شعبات: {selectedBranchs?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>))}{'  '}
                    {`  در ${type} های: `} {selectedDates?.map((branch: string) => (<span key={nanoid()}>{branch} , </span>))}{'  '}
                </div>
                {renderItems(allGroup, "گروه کالا", (item) => { setViewCategoryCMP(false); setViewSubGroupCMP(false); setViewTotalCMP(false); setAllProduct([]); setAllCategory([]); setAllSubGroup([]); setSelectedGroup(item); setViewChart(!viewChart); setViewGroupCMP(true); }, "bg-custom-2")}
                {renderItems(allSubGroup, "زیرگروه کالا", (item) => { setViewCategoryCMP(false); setViewGroupCMP(false); setViewTotalCMP(false); setAllProduct([]); setAllCategory([]); setSelectedSubGroup(item); setViewChart(!viewChart); setViewSubGroupCMP(true); }, "bg-custom-4")}
                {renderItems(allCategory, "دسته کالا", (item) => { setViewGroupCMP(false); setViewSubGroupCMP(false); setViewTotalCMP(false); setSelectedCategory(item); setViewChart(!viewChart); setViewCategoryCMP(true); }, "bg-custom-1")}
                {renderItems(allProduct, "عنوان محصولات", () => { }, "bg-light")}
                {(viewChart && viewCategoryCMP) && <CategoryAndProductTotalCmp requestData={requestData} allProduct={(e: any) => setAllProduct(e)} />}
                {(viewChart && viewSubGroupCMP) && <SubGroupAndCategoryTotalCmp requestData={requestData} allCategory={(e: any) => setAllCategory(e)} />}
                {(viewChart && viewGroupCMP) && <GroupAndSubGroupTotalCmp requestData={requestData} allSubGroup={(e: any) => setAllSubGroup(e)} />}
                {(viewChart && viewTotalCMP) && <TotalAndGroupTotalCmp requestData={requestData} allGroup={(e: any) => setAllGroup(e)} />}

            </section >

        </>
    )
}