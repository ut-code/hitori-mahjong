import express, { Request, Response, NextFunction } from "express";
import createHaiyama from "./createHaiyama";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static("dist"));

const allowCrossDomain = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, access_token",
  );
  next();
};

app.use(allowCrossDomain);

app.post("/start", (req: Request, res: Response) => {
  const haiyama = createHaiyama();
  res.json(haiyama);
});

app.post("/end", async (req: Request, res: Response) => {
  const { name, score } = req.body;

  try {
    await prisma.user.create({
      data: {
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
