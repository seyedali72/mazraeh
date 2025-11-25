'use server'

import connect from '../lib/db'
import Material from '@/models/Material'

export async function updateAllCosts() {
    await connect()
    console.log(new Date())

    const maxLevel = await Material.find().sort({ level: -1 }).limit(1);
    const highest = maxLevel[0]?.level || 0;
    for (let lvl = 1; lvl <= highest; lvl++) {
        const products = await Material.find({ level: lvl });
        for (const product of products) {
            let totalPrice = 0;
            let totalPrice_over = 0;

            for (const item of product.items) {
                const parent = await Material.findById(item.material);
                if (!parent) continue;

                totalPrice = product?.type !== 'middle' ? totalPrice + parent.price * (item.percent) : totalPrice + parent.price * (item.percent / 100);
                totalPrice_over = product?.type !== 'middle' ? totalPrice_over + parent.price_over * (item.percent) : totalPrice_over + parent.price_over * (item.percent / 100);
            }


            await Material.updateOne(
                { _id: product._id },
                {
                    price: Number(totalPrice.toFixed(2)),
                    price_over: Number((totalPrice_over * ((product.over + 100) / 100)).toFixed(2)),
                    lastCostUpdate: new Date(),
                }
            );
        }

        // این خط خیلی مهمه! UI رو هنگ نکنه
        await new Promise(r => setTimeout(r, 0));
    }
    console.log(new Date())
    return { success: true }
}