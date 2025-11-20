import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// دکمه اکسپورت
const ExportToExcelButton = ({ filteredItems }: any) => {
  const percents = [
    { key: "BPercent", label: "B" },
    { key: "NPercent", label: "N" },
    { key: "MNPercent", label: "MN" },
    { key: "MHPercent", label: "MH" },
    { key: "MCPercent", label: "MC" },
  ];
  const exportToExcel = () => {
    if (!filteredItems || filteredItems.length === 0) {
      alert('داده‌ای برای خروجی وجود ندارد!');
      return;
    }

    // تبدیل داده‌ها به فرمت مناسب اکسل
    const worksheetData = filteredItems.map((item: any, idx: number) => {
      const cat = (item.categoryId);
      const parentName = cat?.parent?.name || '-';
      const grandParentName = cat?.parent?.parent?.name || '-';
      let overPrice = parseInt((item.price_over / 10000).toFixed(0)) * 10000
      item.BPercentFee = overPrice * ((item.BPercent + 100) / 100)
      item.NPercentFee = overPrice * ((item.NPercent + 100) / 100)
      item.MNPercentFee = overPrice * ((item.MNPercent + 100) / 100)
      item.MHPercentFee = overPrice * ((item.MHPercent + 100) / 100)
      item.MCPercentFee = overPrice * ((item.MCPercent + 100) / 100)
      item.farsiType = item?.type == 'material' ? 'مواد اولیه' : item?.type == 'middle' ? 'محصول میانی' : item?.type == 'package' ? 'بسته بندی' : 'محصول بازرگانی'

      return {
        'ردیف': idx + 1,
        'نام محصول': item.name,
        'بارکد': item.barcode || '-',
        'نوع کالا': item.farsiType || '-',
        'زیر گروه': cat?.name || '-',
        'گروه': parentName,
        'دسته کالا': grandParentName,
        'هزینه تمام شده': parseInt((item.price / 10000).toFixed(0)) * 10000 || '0',
        'قیمت تمام شده': overPrice || '0',
        'قیمت شعب': item.BPercentFee || '0',
        'درصد شعب': item.BPercent || '0',
        'قیمت نمایندگان': item.NPercentFee || '0',
        'درصد نمایندگان': item.NPercent || '0',
        'قیمت مویرگی نقد': item.MNPercentFee || '0',
        'درصد مویرگی نقد': item.MNPercent || '0',
        'قیمت مویرگی هفتگی': item.MHPercentFee || '0',
        'درصد مویرگی هفتگی': item.MHPercent || '0',
        'قیمت مویرگی چکی': item.MCPercentFee || '0',
        'درصد مویرگی چکی': item.MCPercent || '0',
      };
    });

    // ساخت worksheet
    const ws = XLSX.utils.json_to_sheet(worksheetData);

    // تنظیم عرض ستون‌ها
    ws['!cols'] = [
      { wch: 6 },   // ردیف
      { wch: 25 },  // نام محصول
      { wch: 15 },  // بارکد
      { wch: 12 },  // کدینگ
      { wch: 18 },  // دسته‌بندی
      { wch: 16 },  // والد
      { wch: 16 },  // جد والد
      { wch: 12 },  // قیمت
      { wch: 14 },  // قیمت عمده
    ];

    // استایل هدر (فارسی + بولد + رنگ)
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1E88E5' } },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = headerStyle;
    }

    // ساخت workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'محصولات');

    // تولید فایل
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // نام فایل با تاریخ
    const fileName = `لیست قیمت در تاریخ${new Date().toLocaleDateString('fa-IR')}.xlsx`;
    saveAs(data, fileName);
  };

  return (
    <button onClick={exportToExcel} className='btn btn-sm bg-custom-2 mb-2'  > خروجی اکسل </button>
  );
};

export default ExportToExcelButton