<<<<<<< HEAD
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

/**
 * PUT /api/profile/:id
 * Body (JSON) : { name, phone, email, bio }
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ msg: '無效的 id' });

    const { name, phone, email, bio } = req.body;

    //   👉 這裡可再加驗證：必填、格式…
    await prisma.user.update({
      where: { id },
      data:  { name, phone, email, bio },
    });

    res.json({ msg: '更新成功' });
  } catch (err) {
    next(err);
  }
});

export default router;
=======
import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/:id', function (req, res) {
  res
    .status(200)
    .json({ status: 'success', message: 'Express(path: /api/demo1)' })
})

export default router
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
