'use client'

import { Suspense } from "react"
import LoginForm from "./client"

export default function StartPage(){
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}