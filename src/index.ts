import app from './app';
import { env } from './config/env';
import { AppDataSource } from './config/database';

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    app.listen(env.port, () => {
      console.log(`Server is running at http://localhost:${env.port}`);
      console.log(`Swagger docs at http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void bootstrap();
