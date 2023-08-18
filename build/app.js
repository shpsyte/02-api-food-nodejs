"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));

// src/infra/database/index.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var schema = import_zod.z.object({
  PORT: import_zod.z.coerce.number().default(3333),
  HOST: import_zod.z.string().default("localhost"),
  NODE_ENV: import_zod.z.string().default("development"),
  DB_CLIENT: import_zod.z.string().default("sqlite3"),
  DB_URL: import_zod.z.string().default("localhost")
});
var _env = schema.safeParse(process.env);
if (!_env.success) {
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/infra/database/index.ts
var config2 = {
  client: env.DB_CLIENT,
  connection: {
    filename: env.DB_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/infra/database/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/routes/user.ts
var import_zod2 = require("zod");
var import_node_crypto = __toESM(require("crypto"));

// src/middleware/check-userid-exists.ts
function checkSessionUser(request, reply) {
  return __async(this, null, function* () {
    const session = request.cookies.sessionId;
    console.log(`User session: ${session} => ${request.url}`);
    if (!session) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    console.log(`User session: ${session} => ${request.url}`);
  });
}

// src/routes/user.ts
function user_default(app2) {
  return __async(this, null, function* () {
    app2.get("/all", () => __async(this, null, function* () {
      const allusers = yield knex("users").select("*");
      return { allusers };
    }));
    app2.post("/create", (request, reply) => __async(this, null, function* () {
      const userSchema = import_zod2.z.object({
        name: import_zod2.z.string().min(3).max(255),
        email: import_zod2.z.string().email()
      });
      const parse = userSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({ message: "Invalid data", data: parse.error });
      }
      const { name, email } = parse.data;
      const userExists = yield knex("users").where({ email }).first();
      if (userExists) {
        return reply.status(400).send({ message: "User already exists" });
      }
      const user = yield knex("users").insert({
        id: import_node_crypto.default.randomUUID(),
        name,
        email
      }).returning("id");
      reply.cookie("sessionId", user[0].id, {
        path: "/",
        maxAge: 1e3 * 60 * 60 * 24 * 7
        // 7 days
      });
      return reply.status(201).send({ message: "User created", data: user });
    }));
    app2.get(
      "/me",
      {
        preHandler: [checkSessionUser]
      },
      (request) => __async(this, null, function* () {
        const { sessionId } = request.cookies;
        const user = yield knex("users").where({ id: sessionId }).first();
        if (!user) {
          return { message: "User not found" };
        }
        const allFoods = yield knex("food").where({
          user_id: sessionId
        });
        let bestSequenceCountOfIsDiet = 0;
        let currentSequenceCountOfIsDiet = 0;
        for (const food of allFoods) {
          if (food.is_diet) {
            currentSequenceCountOfIsDiet++;
          } else {
            if (currentSequenceCountOfIsDiet > bestSequenceCountOfIsDiet) {
              bestSequenceCountOfIsDiet = currentSequenceCountOfIsDiet;
            }
          }
        }
        return {
          user: user.name,
          data: {
            total: allFoods.length,
            diet: allFoods.filter((food) => food.is_diet).length,
            notDiet: allFoods.filter((food) => !food.is_diet).length,
            bestSequence: bestSequenceCountOfIsDiet
          }
        };
      })
    );
  });
}

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"));

// src/routes/food.ts
var import_zod3 = require("zod");
var import_node_crypto2 = __toESM(require("crypto"));
function food_default(app2) {
  return __async(this, null, function* () {
    app2.addHook("preHandler", checkSessionUser);
    app2.get("/all", (req) => __async(this, null, function* () {
      const userSession = req.cookies.sessionId;
      const allFoods = yield knex("food").where({ user_id: userSession }).select("*");
      return {
        allFoods
      };
    }));
    app2.get("/:id", (req) => __async(this, null, function* () {
      const userSession = req.cookies.sessionId;
      const paramsSchema = import_zod3.z.object({
        id: import_zod3.z.string()
      });
      const { id } = paramsSchema.parse(req.params);
      const food = yield knex("food").where({ user_id: userSession, id }).first().select("*");
      return {
        food
      };
    }));
    app2.post("/create", (req) => __async(this, null, function* () {
      const userSession = req.cookies.sessionId;
      const foodSchema = import_zod3.z.object({
        name: import_zod3.z.string(),
        description: import_zod3.z.string(),
        is_diet: import_zod3.z.boolean()
      });
      const parse = foodSchema.safeParse(req.body);
      if (!parse.success) {
        return {
          message: "Invalid body"
        };
      }
      const { name, description, is_diet } = parse.data;
      const id = import_node_crypto2.default.randomUUID();
      const food = yield knex("food").insert({
        id,
        name,
        description,
        date: /* @__PURE__ */ new Date(),
        is_diet,
        user_id: userSession
      }).returning("*");
      return {
        food
      };
    }));
    app2.delete("/delete/:id", (req) => __async(this, null, function* () {
      const paramsSchema = import_zod3.z.object({
        id: import_zod3.z.string()
      });
      const { id } = paramsSchema.parse(req.params);
      yield knex("food").where({ id }).delete();
      return {
        message: "Food deleted"
      };
    }));
    app2.put("/update/:id", (req) => __async(this, null, function* () {
      const paramsSchema = import_zod3.z.object({
        id: import_zod3.z.string()
      });
      const { id } = paramsSchema.parse(req.params);
      const session = req.cookies.sessionId;
      const foodSchema = import_zod3.z.object({
        name: import_zod3.z.string(),
        description: import_zod3.z.string(),
        is_diet: import_zod3.z.boolean()
      });
      const parse = foodSchema.safeParse(req.body);
      if (!parse.success) {
        return {
          message: "Invalid body"
        };
      }
      const { name, description, is_diet } = parse.data;
      const food = yield knex("food").where({ id }).first();
      if (!food) {
        return {
          message: "Food not found"
        };
      }
      if (food.user_id !== session) {
        return {
          message: "Unauthorized"
        };
      }
      const updateFood = yield knex("food").where({ id }).update({
        name,
        description,
        is_diet
      }).returning("*");
      return {
        updateFood
      };
    }));
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(user_default, {
  prefix: "/user"
});
app.register(food_default, {
  prefix: "/food"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
