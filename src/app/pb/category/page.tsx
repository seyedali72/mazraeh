'use client'
interface IForm {
    name: string;
    serial: string;
}
import { useForm } from "react-hook-form"
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Confirmation } from "../../components/Confirmation";
import { useUser } from "@/app/context/UserProvider";
import { createCategory, deleteCategory, getCategories } from "@/app/action/category.action";

export default function Teams() {
    const [mutated, setMutated] = useState(false)
    const [filter, setFilter] = useState('')
    const [filterLevel, setFilterLevel] = useState('')
    const [filterParent, setFilterParent] = useState('')
    const [type, setType] = useState('')
    const [parentId, setParentId] = useState('')
    const [groupId, setGroupId] = useState('')
    const [categories, setCategories] = useState([])
    const { user } = useUser()
    const { register, handleSubmit, reset, setValue } = useForm<IForm>()
    const handleCreateCat = async (obj: any) => {
        let find_parent: any = categories?.find((el: any) => el?._id == parentId)
        let find_group: any = categories?.find((el: any) => el?._id == groupId)
        let cloneSerial = obj.serial
        obj.serial = type == 'group' ? `${find_parent?.serial}${cloneSerial}` : type == 'subgroup' ? `${find_group?.serial}${cloneSerial}` : cloneSerial
        obj.level = type == 'group' ? 2 : type == 'subgroup' ? 3 : 1
        let parent = type == 'group' ? parentId : type == 'subgroup' ? groupId : null
        parent !== null ? obj.parent = parent : null
        let res = await createCategory(obj)
        if (!res.error) {

            setMutated(!mutated)
            reset()
        }
    }
    const allCats = useCallback(async () => {
        if (user?._id !== undefined) {
            let cats = await getCategories({ isDeleted: false })
            setCategories(cats)
        }
    }, [user])
    useEffect(() => {
        allCats()
    }, [mutated, allCats])
    const handleDelete = async (teamId: any) => {
        let res = await deleteCategory(teamId)
        if (!res.error) { setMutated(!mutated) }
    }
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/pb/dashboard">داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> لیست دسته بندی ها</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleCreateCat)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-3 px-1">
                            <label className='my-1' htmlFor="">نوع دسته بندی </label>
                            <select className="form-control form-control-sm" value={type} onChange={(e: any) => setType(e.target.value)}>
                                <option value='' hidden> دسته کالا، گروه کالا، زیر گروه</option>
                                <option value='parent' >دسته کالا</option>
                                <option value='group' >گروه کالا</option>
                                <option value='subgroup' >زیر گروه</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-3 px-1 mb-2">
                            <label className='my-1' htmlFor="">عنوان دسته بندی </label>
                            <input type="text" placeholder="عنوان دسته بندی را وارد کنید" className="form-control form-control-sm" {...register('name', { required: 'عنوان دسته بندی را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-3 px-1 mb-2">
                            <label className='my-1' htmlFor="">سریال دسته بندی </label>
                            <input type="text" placeholder="سریال دسته بندی را وارد کنید" className="form-control form-control-sm" {...register('serial', { required: 'سریال دسته بندی را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-3 px-1 mb-2">  </div>
                        {(type == 'group' || type == 'subgroup') && <div className="col-12 col-md-3 px-1">
                            <label className='my-1' htmlFor="">دسته کالا </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setParentId(e.target.value)}>
                                <option value='' hidden> دسته کالا بالا دستی را انتخاب کنید</option>
                                {categories?.map((cat: any, idx: number) => { if (cat?.level == 1) { return (<option key={idx} value={cat?._id}>{cat?.name}</option>) } })}
                            </select>
                        </div>}
                        {type == 'subgroup' && <div className="col-12 col-md-3 px-1">
                            <label className='my-1' htmlFor="">گروه کالا </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setGroupId(e.target.value)}>
                                <option value='' hidden>گروه کالا بالا دستی را انتخاب کنید</option>
                                {categories?.map((cat: any, idx: number) => { if (cat?.level == 2) { return (<option key={idx} value={cat?._id}>{cat?.name}</option>) } })}
                            </select>
                        </div>}
                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت</button>
                        </div>
                    </section>
                </form>
            </section>

            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    <section className="main-body-title">
                        <h5 className="mb-0">لیست دسته بندی ها</h5>
                    </section>
                    <div className="col-md-9 d-flex gap-1">
                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام دسته بندی ' className="form-control form-control-sm" />
                        <input type="text" onChange={(e: any) => setFilterParent(e.target.value)} placeholder='فیلتر براساس نام دسته بندی بالادستی ' className="form-control form-control-sm" />
                        <select className="form-control form-control-sm" value={filterLevel} onChange={(e: any) => setFilterLevel(e.target.value)}>
                            <option value='' hidden> دسته کالا، گروه کالا، زیر گروه</option>
                            <option value='' >حذف فیلتر</option>
                            <option value='1' >دسته کالا</option>
                            <option value='2' >گروه کالا</option>
                            <option value='3' >زیر گروه</option>
                        </select>
                        <span className="btn btn-sm bg-custom-3 text-white" onClick={() => { setFilter(''), setFilterLevel(''), setFilterParent('') }}><i className="fa fa-trash"></i></span>
                    </div>
                </section>
                <section className="table-responsive">
                    <table className="table table-bordered table-sm table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>عنوان دسته بندی</th>
                                <th>جایگاه</th>
                                <th>دسته بندی بالادستی</th>
                                <th>سریال</th>
                                <th>تعداد کالاها</th>
                                <th className=" text-center">
                                    <i className="fa fa-cogs px-1"></i>تنظیمات
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat: any, idx: number) => {
                                if (cat?.level?.toString()?.includes(filterLevel)) {
                                    if (cat.name.includes(filter)) {
                                        if (cat?.level == 1 ? true : cat?.parent?.name?.includes(filterParent)) {
                                            return (<tr key={idx}>
                                                <td className="text-center">{idx + 1}</td>
                                                <td>{cat?.name}</td>
                                                <td>{cat?.level == 3 ? 'زیر گروه' : cat?.level == 2 ? 'گروه کالا' : 'دسته کالا'}</td>
                                                <td>{cat?.parent !== undefined ? cat?.parent?.name : '---'}</td>
                                                <td>{cat.serial}</td>
                                                <td>{cat.users?.length}</td>
                                                <td className="text-center">
                                                    <Link href={`/pb/category/${cat?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>جزئیات</Link>
                                                    <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(cat?._id)} />, { autoClose: false, })}>
                                                        <i className="fa fa-trash px-1"></i>حذف
                                                    </button>
                                                </td>
                                            </tr>)
                                        }
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                </section>
            </section>

        </>
    )
}