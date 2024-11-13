import express, { Request, Response } from "express";
import createHaiyama from "./createHaiyama.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(cors());
} else {
  app.use(express.static("dist"));
}

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
