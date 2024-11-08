import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAuthenticated, checkRole } from "../middlewares/auth.mjs";
import { createEventRegistrationValidationSchema } from "../utils/validationSchema.mjs";
import "../strategies/jwt-strategy.mjs";

import RegistrationsController from "../controllers/registrationsController.mjs";

const router = Router();

router.use(isAuthenticated);

//create registration
router.post("/web/events/registrations", checkRole(["admin", "customer"]), checkSchema(createEventRegistrationValidationSchema), async (req, res) => {
  const events = await RegistrationsController.createRegistration(req, res);
});

//get all registrations
router.get("/web/events/registrations", async (req, res) => {
  const events = await RegistrationsController.getRegistrations(req, res);
});

//update registration
router.put("/web/events/registrations", checkRole(["admin"]), checkSchema(createEventRegistrationValidationSchema), async (req, res) => {
  const events = await RegistrationsController.updateRegistration(req, res);
});

//get registration by id
router.get("/web/events/registrations/:id", async (req, res) => {
  const events = await RegistrationsController.getRegistrationById(req, res);
})

//delete registration by id
router.delete("/web/events/registrations/:id", checkRole(["admin"]), async (req, res) => {
  const events = await RegistrationsController.deleteRegistration(req, res);
});

export default router;