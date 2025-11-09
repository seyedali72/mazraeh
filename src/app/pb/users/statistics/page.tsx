'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import DDDatePicker from "@/app/components/DropDownDatePicker";
import { toast } from "react-toastify";
import { getSellers } from "@/app/action/seller.action";
import { convertToPersianDate, onlyUnique } from "@/app/utils/helpers";
import UserInDays from "@/app/components/userChart/UserInDays";
import UserInDuration from "@/app/components/userChart/UserInDuration";
import HeaderPage from "@/app/components/Header";
import { useReactToPrint } from "react-to-print";

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
    useEffect(() => { fetchData() }, [fetchData,toggle])
    let requestData = { selectedDays, selectedSellers, selectedStartDate, selectedEndDate }
    let sellers = data?.map((seller: any) => { return (seller?.name) }).filter(onlyUnique)
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    console.log(toggle)
    return (
        <>
            <HeaderPage type={!toggle ? 'sellerDuration' : 'sellerDays'} sellers={sellers} sellerChartType={true}
                print={() => reactToPrintFn()} branchs={(e: any) => console.log(e)}
                startDate={(e: any) => setSelectedStartDate(e)} endDate={(e: any) => setSelectedEndDate(e)}
                viewBranchAnaltics={(e: any) => console.log(e)}  productsList={(e: any) => console.log('e')}
                dates={(e: any) => setSelectedDays(e)} viewTotalCMP={() => console.log(true)}
                viewChart={() => (setViewChart(true), setViewDurationChart(true))} branch={(e: any) => console.log(e)}
                resetCompare={() => { setSelectedSellers([]), setViewChart(false), setViewDurationChart(false) }}
                selectSellers={(e: any) => setSelectedSellers(e)} sellerType={!toggle ? 'duration' : 'days'}
                values={(e: any) => console.log(e)} searchType={(e: any) => console.log(e)} toggle={() => setToggle(!toggle)}
            />
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> نمودار آمار فروش فروشنده </li>
                </ol>
            </nav>
            <section ref={contentRef} className="main-body-container rounded">

                {toggle ? viewChart && <UserInDays requestData={requestData} />
                    : viewDurationChart && <UserInDuration requestData={requestData} />}
            </section >

        </>
    )
}