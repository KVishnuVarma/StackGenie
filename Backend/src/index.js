import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ConnectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import schemaRoutes from './routes/schemaRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import customRoutes from './routes/customRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
// import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

ConnectDB();

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/schema", schemaRoutes);
app.use("/api/crud", apiRoutes);
app.use("/api/custom", customRoutes);
app.use("/api/webhooks", webhookRoutes);
// app.use("/api/ai", aiRoutes);


app.get("/", (req, res) => res.send("✅ StackGenie Backend is running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));