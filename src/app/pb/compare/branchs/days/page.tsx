'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";  
import CategoryAndProductDayCmp from "@/app/components/dayChart/CategoryAndProduct";
import SubGroupAndCategoryDayCmp from "@/app/components/dayChart/SubGroupAndCategory";
import TotalAndGroupDayCmp from "@/app/components/dayChart/TotalAndGroup";
import GroupAndSubGroupDayCmp from "@/app/components/dayChart/GroupAndSubGroup";
import { useReactToPrint } from "react-to-print";
import HeaderPage from "@/app/components/Header";

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
    const [selectedDates, setSelectedDates] = useState<any>([]);

    const requestData = { branchs: selectedBranchs, group: selectedGroup, subGroup: selectedSubGroup, category: selectedCategory, days: selectedDates }

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
            <HeaderPage type='branchsInDays'
                print={() => reactToPrintFn()} branchs={(e: any) => setSelectedBranchs(e)}
                startDate={(e: any) => console.log(e)} endDate={(e: any) => console.log(e)} viewBranchAnaltics={(e: any) => console.log(e)}
                dates={(e: any) => setSelectedDates(e)} viewTotalCMP={() => setViewTotalCMP(true)}
                viewChart={() => setViewChart(true)} branch={(e: any) => console.log(e)}
                resetCompare={() => { setAllCategory([]), setAllProduct([]), setAllGroup([]), setAllSubGroup([]), setViewCategoryCMP(false), setViewGroupCMP(false), setViewSubGroupCMP(false), setViewTotalCMP(false), setViewChart(false) }}
                selectSellers={(e: any) => console.log(e)}  
                values={(e: any) => console.log(e)} searchType={(e: any) => console.log(e)}
            />
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> مقایسه نمودار فروش چند شعبات در چند روز </li>
                </ol>
            </nav>
            <section ref={contentRef} className="main-body-container rounded">

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