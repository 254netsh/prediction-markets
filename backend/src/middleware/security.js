// backend/src/middleware/security.js
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGINS }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));