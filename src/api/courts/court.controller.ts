import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { CourtService } from './court.service';
import { uploadFilesToCloudinary } from '../../utils/cloudinary-upload';
import { env } from '../../config/env';

const courtService = new CourtService();

const courtSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  address: z.string().min(5),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  pricePerHour: z.coerce.number().positive(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

export const CourtController = {
  async list(req: AuthenticatedRequest, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const result = await courtService.listCourts({
      search: req.query.search as string | undefined,
      province: req.query.province as string | undefined,
      district: req.query.district as string | undefined,
      page,
      limit,
    });

    return res.status(200).json(result);
  },

  async detail(req: AuthenticatedRequest, res: Response) {
    const result = await courtService.getCourtById(req.params.id as string);
    return res.status(200).json({ data: result });
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = courtSchema.parse(req.body);
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const imageUrls = files.length ? await uploadFilesToCloudinary(files, env.cloudinaryFolder) : [];

    const result = await courtService.createCourt(userId, {
      ...payload,
      imageUrls,
    });

    return res.status(201).json({ message: 'Tạo sân bóng thành công', data: result });
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = courtSchema.partial().parse(req.body);
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const imageUrls = files.length ? await uploadFilesToCloudinary(files, env.cloudinaryFolder) : undefined;

    const result = await courtService.updateCourt(userId, req.params.id as string, {
      ...payload,
      ...(imageUrls ? { imageUrls } : {}),
    });

    return res.status(200).json({ message: 'Cập nhật sân bóng thành công', data: result });
  },

  async remove(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await courtService.deleteCourt(userId, req.params.id as string);
    return res.status(200).json({ message: 'Xóa sân bóng thành công', data: result });
  },

  async getMyCourts(req: AuthenticatedRequest, res: Response) {
  // Lấy userId từ token đã được xác thực trong middleware
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 0); // 0 = không phân trang
  const search = req.query.search as string | undefined;

  // Gọi service để lấy danh sách sân
  const result = await courtService.getMyCourtsByOwnerId(userId, { page, limit, search });

  return res.status(200).json({ data: result });
},
};
