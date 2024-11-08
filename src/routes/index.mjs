import { Router } from "express";
import eventRouter from "./events.mjs";
import hostRouter from "./hosts.mjs";
import registrationRouter from "./registrations.mjs";
import ticketRouter from "./tickets.mjs";
import attendeeRouter from "./attendees.mjs";

const router = Router();

router.use(attendeeRouter);
router.use(ticketRouter);
router.use(registrationRouter);
router.use(hostRouter);
router.use(eventRouter);

export default router;
