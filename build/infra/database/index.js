"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/infra/database/index.ts
var database_exports = {};
__export(database_exports, {
  config: () => config2,
  knex: () => knex
});
module.exports = __toCommonJS(database_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  knex
});
