const { Router } = require("express");
const router = Router();
const itemsRouter = require("./items");

router.use("/items", itemsRouter);

module.exports = router;
