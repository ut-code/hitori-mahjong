import express, { Request, Response, NextFunction } from "express";
import createHaiyama from "./createHaiyama.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
//app.use(express.static("dist"));

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // 許可するオリジンを環境変数から設定
    methods: ["GET", "POST", "PUT", "DELETE"], // 許可するHTTPメソッド
    allowedHeaders: ["Content-Type", "Authorization", "access_token"], // 許可するヘッダー
  }),
);

app.post("/start", (req: Request, res: Response) => {
  const haiyama = createHaiyama();
  res.json(haiyama);
});

app.post("/end", async (req: Request, res: Response) => {
  const { name, score } = req.body;

  try {
    await prisma.user.upsert({
      where: {
        name,
      },
      update: {
        score,
      },
      create: {
        name,
        score,
      },
    });
    res.sendStatus(201); // 201 Created
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/result", async (req: Request, res: Response) => {
  try {
    const data = await prisma.user.findMany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
