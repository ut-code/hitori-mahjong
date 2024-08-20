import express from "express";
import createHaiyama from "./createHaiyama.mjs";
import { PrismaClient } from "@prisma/client";
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static("dist"));

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, access_token",
  );
  next();
};
app.use(allowCrossDomain);

app.post("/start", (req, res) => {
  const haiyama = createHaiyama();
  res.json(haiyama);
});

app.post("/end", async (req, res) => {
  const name = req.body.name;
  const score = req.body.score;
  await prisma.user.create({
    data: {
      name: name,
      score: score,
    },
  });
  res.send();
});

app.post("/result", async (req, res) => {
  const data = await prisma.user.findMany();
  res.json(data);
});
app.listen(3001);
