import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import { toNodeHandler } from "better-auth/node";
import router from './routes';
import { auth } from './lib/auth';

const app: Application = express();

// Security middleware
app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
//parsers
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());


// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many auth attempts',
});

// application routes — auth gets rate limiting
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('EduBridge AI Server is running! 🚀');
});

//health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
  });
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
