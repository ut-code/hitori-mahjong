import express, { Request, Response } from "express";
import createHaiyama from "./createHaiyama.js";
import { PrismaClient, Prisma } from "@prisma/client";
import cors from "cors";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
	}),
);

app.get("/tiles", (req: Request, res: Response) => {
	const haiyama = createHaiyama();
	res.json(haiyama);
});

app.post("/scores", async (req: Request, res: Response) => {
	const bodySchema = z.object({
		name: z.string().trim().nonempty(),
		score: z.number().gte(25000).lte(57000),
	});

	const result = bodySchema.safeParse(req.body);

	if (!result.success) {
		res.status(400).json({ error: "invalid request body" });
		return;
	}

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
		res.sendStatus(201);
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P1001"
		) {
			res.status(500).json({ error: "can't reach db server" });
			return;
		}
		res.status(500).json({ error: "failed in creating score" });
	}
});

app.get("/scores", async (req: Request, res: Response) => {
	try {
		const data = await prisma.user.findMany();
		res.json(data);
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P1001"
		) {
			res.status(500).json({ error: "can't reach db server" });
			return;
		}
		res.status(500).json({ error: "failed in getting scores" });
	}
});

app.get("/health", (req, res) => {
	res.send("OK");
});

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
