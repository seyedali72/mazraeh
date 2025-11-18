import { Fragment, useMemo } from 'react';
import { spliteNumber } from '../utils/helpers';
import ExportToExcelButton from './ExportBtn';

interface Production {
  _id: string;
  name: string;
  barcode?: string;
  coding?: string;
  categoryId: { _id: string };
}

interface Category {
  _id: string;
  parent?: { _id: string; parent?: { _id: string } };
}

const ProductionList = ({ productions, categories, filtered, type }: {
  productions?: Production[];
  categories?: Category[];
  filtered: any;
  type: string;
}) => {
  const { selectCat, selectGroup, selectSubGroup, filter } = filtered

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories?.forEach(cat => map.set(cat._id.toString(), cat));
    return map;
  }, [categories]);

  const searchLower = filter.toLowerCase();
  const percents = [
    { key: "BPercent", label: "B" },
    { key: "NPercent", label: "N" },
    { key: "MNPercent", label: "MN" },
    { key: "MHPercent", label: "MH" },
    { key: "MCPercent", label: "MC" },
  ];
  const calc = (single: any, price: number, percentKey: string) => {
    let rrr = price * ((single?.[percentKey] + 100) / 100);
    spliteNumber(parseFloat(rrr.toFixed(1)))
    return <Fragment key={percentKey}><td> {spliteNumber(parseFloat(rrr.toFixed(0)))}</td><td>{single?.[percentKey]}%</td></Fragment>
  }
  interface ProductionItem {
    name?: string;
    barcode?: string;
    coding?: string;
    type?: string;
    categoryId?: any;
  }

  const filteredData: any = productions?.filter((item: ProductionItem) => {
    const search = searchLower.trim();
    if (search) {
      const searchable = `${item.name ?? ''} ${item.barcode ?? ''} ${item.coding ?? ''}`.toLowerCase();
      if (!searchable.includes(search)) return false;
    }

    if (type && item.type !== type) return false;

    const cat = categoryMap?.get(item.categoryId?._id?.toString() || '');
    if (!cat) {
      if (selectSubGroup || selectGroup || selectCat) return false;
      return true;
    }

    if (selectSubGroup && cat._id?.toString() !== selectSubGroup) return false;
    if (selectGroup && cat.parent?._id?.toString() !== selectGroup) return false;
    if (selectCat && cat.parent?.parent?._id?.toString() !== selectCat) return false;

    return true;
  });
  return (
    <>
      <ExportToExcelButton filteredItems={filteredData} />

      <table className="table table-bordered table-sm table-striped">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>نام محصول</th>
            <th>دسته بندی</th>
            <th>بارکد محصول</th>
            <th>نوع</th>
            <th>قیمت به ریال</th>
            <th colSpan={2}>شعب</th>
            <th colSpan={2}>نمایندگان</th>
            <th colSpan={2}>مویرگی نقد </th>
            <th colSpan={2}>مویرگی هفتگی </th>
            <th colSpan={2}>مویرگی چکی </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item: any, idx: number) => {
            return (
              <tr key={item?._id}>
                <td className="text-center">{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.categoryId?.name}</td>
                <td>{item?.barcode}</td>
                <td>{item?.type == 'material' ? 'مواد اولیه' : item?.type == 'middle' ? 'محصول بازرگانی' : item?.type == 'package' ? 'بسته بندی' : 'محصول نهایی'}</td>
                <td>{spliteNumber(parseInt(item?.price_over))}</td>
                {percents.map(({ key }) => (calc(item, item?.price_over, key)))}

              </tr>
            )
          })}

        </tbody>
      </table>  </>
  );
};
export default ProductionList