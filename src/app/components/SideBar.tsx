'use client'

import Link from "next/link"

export default function SideBar({ size }: any) {
    return (
        <aside id="sidebar" className={`sidebar ${size == 'mobile' ? 'd-md-none' : 'd-none d-md-block'}`}>
            <section className="sidebar-container">
                <section className="sidebar-wrapper">
                    <Link href="/pb/dashboard" className="side-bar-link"> <i className="fa fa-home"></i> <span>پیشخوان</span> </Link>
                     <Link href="/pb/compare/branch" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>آمار شعبه</span> </Link>
                    <Link href="/pb/compare/branchs/duration" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>آمار در بازه زمانی</span> </Link>
                    <Link href="/pb/compare/branchs/days" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>آمار در چند روز</span> </Link>
                    <Link href="/pb/compare/branchs/packs" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>آمار در سال/ماه/هفته</span> </Link>
                    <Link href="/pb/daily" className="side-bar-link"> <i className="fa fa-bar-chart"></i> <span>گزارشات روزانه</span> </Link>
                    <Link href="/pb/users" className="side-bar-link"> <i className="fa fa-users"></i> <span>گزارشات تجمیعی کاربران</span> </Link>
                    <Link href="/pb/products" className="side-bar-link"> <i className="fa fa-cubes"></i> <span> فروش کالایی روزانه</span> </Link>

                </section>
            </section>

        </aside>
    )
}