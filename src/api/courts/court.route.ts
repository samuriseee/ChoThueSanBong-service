import { Router } from 'express';
import { CourtController } from './court.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticateToken, requireRoles } from '../../middlewares/auth.middleware';
import { Role } from '../../entities/enums/vai-tro';
import upload from '../../middlewares/upload.middleware';

const router = Router();

router.get('/', asyncHandler(CourtController.list));
router.get('/:id', asyncHandler(CourtController.detail));
router.post('/', authenticateToken, requireRoles(Role.OWNER, Role.ADMIN), upload.array('images', 8), asyncHandler(CourtController.create));
router.patch('/:id', authenticateToken, requireRoles(Role.OWNER, Role.ADMIN), upload.array('images', 8), asyncHandler(CourtController.update));
router.delete('/:id', authenticateToken, requireRoles(Role.OWNER, Role.ADMIN), asyncHandler(CourtController.remove));

export default router;
