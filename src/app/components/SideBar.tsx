'use client'

import Link from "next/link"
import { signoutUser } from "../action/auth.action"
import { useUser } from "../context/UserProvider"
import { useState } from "react"
import Image from "next/image"
import logo from '#/assets/images/logo.png'

export default function SideBar({ size }: any) {
    const { user, removeUser } = useUser()
    const [accountToggle, setAccountToggle] = useState(false)
    const [idx, setIdx] = useState<number>(0)
    const toggle = true

    const signOut = async () => {
        setAccountToggle(!accountToggle)
        await signoutUser()
        removeUser()
    }
    if (user?._id == undefined) { return }

    return (
        <aside id="sidebar" className={`sidebar ${size == 'mobile' ? 'd-md-none' : 'd-none d-md-block'}`}>
            <section className="sidebar-container">
                <section className="sidebar-wrapper my-0">
                    <section className="d-flex justify-content-md-center justify-content-between flex1 pb-4 align-items-center">
                        {<span><Image src={logo} alt="logo" className="h-auto w-100" priority /></span>}
                    </section>
                    <Link href="/pb/dashboard" className="side-bar-link"><i className="fa fa-home"></i><span>پیشخوان</span></Link>


                    {/* <section className="sidebar-title">بخش آنالیز</section>*/}
                    <section onClick={() => { setIdx(0) }} className={`sidebar-group-link ${(toggle && idx == 0) && 'sidebar-group-link-active'}`}>
                        <section className="sidebar-dropdown-toggle pointer">
                            <i className="fa fa-bar-chart icon"></i>
                            <span>آمارگیری</span>
                            <i className={`fa angle ${(toggle && idx == 0) ? 'fa-angle-down' : 'fa-angle-left'} `}></i>
                        </section>
                        <section className="sidebar-dropdown">
                            <Link href="/pb/compare/branch" className="sidebar-dropdown-link"><span>آمار شعبه</span></Link>
                            <Link href="/pb/compare/branchs/duration" className="sidebar-dropdown-link"><span>آمار در بازه زمانی</span></Link>
                            <Link href="/pb/compare/branchs/days" className="sidebar-dropdown-link"><span>آمار در چند روز</span></Link>
                            <Link href="/pb/compare/branchs/packs" className="sidebar-dropdown-link"><span>آمار در سال/ماه/هفته</span></Link>
                            <Link href="/pb/compare/product" className="sidebar-dropdown-link"><span>آمار محصول</span></Link>
                        </section>
                    </section>
                    <section onClick={() => { setIdx(1) }} className={`sidebar-group-link ${(toggle && idx == 1) && 'sidebar-group-link-active'}`}>
                        <section className="sidebar-dropdown-toggle pointer">
                            <i className="fa fa-plus icon"></i>
                            <span>بارگذاری گزارش</span>
                            <i className={`fa angle ${(toggle && idx == 1) ? 'fa-angle-down' : 'fa-angle-left'} `}></i>
                        </section>
                        <section className="sidebar-dropdown">
                            <Link href="/pb/daily" className="sidebar-dropdown-link"><span>تجمیعی روزانه</span></Link>
                            <Link href="/pb/users" className="sidebar-dropdown-link"><span>تجمیعی کاربران</span></Link>
                            <Link href="/pb/products" className="sidebar-dropdown-link"><span>کالایی روزانه</span></Link>
                        </section>
                    </section>
                    <section onClick={() => { setIdx(2) }} className={`sidebar-group-link ${(toggle && idx == 2) && 'sidebar-group-link-active'}`}>
                        <section className="sidebar-dropdown-toggle pointer">
                            <i className="fa fa-dollar icon"></i>
                            <span>قیمت تمام شده</span>
                            <i className={`fa angle ${(toggle && idx == 2) ? 'fa-angle-down' : 'fa-angle-left'} `}></i>
                        </section>
                        <section className="sidebar-dropdown">
                            <Link href="/pb/category" className="sidebar-dropdown-link"><span>دسته بندی</span></Link>
                            <Link href="/pb/materials" className="sidebar-dropdown-link"><span>مواد اولیه</span></Link>
                            <Link href="/pb/productions" className="sidebar-dropdown-link"><span>محصول میانی</span></Link>
                            <Link href="/pb/final" className="sidebar-dropdown-link"><span>محصول بازرگانی</span></Link>
                            <Link href="/pb/converts" className="sidebar-dropdown-link"><span>کالای تبدیلی</span></Link>
                            <Link href="/pb/package" className="sidebar-dropdown-link"><span>بسته بندی</span></Link>
                            <Link href="/pb/finalprice" className="sidebar-dropdown-link"><span>قیمت نهایی</span></Link>
                        </section>
                    </section>

                    {user?._id !== undefined && <span className="side-bar-link cursorPointer" onClick={() => signOut()} ><i className="fa fa-sign-out"></i>خروج از حساب کاربری </span>}
                </section>
            </section>

        </aside>
    )
}