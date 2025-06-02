'use client';
import Link from 'next/link';
<<<<<<< HEAD
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';
=======
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
export default function Checkout() {
  const { cart } = useCart();
  const [checkedCoupon, setCheckedCoupon] = useState(null);
  const totalProduct = cart?.CartProduct?.reduce((acc, product) => {
    acc += product.price * product.quantity;
    return acc;
  }, 0);

  const totalCourse = cart?.CartCourse?.reduce((acc, course) => {
    acc += course.price;
    return acc;
  }, 0);

  const totalGroup = cart?.CartGroup?.reduce((acc, group) => {
    acc += group.price;
    return acc;
  }, 0);

  // couponDiscount
  let couponDiscount = 0;
  let amount = 0;

  if (checkedCoupon && checkedCoupon.type === '現金折扣') {
    couponDiscount = checkedCoupon.amount;
    amount = totalProduct + totalCourse + totalGroup - couponDiscount;
  } else if (checkedCoupon && checkedCoupon.type === '百分比折扣') {
    couponDiscount = Math.floor(
      ((totalProduct + totalCourse) * checkedCoupon.amount) / 100
    );
  }

  amount = totalProduct + totalCourse + totalGroup - couponDiscount;
  useEffect(() => {
    cart.CartCoupon?.forEach((coupon) => {
      if (coupon.checked) {
        setCheckedCoupon(coupon);
      }
    });
  }, [cart]);
  return (
    <>
<<<<<<< HEAD
      <Card
        className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark   md:sticky md:top-[107px]
    fixed bottom-0 left-0 right-0 z-50 w-full min-w-[350px] "
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">結帳明細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3  ">
            <div className="flex justify-between">
              <p className="text-p-tw">商品原價總金額</p>
              <p className="text-p-tw">${totalProduct.toLocaleString()}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-p-tw">課程原價總金額</p>
              <p className="text-p-tw">${totalCourse.toLocaleString()}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-p-tw">揪團總金額</p>
              <p className="text-p-tw">${totalGroup.toLocaleString()}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-p-tw">折扣金額(不含揪團)</p>
              {/* FIXME 待寫入金額 */}
              <p className="text-p-tw">
                -
                {checkedCoupon?.type === '百分比折扣'
                  ? `${checkedCoupon.amount}%($${couponDiscount})`
                  : `${couponDiscount}`}
              </p>
            </div>

            <div className="flex justify-between">
              <h6 className="text-h6-tw font-bold">結帳金額</h6>
              <p className="text-red">${amount.toLocaleString()}</p>
            </div>
            {/* FIXME 抓數量於"結帳"字後 */}

            <Link
              href={'/cart/checkout'}
              className="text-p-tw text-secondary-200"
            >
              <Button className="flex justify-center bg-primary-600 w-full py-5">
                結帳
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
=======
      <div className=" w-[450] sm:w-[200] md:w-[250] lg:w-[350] xl:w-[450]  sticky top-30">
        <div className="border-b-5 border-secondary-500">
          <h6 className="text-h6-tw font-bold">結帳明細</h6>
        </div>
        <div className="border-b-5 border-secondary-500">
          <div className="flex justify-between">
            <p className="text-p-tw">商品原價總金額</p>
            {/* FIXME 待寫入金額 */}
            <p className="text-p-tw"></p>
          </div>
          <div>
            <p className="text-p-tw">課程原價總金額</p>
            {/* FIXME 待寫入金額 */}
            <p className="text-p-tw"></p>
          </div>
          <div>
            <p className="text-p-tw">折扣券</p>
            {/* FIXME 待寫入金額 */}
            <p className="text-p-tw"></p>
          </div>
        </div>

        <div>
          <h6 className="text-h6-tw font-bold">結帳金額</h6>
          {/* FIXME 待寫入金額 */}
          <p className="text-p-tw"></p>
        </div>
        {/* FIXME 抓數量於"結帳"字後 */}

        <Link href={'/cart/checkout'} className="text-p-tw text-secondary-200">
          <div className="flex justify-center bg-primary-600">結帳</div>
        </Link>
      </div>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
    </>
  );
}
