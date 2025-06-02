'use client';

import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
<<<<<<< HEAD
import { useCart } from '@/hooks/use-cart';

export default function Delete({ category = '', item = {}, name = '' }) {
  const { onRemove } = useCart();
=======

export default function Delete() {
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="flex">
<<<<<<< HEAD
            <Trash2></Trash2>
=======
            <Trash2></Trash2>刪除
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除?</AlertDialogTitle>
<<<<<<< HEAD
            <AlertDialogDescription>將刪除:{name}</AlertDialogDescription>
=======
            <AlertDialogDescription>將刪除品項</AlertDialogDescription>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            {/* NOTE 待做 */}
<<<<<<< HEAD
            <AlertDialogAction onClick={() => onRemove(category, item)}>
=======
            <AlertDialogAction onClick={() => console.log('確認刪除')}>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
              確認
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
