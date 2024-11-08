import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAuthenticated, checkRole } from "../middlewares/auth.mjs";
import { createEventAttendeeValidationSchema } from "../utils/validationSchema.mjs";

import AttendeesController from "../controllers/attendeesController.mjs";

const router = Router();

router.use(isAuthenticated);

//update attendee
router.put("/web/events/attendees", checkRole(["admin"]), checkSchema(createEventAttendeeValidationSchema), async (req, res) => {
  const attendees = await AttendeesController.updateAttendee(req, res);
});

//get all attendees
router.get("/web/events/attendees", async (req, res) => {
  const attendees = await AttendeesController.getAllAttendees(req, res);
});

//update attendee
router.put("/web/events/attendees", checkRole(["admin"]), checkSchema(createEventAttendeeValidationSchema), async (req, res) => {
  const attendees = await AttendeesController.updateAttendee(req, res);
});

//get attendee by registration id
router.get("/web/events/attendees/registration/:registration_id", async (req, res) => {
  const attendees = await AttendeesController.getAttendeesByRegistrationId(req, res);
});

//get attendee by id
router.get("/web/events/attendees/:id", async (req, res) => {
  const attendees = await AttendeesController.getAttendees(req, res);
});

//delete attendee by id
router.delete("/web/events/attendees/:id", checkRole(["admin"]), async (req, res) => {
  const attendees = await AttendeesController.deleteAttendee(req, res);
});

export default router;