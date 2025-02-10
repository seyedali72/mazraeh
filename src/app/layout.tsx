import type { Metadata } from "next";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.css'
import 'react-toastify/dist/ReactToastify.css'
import 'font-awesome/css/font-awesome.min.css'
import Providers from "./components/Providers";
import localFont from 'next/font/local'
import SideBar from "./components/SideBar";
import HeaderPanel from "./components/Header_Panel";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer, Zoom } from "react-toastify";

const Light = localFont({
  src: '../../public/assets/fonts/Sans/IRANSansWeb_Light.woff',
  variable: '--font-light',
})
const Medium = localFont({
  src: '../../public/assets/fonts/Sans/IRANSansWeb_Medium.woff',
  variable: '--font-medium',
})
const Bold = localFont({
  src: '../../public/assets/fonts/Sans/IRANSansWeb_Bold.woff',
  variable: '--font-bold',
})
const fanum = localFont({
  src: '../../public/assets/fonts/Sans/IRANSansWeb-FaNum.woff',
  variable: '--font-fanum',
})

export const metadata: Metadata = {
  title: "مزرعه",
  description: "سیستم گزارش سازی",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <Providers>
      <html lang='fa' dir='rtl'>
        <body className={`${Bold.variable} ${Medium.variable} ${Light.variable} ${fanum.variable} `}>
          <ToastContainer
            position='top-center'
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={true}
            limit={2}
            pauseOnFocusLoss={false}
            pauseOnHover={false}
            transition={Zoom}
            theme='colored'
          />
          <NextTopLoader color='#ffb602' height={5} />

          <HeaderPanel />
          <section className="body-container">
           <SideBar size='pc' />
            <section id="main-body" className="main-body">
              {children}
            </section>
          </section>
        </body>
      </html>
    </Providers>
  );
}
