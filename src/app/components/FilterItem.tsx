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

const ProductionList = ({ productions, categories, filtered, type, actives }: {
  productions?: Production[];
  categories?: Category[];
  filtered: any;
  type: string;
  actives: any
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
    return <Fragment key={percentKey}><td className='text-start'> {spliteNumber(parseFloat(rrr.toFixed(0)))}</td><td>{single?.[percentKey]}%</td></Fragment>
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
      {/* <ExportToExcelButton filteredItems={filteredData} /> */}


      <tbody>
        {filteredData.map((item: any, idx: number) => {
          return (
            <tr key={item?._id}>
              <td className="text-center">{idx + 1}</td>
              <td className='text-end'>{actives?.includes('name') ? '' : `${item.name}${item.qty>0 ? ` - ${item?.unit} ${item?.qty} ${item?.counterUnit}` :''} `}</td>
              <td className='text-end'>{actives?.includes('subgroup') ? '' : item.categoryId?.name}</td>
              <td className='text-end'>{actives?.includes('group') ? '' : item.categoryId?.parent?.name}</td>
              <td className='text-end'>{actives?.includes('category') ? '' : item.categoryId?.parent?.parent?.name}</td>
              <td className='text-start'>{actives?.includes('barcode') ? '' : item?.barcode}</td>
              <td className='text-end'>{actives?.includes('type') ? '' : item?.type == 'material' ? 'مواد اولیه' : item?.type == 'middle' ? 'کالای میانی' : item.type == 'convert' ? 'کالای تبدیلی' : item?.type == 'package' ? 'بسته بندی' : 'کالای بازرگانی'}</td>
              <td className='text-start'>{actives?.includes('fee') ? '' : spliteNumber(parseInt(item?.price_over))}</td>
              {percents.map(({ key }) => (calc(item, item?.price_over, key)))}

            </tr>
          )
        })}

      </tbody>
    </>
  );
};
export default ProductionList