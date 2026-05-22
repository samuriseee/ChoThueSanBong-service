import { Response } from 'express';

/**
 * Hàm hỗ trợ trả về Response thành công
 * @param res Express Response Object
 * @param data Dữ liệu cần trả về
 * @param message Lời nhắn (Tùy chọn)
 * @param statusCode Mã trạng thái HTTP (Mặc định 200)
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Hàm hỗ trợ trả về Response lỗi
 * @param res Express Response Object
 * @param message Lời nhắn lỗi
 * @param statusCode Mã trạng thái HTTP (Mặc định 400)
 * @param errors Chi tiết lỗi (Tùy chọn - Dùng khi validate form)
 */
export const sendError = (
  res: Response,
  message: string = 'Lỗi hệ thống',
  statusCode: number = 400,
  errors: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
