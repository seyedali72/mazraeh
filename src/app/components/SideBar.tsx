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

    const signOut = async () => {
        setAccountToggle(!accountToggle)
        await signoutUser()
        removeUser()
    }
    return (
        <aside id="sidebar" className={`sidebar ${size == 'mobile' ? 'd-md-none' : 'd-none d-md-block'}`}>
            <section className="sidebar-container">
                <section className="sidebar-wrapper my-0">
                <section className="d-flex justify-content-md-center justify-content-between flex1  pb-4 align-item-center">
                    {<span><Image src={logo} alt="logo"    className="h-auto w-100" priority /></span>}
                 </section>
                    <Link href="/pb/dashboard" className="side-bar-link"> <i className="fa fa-home"></i> <span>پیشخوان</span> </Link>
                    <Link href="/pb/compare/branch" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>آمار شعبه</span> </Link>
                    <Link href="/pb/compare/branchs/duration" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>آمار در بازه زمانی</span> </Link>
                    <Link href="/pb/compare/branchs/days" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>آمار در چند روز</span> </Link>
                    <Link href="/pb/compare/branchs/packs" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>آمار در سال/ماه/هفته</span> </Link>
                    <Link href="/pb/daily" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>گزارشات روزانه</span> </Link>
                    <Link href="/pb/users" className="side-bar-link"> <i className="fa fa-users"></i> <span>گزارشات تجمیعی کاربران</span> </Link>
                    <Link href="/pb/products" className="side-bar-link"> <i className="fa fa-cubes"></i> <span> فروش کالایی روزانه</span> </Link>
                    {user?._id !== undefined && <span className="side-bar-link cursorPointer" onClick={() => signOut()} > <i className="fa fa-sign-out"></i> خروج از حساب کاربری </span>}
                </section>
            </section>

        </aside>
    )
}