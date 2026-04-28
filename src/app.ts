import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import authRouter from './api/auth/auth.route';
import userRouter from './api/users/user.route';
import courtRouter from './api/courts/court.route';
import bookingRouter from './api/bookings/booking.route';
import reviewRouter from './api/reviews/review.route';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/courts', courtRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews', reviewRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
