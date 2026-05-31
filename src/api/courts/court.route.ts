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
 * - name: Courts
 * description: Quản lý các API liên quan đến Sân Bóng
 */

/**
 * @swagger
 * /api/courts/me:
 * get:
 * summary: Lấy danh sách sân bóng của chủ sân đang đăng nhập
 * tags: [Courts]
 * security:
 * - bearerAuth: []
 * responses:
 * "200":
 * description: Lấy danh sách thành công
 * "401":
 * description: Chưa đăng nhập (Token không hợp lệ hoặc đã hết hạn)
 * "403":
 * description: Không có quyền truy cập
 */
router.get('/me', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), asyncHandler(CourtController.getMyCourts));

router.get('/', asyncHandler(CourtController.list));
router.get('/:id', asyncHandler(CourtController.detail));
router.post('/', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), upload.array('images', 8), asyncHandler(CourtController.create));
router.patch('/:id', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), upload.array('images', 8), asyncHandler(CourtController.update));
router.delete('/:id', authenticateToken, requireRoles(VaiTro.CHU_SAN, VaiTro.ADMIN), asyncHandler(CourtController.remove));

export default router;