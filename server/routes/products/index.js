import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/products — 支援 include=card、page、limit 參數
router.get('/', async (req, res, next) => {
  const { include, page = '1', limit = '10' } = req.query;
  // 轉成數字，並確保最小為 1
  const pageNum = Math.max(parseInt(page, 10), 1);
  const pageSize = Math.max(parseInt(limit, 10), 1);

  try {
    // 分頁用的 Prisma 參數
    const pagination = {
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };

    const total = await prisma.product.count({
      where: { delete_at: null },
    });

    // 如果有帶 include=card，回傳卡片需要的欄位
    if (include === 'card') {
      const raw = await prisma.product.findMany({
        where: { delete_at: null },
        ...pagination,
        include: {
          product_image: {
            where: { sort_order: 0, valid: 1 },
            take: 1,
            select: { url: true },
          },
          product_sku: {
            where: { deleted_at: null },
            orderBy: { price: 'asc' },
            take: 1,
            select: { price: true },
          },
          product_category: { select: { name: true } },
          product_brand: { select: { name: true } },
        },
      });

      const products = raw.map((p) => ({
        id: p.id,
        name: p.name,
        // image: p.product_image[0]
        //   ? `http://localhost:3005${p.product_image[0].url}`
        //   : 'http://localhost:3005/placeholder.jpg',
        image: p.product_image[0]
        ? `${p.product_image[0].url}`
        : 'placeholder.jpg',
        price: p.product_sku[0]?.price ?? 0,
        category: p.product_category?.name ?? '無分類',
        brand: p.product_brand?.name ?? '無品牌',
      }));

      return res.json({
        page: pageNum,
        limit: pageSize,
        total,
        data: products,
      });
    }

    // 預設查詢：只查基本欄位 + 分頁
    const basic = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category_id: true,
        brand_id: true,
        introduction: true,
        spec: true,
        created_at: true,
        publish_at: true,
        unpublish_at: true,
        delete_at: true,
      },
      ...pagination,
    });

    res.json({
      page: pageNum,
      limit: pageSize,
      total,
      data: basic,
    });
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// GET /api/products/categories — 取得分類的完整路徑列表
// --------------------------------------------------
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.product_category.findMany({
      select: {
        id: true,
        name: true,
        ancestors: {
          select: {
            depth: true,
            ancestor: { select: { name: true } },
          },
          orderBy: { depth: 'desc' },
        },
      },
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: 'not found' });
    }

    const result = categories.map((cat) => {
      const names = cat.ancestors.map((a) => a.ancestor.name);
      names.push(cat.name);
      return {
        id: cat.id,
        fullPath: names.join(' > '),
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// GET /api/products/:id — 取得單一商品
// --------------------------------------------------
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        category_id: true,
        brand_id: true,
        introduction: true,
        spec: true,
        created_at: true,
        publish_at: true,
        unpublish_at: true,
        delete_at: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

export default router;
