import { Router } from 'express';
import fileRouter from './files/router';

export default (): Router => {
  const app = Router();

  app.use("/files", fileRouter)

  return app;
};
