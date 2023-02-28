"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Branches_1 = require("./entity/Branches");
const express_1 = __importDefault(require("express"));
const main = async () => {
    const conn = new typeorm_1.DataSource({
        type: "postgres",
        host: "database-1.cy6ncsi7tddz.ap-south-1.rds.amazonaws.com",
        port: 5432,
        username: "postgres",
        password: "Hari2003",
        database: "bank",
        logging: true,
        synchronize: false,
        entities: [Branches_1.Branches],
        ssl: {
            rejectUnauthorized: false,
        }
    });
    await conn.initialize();
    const api = (0, express_1.default)();
    api.set("json spaces", 4);
    api.get("/branch", async (req, res) => {
        const branches = await conn
            .getRepository(Branches_1.Branches)
            .createQueryBuilder("branch")
            .orderBy("branch.ifsc", "DESC")
            .where("to_tsvector(branch.branch) @@ plainto_tsquery(:q)", {
            q: req.query.q,
        })
            .limit(+(req.query.limit ?? 1))
            .offset(+(req.query.offset ?? 1) - 1)
            .getMany();
        console.log({ branches });
        res.send({ branches });
    });
    api.get("/search", async (req, res) => {
        const branches = await conn
            .getRepository(Branches_1.Branches)
            .createQueryBuilder("branch")
            .orderBy("branch.ifsc", "ASC")
            .where("to_tsvector(branch.branch || ' ' || branch.address || ' ' || branch.city || ' ' || branch.district || ' ' || branch.state || ' ' || branch.bank_name) @@ plainto_tsquery(:q)", {
            q: req.query.q,
        })
            .limit(+(req.query.limit ?? 1))
            .offset(+(req.query.offset ?? 0))
            .getMany();
        console.log({ branches });
        res.send({ branches });
    });
    api.listen(3000, () => {
        console.log("Running");
    });
};
main();
//# sourceMappingURL=index.js.map
