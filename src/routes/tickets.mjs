import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAuthenticated, checkRole } from "../middlewares/auth.mjs";
import { createEventTicketValidationSchema } from "../utils/validationSchema.mjs";
import "../strategies/jwt-strategy.mjs";
import TicketsController from "../controllers/ticketsController.mjs";

const router = Router();

router.use(isAuthenticated);

//create event ticket
router.put("/web/events/tickets", checkRole(["admin"]), checkSchema(createEventTicketValidationSchema), async (req, res) => {
  const events = await TicketsController.createTicket(req, res);
});

//get all tickets
router.get("/web/events/tickets", async (req, res) => {
  const events = await TicketsController.getTickets(req, res);
});

// //get all event tickets
// router.get("/web/events/tickets/:event_id", async (req, res) => {
//   const events = await TicketsController.getTicketsByEventId(req, res);
// });

// //get ticket by id
// router.get("/web/events/tickets/:id", async (req, res) => {
//   const events = await TicketsController.getTicketById(req, res);
// })

//delete event ticket
router.delete("/web/events/tickets/:id", checkRole(["admin"]), async (req, res) => {
  const events = await TicketsController.deleteTicket(req, res);
});

export default router;