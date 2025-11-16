'use client'

import { useState } from "react"
import logo from '#/assets/images/logo.png'
import Image from "next/image"
import { useUser } from "../context/UserProvider"
import { signoutUser } from "../action/auth.action"
import { usePathname } from "next/navigation"
import SideBar from "./SideBar"

export default function HeaderPanel() {
  const { user, removeUser } = useUser()
  const path = usePathname()
  const [accountToggle, setAccountToggle] = useState(false)
  const [sidebarToggle, setSidebarToggle] = useState(false)
  const signOut = async () => {
    setAccountToggle(!accountToggle)
    await signoutUser()
    removeUser()
  }


  if (!path?.includes('/auth/')) {
    return (
      <header>
        <div className="header">
          <section className="sidebar-header bg-darkPurple d-flex align-items-center">
            <section className="d-flex justify-content-md-center justify-content-between flex1 px-2 align-items-center">
              {!sidebarToggle ? <span onClick={() => setSidebarToggle(!sidebarToggle)} id="sidebar-toggle-show" className="d-md-none py-2 px-1 d-inline"><i className="fa fa-align-justify pointer"></i></span>
                : <span onClick={() => setSidebarToggle(!sidebarToggle)} id="sidebar-toggle-hide" className="d-md-none py-2 px-1 d-inline"><i className="fa fa-align-right pointer"></i></span>}
              { <span><Image src={logo} alt="logo" width={150} height={50} className="h-auto" priority /></span>}
              {/* <span id="menu-toggle" className="d-md-none"><i className="fa fa-ellipsis-h"></i></span> */}
            </section>
          </section>
          <section id="body-header" className="body-header">
            {user?._id !== undefined &&
              <section className="d-flex justify-content-between px-3">
                {/* right  */}
                <section className=" d-flex align-items-center"> </section>
                {/* left  */}
                <section>
                  <span id="account-toggle" className="ml-3 ml-md-5 position-relative pointer">
                    <span className="d-md-flex align-items-md-center d-none" onClick={() => signOut()} >
                      خروج از حساب کاربری{' '}<i className="fa fa-sign-out"></i>
                    </span>
                  </span>

                </section>
              </section>
            }
          </section >
        </div >
        {sidebarToggle ? <SideBar size='mobile' /> : ''}
      </header>
    )
  }
}
