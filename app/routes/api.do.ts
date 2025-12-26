import type { Route } from "./+types/api.do";

export async function loader({ context }: Route.LoaderArgs) {
	const { env } = context.cloudflare;
	const id = env.DO.idFromName("user-id-999");
	const stub = env.DO.get(id);
	const userAll = await stub.insertAndList({
		name: "John",
		age: 30,
		email: "john@example.com",
		gender: "male",
	});
	console.log(
		"New user created. Getting all usersfrom the database: ",
		userAll,
	);
}
