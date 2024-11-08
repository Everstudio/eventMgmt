import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAuthenticated, checkRole } from "../middlewares/auth.mjs";
import { createEventHostValidationSchema } from "../utils/validationSchema.mjs";
import "../strategies/jwt-strategy.mjs";

import HostsController from "../controllers/hostsController.mjs";

const router = Router();

router.use(isAuthenticated);

//create event host
router.post("/web/events/hosts", checkRole(["admin"]), checkSchema(createEventHostValidationSchema), async (req, res) => {
  const events = await HostsController.createHost(req, res);
});

//get all event hosts

router.get("/web/events/hosts", async (req, res) => {
  const events = await HostsController.getEventHosts(req, res);
});

//get event host by id
router.get("/web/events/hosts/:id", async (req, res) => {
  const events = await HostsController.getHostById(req, res);
});

//update event host
router.put("/web/events/hosts/:id", checkRole(["admin"]), checkSchema(createEventHostValidationSchema), async (req, res) => {
  const events = await HostsController.updateHost(req, res);
});

//delete event host
router.delete("/web/events/hosts/:id", checkRole(["admin"]), async (req, res) => {
  const events = await HostsController.deleteHost(req, res);
});

export default router;