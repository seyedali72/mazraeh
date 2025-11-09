'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import TotalAndGroupTotalCmp from "@/app/components/totalityCharts/TotalAndGroup";
import HeaderPage from "@/app/components/Header";
import { getProductsName } from "@/app/action/product.action";
import ProductChartCmp from "@/app/components/Product";

export default function CompareProduct() {
    const [allProductsName, setAllProductsName] = useState<any>([]);
    const [viewChart, setViewChart] = useState(false)
    const [selectedBranchs, setSelectedBranchs] = useState<any>([]);
    const [selectedProducts, setSelectedProducts] = useState<any>([]);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<any>(null);
    const requestData = { branchs: selectedBranchs, startDate: selectedDate, endDate: selectedEndDate, products: selectedProducts }

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    const fetchProductsList = useCallback(async () => {
        let res = await getProductsName({})
        setAllProductsName(res)
    }, [])
    useEffect(() => { fetchProductsList() }, [fetchProductsList])
    return (
        <>
            <HeaderPage type='productInDuration' products={allProductsName}
                print={() => reactToPrintFn()} branchs={(e: any) => setSelectedBranchs(e)}
                startDate={(e: any) => setSelectedDate(e)} endDate={(e: any) => setSelectedEndDate(e)}
                 viewBranchAnaltics={(e: any) => console.log(e)}
                dates={(e: any) => console.log(e)} viewTotalCMP={() => console.log('first')}
                viewChart={() => setViewChart(true)} branch={(e: any) => console.log(e)}
                resetCompare={() => { setViewChart(false) }}
                selectSellers={(e: any) => console.log(e)} productsList={(e: any) => setSelectedProducts(e)}
                values={(e: any) => console.log(e)} searchType={(e: any) => console.log(e)}
            />
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">آمار فروش محصول</li>
                </ol>
            </nav>
            <section ref={contentRef} className="main-body-container rounded">
                {viewChart && <ProductChartCmp requestData={requestData} />}
            </section >

        </>
    )
}