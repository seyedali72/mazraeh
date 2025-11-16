'use client'


import { editCategory, getCategories, getSingleCategory } from "@/app/action/category.action"
import { editMaterial } from "@/app/action/material.action"
import { Confirmation } from "@/app/components/Confirmation"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
interface IForm {
    name: string
    status: string
    parent: string
}
export default function CatDetail() {
    const { id }: any = useParams()
    const [singleCat, setSingleCat] = useState<any>([])
    const [filter, setFilter] = useState('')
    const [editInfo, setEditInfo] = useState(false)
    const [change, setChange] = useState(false)
    const [mutated, setMutated] = useState(false)
    const router = useRouter()
    const [categories, setCategories] = useState([])
    const fetchData = useCallback(async () => {
        let single = await getSingleCategory(id)
        setSingleCat(single)
    }, [])
    const { handleSubmit, register, setValue } = useForm<IForm>({
        values: {
            name: singleCat.name,
            status: singleCat.status,
            parent: singleCat.parent?._id,
        }
    })
    const allCats = useCallback(async () => {
        let list = await getCategories({ isDeleted: false })
        setCategories(list)
    }, [])
    const handleEditCat = async (obj: any) => {
        let res = await editCategory(singleCat?._id, obj)
        if (!res.error) {
            router.replace('/pb/category')
        }
    }
    useEffect(() => { fetchData(), allCats() }, [fetchData, mutated])
    const handleDelete = async (expertId: any) => {
        let remove = { CategoryId: null }
        let filter = singleCat?.products?.filter((expert: any) => expert?._id !== expertId)
        singleCat.products = filter
        let res = await editCategory(singleCat?._id, singleCat)
        if (!res.error) { await editMaterial(expertId, remove); setMutated(!mutated) }
    }
    if (singleCat?.length !== 0) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item "><Link href="/pb/dashboard">داشبورد</Link></li>
                        <li className="breadcrumb-item "><Link href="/pb/category"> لیست دسته بندی ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page"> {singleCat?.name}</li>
                    </ol>
                </nav>
                <section className="main-body-container rounded">
                    <form action="post" onSubmit={handleSubmit(handleEditCat)} method='Post'>
                        <section className="row">
                            <div className="col-12 col-md-6">
                                <label className='my-1' htmlFor="">عنوان دسته بندی </label>
                                <input disabled={!editInfo} type="text" className="form-control form-control-sm" {...register('name', { required: 'عنوان دسته بندی را وارد کنید', })} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className='my-1' htmlFor="">جایگاه در چارت سازمانی </label>
                                <select disabled={!editInfo} className="form-control form-control-sm" defaultValue={singleCat?.parent?._id} onChange={(e: any) => [setValue('parent', e.target.value), setChange(true)]}>
                                    {!change && <option value={singleCat?.parent?._id !== undefined ? singleCat?.parent?._id : ''}>{singleCat?.parent?.name}</option>}
                                    {categories?.map((team: any, idx: number) => {
                                        if (team?._id !== singleCat?._id) {
                                            if (!change) {
                                                if (team?._id !== singleCat?.parent?._id) {
                                                    return (<option key={idx} value={team?._id}>{team?.name}</option>)
                                                }
                                            } else { return (<option key={idx} value={team?._id}>{team?.name}</option>) }
                                        }
                                    })}
                                </select>
                            </div>
                            <div className="col-12 my-2">
                                {editInfo && <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>}
                            </div>
                        </section>
                    </form>
                    <div className="col-12 my-2">
                        {!editInfo && <button type="button" onClick={() => setEditInfo(!editInfo)} className="btn btn-primary btn-sm">درخواست ویرایش</button>}
                    </div>
                </section>

                {singleCat?.products.length !== 0 && <section className="main-body-container rounded">
                    <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                        <section className="main-body-title">
                            <h5 className="mb-0">لیست اعضا</h5>
                        </section>
                        <div className="col-md-6">
                            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام دسته بندی ' className="form-control form-control-sm" />
                        </div>
                    </section>
                    <section className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>نام کارمند</th>
                                    <th>سمت شغلی</th>
                                    <th>وضعیت همکاری</th>
                                    <th className=" text-center">
                                        <i className="fa fa-cogs px-1"></i>تنظیمات
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {singleCat?.products.map((employe: any, idx: number) => {
                                    if (employe?.name.includes(filter)) {
                                        return (<tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{employe?.name} </td>
                                            <td>{employe?.skill} </td>
                                            <td>{employe.status}</td>
                                            <td className="text-center">
                                                <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(employe?._id)} />, { autoClose: false, })}>
                                                    <i className="fa fa-trash px-1"></i>حذف
                                                </button>
                                            </td>
                                        </tr>)
                                    }
                                })}
                            </tbody>
                        </table>
                    </section>
                </section>}

            </>
        )
    } else { return (<p>درحال دریافت اطلاعات</p>) }
}