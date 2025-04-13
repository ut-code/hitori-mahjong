import express, { Request, Response } from "express";
import createHaiyama from "./createHaiyama.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

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
    if (error instanceof Error) {
      console.error(error.message);
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/result", async (req: Request, res: Response) => {
  try {
    const data = await prisma.user.findMany();
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
