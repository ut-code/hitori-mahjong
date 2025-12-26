import { DurableObject } from "cloudflare:workers";
import {
	type DrizzleSqliteDODatabase,
	drizzle,
} from "drizzle-orm/durable-sqlite";
import { migrate } from "drizzle-orm/durable-sqlite/migrator";
import { createRequestHandler } from "react-router";
import { usersTable } from "~/lib/db/schema-do";
import migrations from "../drizzle-do/migrations";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

export class MyDurableObject extends DurableObject<Env> {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase;
	constructor(ctx: DurableObjectState, env: Env) {
		// Required, as we're extending the base class.
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, {
			logger: false,
		});

		ctx.blockConcurrencyWhile(async () => {
			console.log(migrations);
			await this._migrate();
		});
	}

	async _migrate() {
		migrate(this.db, migrations);
	}
	async insertAndList(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
		return this.db.select().from(usersTable);
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},
} satisfies ExportedHandler<Env>;
