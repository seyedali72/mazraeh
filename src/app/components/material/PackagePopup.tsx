'use client'


import { getSinglePackage } from "@/app/action/package.action";
import { spliteNumber } from "@/app/utils/helpers";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../Spinner";

export default function PackagePopup({ id, close }: any) {

    const [single, setSingle] = useState<any>({});
    const [loader, setLoader] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setLoader(true)
        let res = await getSinglePackage(id)
        setSingle(res)
        setLoader(false)
    }, [id])

    const percents = [
        { key: "BPercent", label: "B" },
        { key: "NPercent", label: "N" },
        { key: "MNPercent", label: "MN" },
        { key: "MHPercent", label: "MH" },
        { key: "MCPercent", label: "MC" },
    ];
    const calc = (price: number, percentKey: string) => {
        let rrr = price * ((single?.[percentKey] + 100) / 100);
        return spliteNumber(parseFloat(rrr.toFixed(0)))
    }
    useEffect(() => { fetchData() }, [fetchData])
    if (loader) { return <Spinner /> }
    return (
        <div className="popupCustom">
            <section className="main-body-container rounded">
                <div className="d-flex justify-content-between border-bottom pb-1">
                    <p className="mb-0 fs-6 fw-bold borderright">جزئیات بسته بندی {single?.name} </p>
                    <button onClick={() => { close() }} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                </div>
                <section className="table-responsive">
                    <table className="table table-bordered table-sm table-striped fs80">
                        <thead>
                            <tr>
                                <th>نام محصول</th>
                                <th>بارکد محصول</th>
                                <th>نوع محصول</th>
                                <th>دسته بندی</th>
                                <th>سریال</th>
                                <th>واحد اندازه گیری</th>
                                <th>درصد سربار</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <td>{single.name}</td>
                                <td>{single?.barcode}</td>
                                <td>{single.type == 'material' ? 'مواد اولیه' : single.type == 'middle' ? 'محصول میانی' : single.type == 'package' ? 'بسته بندی' : 'محصول بازرگانی'}</td>
                                <td>{single.categoryId?.name}</td>
                                <td>{single?.coding}</td>
                                <td>{single?.unit}</td>
                                <td>{single?.over}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="mb-1 fs-6 fw-bold borderright">لیست قیمت به ریال</p>
                    <table className="table table-bordered table-sm table-striped fs80">
                        <thead>
                            <tr>
                                <th>هزینه تمام شده</th>
                                <th>قیمت تمام شده</th>
                                <th>شعب {single?.BPercent}% </th>
                                <th>نمایندگان {single?.NPercent}% </th>
                                <th>مویرگی نقد {single?.MNPercent}% </th>
                                <th>مویرگی هفتگی {single?.MHPercent}% </th>
                                <th>مویرگی چکی {single?.MCPercent}% </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{spliteNumber(parseInt(single?.price))}</td>
                                <td>{spliteNumber(parseInt(single?.price_over))}</td>
                                {percents.map(({ key }) => (<td key={key}>{calc(single?.price_over, key)}</td>))}
                            </tr>
                        </tbody>

                    </table>
                    <p className="mb-1 fs-6 fw-bold borderright">لیست محصولات مصرفی</p>
                    <table className="table table-bordered table-sm table-striped fs80">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>نام محصول</th>
                                <th>دسته بندی</th>
                                <th>نوع محصول</th>
                                <th>بارکد محصول</th>
                                <th>مبلغ محصول</th>
                                <th>مقدار مصرف</th>
                                <th>مبلغ کل</th>
                            </tr>
                        </thead>
                        <tbody>
                            {single?.items?.map((item: any, idx: number) => {
                                return (<tr key={idx}>
                                    <td className="text-center">{idx + 1}</td>
                                    <td>{item?.material.name}</td>
                                    <td>{item?.material.categoryId?.name}</td>
                                    <td>{item?.material.type == 'material' ? 'مواد اولیه' : item?.material.type == 'middle' ? 'محصول میانی' : item?.material.type == 'package' ? 'بسته بندی' : 'محصول بازرگانی'}</td>
                                    <td>{item?.material?.barcode}</td>
                                    <td>{spliteNumber((parseInt(item?.material?.price_over)))} ریال</td>
                                    <td>{item?.percent} </td>
                                    <td>{spliteNumber(parseInt((parseFloat(item?.material?.price_over) * parseFloat(item?.percent)).toFixed()))} ریال</td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </section>
            </section>
        </div>
    )
}