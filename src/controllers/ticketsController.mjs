import { validationResult, matchedData } from "express-validator";
import TicketsModel from "../models/ticketsModel.mjs";

//constructor
class TicketsController {
  constructor() {
    this.ticketsModel = new TicketsModel();
  }

  async createTicket(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const data = matchedData(req);
    const ticketData = data.tickets;

    try {
      const tickets = await Promise.all(
        ticketData.map(async (ticket) => {
          if (ticket.id) {
            try {
              const affectedRows = await this.ticketsModel.updateTicket(ticket.id, ticket);
              if (affectedRows) {
                return { id: ticket.id, message: "Ticket updated successfully" };
              } else {
                return { id: ticket.id, message: "Ticket not found" };
              }
            } catch (error) {
              return { id: ticket.id, error: error.message };
            }
          } else {
            try {
              const ticketId = await this.ticketsModel.createTicket(ticket);
              return { id: ticketId, message: "Ticket created successfully" };
            } catch (error) {
              return { id: ticket.id, error: error.message };
            }
          }
        })
      );
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //update ticket
  async updateTicket(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const data = matchedData(req);
    const ticket = data.tickets;

    try {
      const affectedRows = await this.ticketsModel.updateTicket(req.params.id, ticket);
      if (affectedRows) {
        res.status(200).json({ message: "Ticket updated successfully" });
      } else {
        res.status(404).json({ error: "Ticket not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //get all tickets
  async getTickets(req, res) {
    let query = null;
      if (req.query) {
        query = req.query;
      }
    try {
      const tickets = await this.ticketsModel.getTickets(query);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  //get ticket by id
  async getTicketById(req, res) {
    const id = req.params.id;
    try {
      const ticket = await this.ticketsModel.getTicketById(id);
      if (ticket) {
        res.status(200).json(ticket);
      } else {
        res.status(404).json({ error: "Ticket not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //get all tickets by event_id
  async getTicketsByEventId(req, res) {
    const event_id = req.params.event_id;
    try {
      const tickets = await this.ticketsModel.getTicketsByEventId(event_id);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //delete ticket
  async deleteTicket(req, res) {
    const id = req.params.id;
    try {
      const affectedRows = await this.ticketsModel.deleteTicket(id);
      if (affectedRows) {
        res.status(200).json({ message: "Ticket deleted successfully" });
      } else {
        res.status(404).json({ error: "Ticket not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new TicketsController();
