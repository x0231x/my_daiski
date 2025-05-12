// 'use client';

// import { Suspense } from 'react';
// import Container from '@/components/container';
// import ProductList from './_components/product-list';
// import ProductFilter from './_components/product-filter';
// import ProductPagination from './_components/product-pagination';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// function ProductClientPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [pageInfo, setPageInfo] = useState({
//     page: parseInt(searchParams.get('page') || '1', 10),
//     limit: parseInt(searchParams.get('limit') || '12', 10),
//     total: 0,
//   });
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const currentPage = parseInt(searchParams.get('page') || '1', 10);
//     const currentLimit = parseInt(searchParams.get('limit') || '12', 10);
//     setPageInfo((prev) => ({
//       ...prev,
//       page: currentPage,
//       limit: currentLimit,
//     }));
//   }, [searchParams]);

//   useEffect(() => {
//     const { page, limit } = pageInfo;
//     // const url = new URL('http://localhost:3005/api/products');
//     const url = '/api/products';
//     url.searchParams.set('include', 'card');
//     url.searchParams.set('page', page);
//     url.searchParams.set('limit', limit);

//     fetch(url.toString())
//       .then((res) => res.json())
//       .then(({ page: p, limit: l, total, data }) => {
//         setProducts(data);
//         setPageInfo((prev) => ({ ...prev, page: p, limit: l, total }));
//       })
//       .catch(console.error);
//   }, [pageInfo.page, pageInfo.limit]);

//   const goToPage = (newPage) => {
//     const current = new URLSearchParams(Array.from(searchParams.entries()));
//     current.set('page', newPage);
//     router.push(`?${current.toString()}`);
//   };

//   const changeLimit = (newLimit) => {
//     const current = new URLSearchParams(Array.from(searchParams.entries()));
//     current.set('page', '1');
//     current.set('limit', newLimit);
//     router.push(`?${current.toString()}`);
//     setPageInfo((prev) => ({
//       ...prev,
//       limit: newLimit,
//       page: 1,
//     }));
//   };

//   const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.limit));

//   return (
//     <Container className="z-10 pt-10 pb-20">
//       <main className="flex flex-row min-h-1/2 gap-20">
//         <ProductFilter limit={pageInfo.limit} onChangeLimit={changeLimit} />
//         <div className="flex flex-col gap-10">
//           <ProductList products={products} />
//           <ProductPagination
//             page={pageInfo.page}
//             totalPages={totalPages}
//             onPageChange={goToPage}
//           />
//         </div>
//       </main>
//     </Container>
//   );
// }

// export default function ProductPage() {
//   return (
//     <Suspense fallback={<div>載入中...</div>}>
//       <ProductClientPage />
//     </Suspense>
//   );
// }


'use client';

import { Suspense } from 'react';
import Container from '@/components/container';
import ProductList from './_components/product-list';
import ProductFilter from './_components/product-filter';
import ProductPagination from './_components/product-pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ProductClientPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [pageInfo, setPageInfo] = useState({
    page:  parseInt(searchParams.get('page')  || '1',  10),
    limit: parseInt(searchParams.get('limit') || '12', 10),
    total: 0,
  });
  const [products, setProducts] = useState(null); // null 表示 loading

  // 當 URL 的 page/limit 改變時，更新 state
  useEffect(() => {
    const currentPage  = parseInt(searchParams.get('page')  || '1',  10);
    const currentLimit = parseInt(searchParams.get('limit') || '12', 10);
    setPageInfo(info => ({
      ...info,
      page:  currentPage,
      limit: currentLimit,
    }));
  }, [searchParams]);

  // 根據 pageInfo.page & pageInfo.limit 去撈資料
  useEffect(() => {
    const { page, limit } = pageInfo;
    const url = `/api/products?include=card&page=${page}&limit=${limit}`;

    // 開始載入
    setProducts(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        // 如果 API 回傳 { page, limit, total, data }
        const data  = json.data  ?? json;
        const total = json.total ?? (Array.isArray(data) ? data.length : 0);

        setProducts(data);
        setPageInfo(info => ({
          ...info,
          total,
          // page, limit 由 URL 決定，不必再從回傳覆蓋
        }));
      })
      .catch(err => {
        console.error('Fetch /api/products failed:', err);
        // 載入失敗顯示空列表
        setProducts([]);
      });
  }, [pageInfo.page, pageInfo.limit]);

  // 頁面切換函式
  const goToPage = newPage => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('page',  newPage);
    router.push(`?${params.toString()}`);
  };

  // 每頁數量改變
  const changeLimit = newLimit => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('page',  '1');      // 換 limit 就回到第 1 頁
    params.set('limit', newLimit);
    router.push(`?${params.toString()}`);
    setPageInfo(info => ({
      ...info,
      page:  1,
      limit: newLimit,
    }));
  };

  // Loading 狀態
  if (products === null) {
    return <Container>載入中…</Container>;
  }

  const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.limit));

  return (
    <Container className="z-10 pt-10 pb-20">
      <main className="flex flex-row min-h-1/2 gap-20">
        <ProductFilter limit={pageInfo.limit} onChangeLimit={changeLimit} />
        <div className="flex flex-col gap-10">
          <ProductList products={products} />
          <ProductPagination
            page={pageInfo.page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </main>
    </Container>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <ProductClientPage />
    </Suspense>
  );
}