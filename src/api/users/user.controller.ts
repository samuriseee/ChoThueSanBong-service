import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { UserService } from './user.service';
import { uploadFilesToCloudinary } from '../../utils/cloudinary-upload';
import { env } from '../../config/env';

const userService = new UserService();

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
});

export const UserController = {
  async updateMe(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = updateProfileSchema.parse(req.body);

    let avatarUrl: string | undefined;
    if (req.file) {
      const [uploaded] = await uploadFilesToCloudinary([req.file], env.cloudinaryFolder);
      avatarUrl = uploaded;
    }

    const result = await userService.updateProfile(userId, {
      ...payload,
      avatarUrl,
    });

    return res.status(200).json({ message: 'Cập nhật hồ sơ thành công', data: result });
  },
};
