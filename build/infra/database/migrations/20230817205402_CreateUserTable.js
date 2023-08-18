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

// src/infra/database/migrations/20230817205402_CreateUserTable.ts
var CreateUserTable_exports = {};
__export(CreateUserTable_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(CreateUserTable_exports);
function up(knex) {
  return __async(this, null, function* () {
    yield knex.schema.createTable("users", (table) => {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.timestamps(true, true);
    });
  });
}
function down(knex) {
  return __async(this, null, function* () {
    yield knex.schema.dropTable("users");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
