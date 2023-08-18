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

// src/infra/database/migrations/20230817212139_CreateFood.ts
var CreateFood_exports = {};
__export(CreateFood_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(CreateFood_exports);
function up(knex) {
  return __async(this, null, function* () {
    yield knex.schema.createTable("food", (table) => {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("description").notNullable();
      table.timestamp("date").notNullable();
      table.boolean("is_diet").notNullable();
      table.timestamps(true, true);
      table.uuid("user_id").references("id").inTable("users").notNullable();
    });
  });
}
function down(knex) {
  return __async(this, null, function* () {
    yield knex.schema.dropTable("food");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
