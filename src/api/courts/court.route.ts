import { Router } from 'express';
import { CourtController } from './court.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticateToken, requireRoles } from '../../middlewares/auth.middleware';
import { VaiTro } from '../../entities/enums/vai-tro';
import upload from '../../middlewares/upload.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Courts
 *     description: Quản lý các API liên quan đến Sân Bóng
 */

/**
 * @swagger
 * /api/courts:
 *   get:
 *     summary: Lấy danh sách sân bóng
 *     tags: [Courts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách sân bóng
 */
router.get('/', asyncHandler(CourtController.list));

/**
 * @swagger
 * /api/courts/{id}:
 *   get:
 *     summary: Lấy chi tiết sân bóng
 *     tags: [Courts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết sân bóng
 *       404:
 *         description: Sân không tồn tại
 */
router.get('/:id', asyncHandler(CourtController.detail));

/**
 * @swagger
 * /api/courts/me:
 *   get:
 *     summary: Lấy danh sách sân bóng của chủ sân đang đăng nhập
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/me', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), asyncHandler(CourtController.getMyCourts));

/**
 * @swagger
 * /api/courts/{courtId}/subfields:
 *   get:
 *     summary: Lấy danh sách sân con của sân
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courtId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách sân con
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:courtId/subfields', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), asyncHandler(CourtController.getMySubfields));

/**
 * @swagger
 * /api/courts/{courtId}/subfields:
 *   post:
 *     summary: Tạo sân con cho sân
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courtId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeId
 *               - name
 *               - morningPrice
 *               - eveningPrice
 *             properties:
 *               typeId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               morningPrice:
 *                 type: number
 *               eveningPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo sân con thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/:courtId/subfields', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), asyncHandler(CourtController.createSubfield));

/**
 * @swagger
 * /api/courts/subfields/{subfieldId}:
 *   patch:
 *     summary: Cập nhật sân con
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subfieldId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               morningPrice:
 *                 type: number
 *               eveningPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật sân con thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Không tìm thấy sân con
 */
router.patch('/subfields/:subfieldId', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), asyncHandler(CourtController.updateSubfield));

/**
 * @swagger
 * /api/courts/subfields/{subfieldId}:
 *   delete:
 *     summary: Xóa sân con
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subfieldId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa sân con thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Không tìm thấy sân con
 */
router.delete('/subfields/:subfieldId', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), asyncHandler(CourtController.deleteSubfield));

/**
 * @swagger
 * /api/courts:
 *   post:
 *     summary: Tạo sân bóng mới
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - pricePerHour
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               ward:
 *                 type: string
 *               pricePerHour:
 *                 type: number
 *               openTime:
 *                 type: string
 *               closeTime:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo sân bóng thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), upload.array('images', 8), asyncHandler(CourtController.create));

/**
 * @swagger
 * /api/courts/{id}:
 *   patch:
 *     summary: Cập nhật sân bóng
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               ward:
 *                 type: string
 *               pricePerHour:
 *                 type: number
 *               openTime:
 *                 type: string
 *               closeTime:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Cập nhật sân bóng thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Không tìm thấy sân
 */
router.patch('/:id', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), upload.array('images', 8), asyncHandler(CourtController.update));

/**
 * @swagger
 * /api/courts/{id}:
 *   delete:
 *     summary: Xóa sân bóng
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa sân bóng thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Không tìm thấy sân
 */
router.delete('/:id', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), asyncHandler(CourtController.remove));

export default router;