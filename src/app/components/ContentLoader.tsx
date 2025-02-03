import dynamic from "next/dynamic"
const ContentLoader = dynamic(() => import('react-content-loader'), { ssr: false })


export default function ContentLoaderCustom() {
    return (<ContentLoader viewBox="0 0 300 300">
        <ellipse rx="20" ry="20" transform="translate(264.927357 34.414184)" fill="#d2dbed" strokeWidth="0" />
        <rect width="271.593203" height="163.999015" rx="0" ry="0" transform="matrix(1 0 0 1.023841 13.334155 61.792404)" fill="#d2dbed" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" />
        <rect width="271.593202" height="28.071903" rx="0" ry="0" transform="translate(13.334155 239.349915)" fill="#d2dbed" strokeWidth="0" />
        <rect width="225.313961" height="8" rx="0" ry="0" transform="translate(13.334155 40.414184)" fill="#d2dbed" strokeWidth="0" />
        <rect width="225.313961" height="13" rx="0" ry="0" transform="translate(13.334155 21.414184)" fill="#d2dbed" strokeWidth="0" />
    </ContentLoader>)
}