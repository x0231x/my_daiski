<<<<<<< HEAD
'use client';

import { useShip711StoreCallback } from '../_hooks/use-ship-711-store';

export default function ShipCallbackPage() {
  // 呼叫回送到母視窗用的勾子函式
  useShip711StoreCallback();
=======
'use client'

import { useShip711StoreCallback } from '../_hooks/use-ship-711-store'

export default function ShipCallbackPage() {
  // 呼叫回送到母視窗用的勾子函式
  useShip711StoreCallback()
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c

  return (
    <>
      {/* 以下並非必要，可寫可不寫。只是為了自動關閉功能出意外時手動使用 */}
      <div>
        <div>
          <p>
            <button
              onClick={() => {
<<<<<<< HEAD
                window.close();
              }}
            >
              即將關閉視窗
=======
                window.close()
              }}
            >
              關閉視窗
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
            </button>
          </p>
        </div>
      </div>
    </>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
}
