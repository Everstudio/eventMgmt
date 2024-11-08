import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAuthenticated, checkRole } from "../middlewares/auth.mjs";
import { createEventValidationSchema, createEventCategoryValidationSchema, createEventTagValidationSchema, createEventScheduleValidationSchema } from "../utils/validationSchema.mjs";
import "../strategies/jwt-strategy.mjs";
import EventsController from "../controllers/eventsController.mjs";

const router = Router();

router.use(isAuthenticated);

//create event
router.post("/web/events", checkRole(["admin"]), checkSchema(createEventValidationSchema), async (req, res) => {
  const events = await EventsController.createEvent(req, res);
});

//get all events
router.get("/web/events", async (req, res) => {
  const events = await EventsController.getEvents(req, res);
});

//create event category
router.post("/web/events/categories", checkRole(["admin"]), checkSchema(createEventCategoryValidationSchema), async (req, res) => {
  const events = await EventsController.createEventCategory(req, res);
});

//get all event categories
router.get("/web/events/categories", async (req, res) => {
  const events = await EventsController.getEventCategories(req, res);
});

//create event tag
router.post("/web/events/tags", checkRole(["admin"]), checkSchema(createEventTagValidationSchema), async (req, res) => {
  const events = await EventsController.createEventTag(req, res);
});

//get all event tags
router.get("/web/events/tags", async (req, res) => {
  const events = await EventsController.getEventTags(req, res);
});


//event schedule, is like an agenda that bind to an event.

//create event schedule, update event schedule
router.put("/web/events/schedules", checkRole(["admin"]), checkSchema(createEventScheduleValidationSchema), async (req, res) => {
  const events = await EventsController.createEventSchedule(req, res);
});

//get all event schedules
router.get("/web/events/schedules/:event_id", async (req, res) => {
  const events = await EventsController.getEventSchedules(req, res);
});

//delete event schedule
router.delete("/web/events/schedules/:id", checkRole(["admin"]), async (req, res) => {
  const events = await EventsController.deleteEventSchedule(req, res);
});


//get event tag by id
router.get("/web/events/tags/:id", async (req, res) => {
  const events = await EventsController.getEventTagById(req, res);
});

//update event tag
router.put("/web/events/tags/:id", checkRole(["admin"]), checkSchema(createEventTagValidationSchema), async (req, res) => {
  const events = await EventsController.updateEventTag(req, res);
});

//delete event tag
router.delete("/web/events/tags/:id", checkRole(["admin"]), async (req, res) => {
  const events = await EventsController.deleteEventTag(req, res);
});

//get event category by id
router.get("/web/events/categories/:id", async (req, res) => {
  const events = await EventsController.getEventCategoryById(req, res);
});

//update event category
router.put("/web/events/categories/:id", checkRole(["admin"]), checkSchema(createEventCategoryValidationSchema), async (req, res) => {
  const events = await EventsController.updateEventCategory(req, res);
});

//delete event category
router.delete("/web/events/categories/:id", checkRole(["admin"]), async (req, res) => {
  const events = await EventsController.deleteEventCategory(req, res);
});

//get event by id
router.get("/web/events/:id", async (req, res) => {
  const event = await EventsController.getEventById(req, res);
});

//update event
router.put("/web/events/:id", checkRole(["admin"]), checkSchema(createEventValidationSchema), async (req, res) => {
  const events = await EventsController.updateEvent(req, res);
});

//delete event
router.delete("/web/events/:id", checkRole(["admin"]), async (req, res) => {
  const events = await EventsController.deleteEvent(req, res);
});

export default router;
