'use client'

import { useUser } from "../context/UserProvider"

export default function MainMenu({ children }: any) {
    const { user } = useUser()
    return (<section id="main-body" className={`main-body ${(user?._id == undefined) ? 'w-100 p-0' : 'wid-14rem'}`}  >
        {children}
    </section>)
}