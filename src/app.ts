import express, { Application, type Express } from "express";
import cors from 'cors'
import envConfig from "./config";
import cookieParser from "cookie-parser";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { rateLimit } from "express-rate-limit";
import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";


const app: Application = express();

app.use(cookieParser());

app.use(cors({
  origin: [
    envConfig.FRONTEND_URL,
    envConfig.BACKEND_BASE_URL,
    envConfig.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:5000"
  ].filter(Boolean),
  credentials: true,
}));

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many auth attempts',
});
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', router);


app.get("/", (req, res) => {
      res.send("Hello! Welcome to the EduBridge API.");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;