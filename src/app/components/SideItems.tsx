

export const sidebarLinks = [
    { roles: [9], href: '/account/employe', icon: 'fa-user-plus', label: 'پرسنل', },
    { roles: [9, 12, 22], href: '/account/employers', icon: 'fa-users', label: 'کارفرمایان', },
    { roles: [9, 12, 22], href: '/account/agents', icon: 'fa-users', label: 'عوامل کارفرما', },
    { roles: [9, 12, 22, 6], href: '/account/tasks', icon: 'fa-tasks', label: 'تسک ها', },
    { roles: [9, 12, 22, 6], href: '/account/chat', icon: 'fa-wechat', label: 'چت', },
    { roles: [9, 12, 22, 6], href: '/account/letters', icon: 'fa-envelope', label: 'نامه ها', },
    { roles: [9], href: '/account/docs', icon: 'fa-folder-open', label: 'اسناد', },
    { roles: [9], href: '/account/forms', icon: 'fa-file-text', label: 'درخواست همکاری', },
    { roles: [9, 12, 22, 6], href: '/account/detail', icon: 'fa-user', label: 'اطلاعات حساب', },
    { roles: [9], href: '/account/setting', icon: 'fa-cogs', label: 'لوگو شرکت', },
];

export const sidebarDropdowns = [
    {
        roles: [1, 9],
        title: 'عمومی',
        icon: 'fa-users',
        id: 2,
        links: [
            // { permissions: [9, 3, 1], href: '/account/users', label: 'کاربران', },
            { permissions: [9, 3, 1], href: '/account/notification', label: 'اعلانات', },
            { permissions: [9, 3, 1], href: '/account/property', label: 'لیست اموال', },
            { permissions: [9, 3, 1], href: '/pb/docs', label: 'اسناد شرکت', },
            { permissions: [9, 3, 1], href: '/pb/info/contacts', label: 'فیش حقوقی', },
        ],
    },
    {
        roles: [1, 9, 3],
        title: 'پرسنل', icon: 'fa-users', id: 0,
        links: [
            { permissions: [9, 3, 1], href: '/account/chart', label: 'چارت سازمانی' },
            { permissions: [9, 3, 1], href: '/account/teams', label: 'دپارتمان ها' },
            { permissions: [9, 3, 1], href: '/account/employe', label: 'پرسنل' },
            { permissions: [9, 3, 1], href: '/account/experts', label: 'کارشناسان فروش' },
            { permissions: [9, 3, 1], href: '/account/jobs', label: 'شرح وظایف' },
            { permissions: [9, 3, 1], href: '/account/staff', label: 'جذب و استخدام' },
            { permissions: [9, 3, 1], href: '/account/users', label: 'حضور / غیاب' },
        ],
    },
    {
        roles: [1, 9, 2],
        title: 'کارفرمایان',
        icon: 'fa-users',
        id: 1,
        links: [
            { permissions: [9, 2, 1], href: '/account/customers', label: 'کارفرمایان' },
            { permissions: [9, 2, 1], href: '/account/projects', label: 'پروژه ها' },
            { permissions: [9, 2, 1], href: '/account/tickets', label: 'تیکت ها' },
            { permissions: [9, 2, 1], href: '/account/opportunity', label: 'فرصت های فروش' },
            { permissions: [9, 2, 1], href: '/account/leads', label: 'سرنخ ها' },
            { permissions: [9, 2, 1], href: '/account/contacts', label: 'مخاطبان' },
            { permissions: [9, 2, 1], href: '/account/companies', label: 'شرکت ها' },
            { permissions: [9, 2, 1], href: '/account/employers', label: 'کارفرمایان' },
            { permissions: [9, 2, 1], href: '/account/customers/categories', label: 'زمینه های فعالیتی' },
        ],
    },

];




