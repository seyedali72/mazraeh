'use client'

import { Suspense, useEffect } from "react"
import LoginForm from "./client"
import { useUser } from "@/app/context/UserProvider"
import { useRouter } from "next/navigation"

export default function StartPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(()=>{
    if(user?._id !== undefined){
      router.replace('/pb/dashboard')
    }
  },[user])
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}