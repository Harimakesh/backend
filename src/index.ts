import "reflect-metadata";
import { DataSource } from "typeorm";
import { Branches } from "./entity/Branches";
import express from "express";
const main = async () => {
  const conn = new DataSource({
    type: "postgres",
    host: "database-1.cy6ncsi7tddz.ap-south-1.rds.amazonaws.com",
    // host:"",
    port: 5432,
    username: "postgres",
    password: "Hari2003",
    database: "bank",
    logging: true,
    synchronize: false,
    entities: [Branches],
    ssl: {
      rejectUnauthorized: false,
    }
  });
  await conn.initialize();

  const api = express();
  api.set("json spaces", 4);
  api.get("/branch", async (req, res) => {
    const branches = await conn
      .getRepository(Branches)
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
      .getRepository(Branches)
      .createQueryBuilder("branch")
      .orderBy("branch.ifsc", "ASC")
      .where(
        "to_tsvector(branch.branch || ' ' || branch.address || ' ' || branch.city || ' ' || branch.district || ' ' || branch.state || ' ' || branch.bank_name) @@ plainto_tsquery(:q)",
        {
          q: req.query.q,
        }
      )
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
