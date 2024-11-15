import { validationResult, matchedData } from "express-validator";
import RegistrationsModel from "../models/registrationsModel.mjs";
import TicketsModel from "../models/ticketsModel.mjs";
import AttendeesModel from "../models/attendeesModel.mjs";
import axios from "axios";
import { customAlphabet } from "nanoid";

import BullUtils from "../utils/bullUtils.mjs";

import "dotenv/config";

const token = process.env.TOKEN;
const memberURL = process.env.MEMBER_URL;

//constructor
class RegistrationsController {
  constructor() {
    this.registrationsModel = new RegistrationsModel();
    this.ticketsModel = new TicketsModel();
    this.attendeesModel = new AttendeesModel();
    this.bullUtil = new BullUtils();
  }

  async createRegistrationSample(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const data = matchedData(req);
    const registrationData = {
      event_id: data.event_id,
      user_id: data.user_id,

      sub_total: data.sub_total,
      discount: data.discount,
      tax: data.tax,
      total: data.total,
      status: data.status,
      items: JSON.stringify(data.items),
      info: data.info,
    };
    console.log("registrationData", registrationData);

    //look through data.items, get ticket_id, to check is the stock still available
    const ticketsStock = await Promise.all(
      data.items.map(async (item) => {
        const ticketData = await this.ticketsModel.getTicketById(item.ticket_id);

        if (ticketData.stock < item.quantity) {
          return {
            ticket_id: item.ticket_id,
            is_available: false,
          };
        } else {
          return {
            ticket_id: item.ticket_id,
            is_available: true,
          };
        }
      })
    );

    console.log("ticketsStock", ticketsStock);

    ticketsStock.forEach((ticket) => {
      if (!ticket.is_available) {
        return res.status(400).json({ error: "Ticket stock not available", ticket: ticket });
      }
    });

    let registrationId;
    try {
      registrationId = await this.registrationsModel.createRegistration(registrationData);
      if (!registrationId) {
        return res.status(500).json({ error: "Registration not created" });
      }
      let qr_code = "registration:" + registrationId;
      const updateRegistrationQR = await this.registrationsModel.updateRegistrationQR(registrationId, qr_code);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    const attendeesData = data.attendees;

    //get related ticket info from attendeesData.ticket_id, it may contain multiple ticket_id
    const tickets = await Promise.all(
      attendeesData.map(async (attendee) => {
        const ticket = await this.ticketsModel.getTicketById(attendee.ticket_id);
        return { ticket_id: ticket.id, price: ticket.price, name: ticket.name };
      })
    );

    console.log("tickets", tickets);

    //example tickets output [{ticket_id: 1, price: 100, name: "VIP"}, {ticket_id: 2, price: 50, name: "General"}]
    const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", 25);
    const unique_code = nanoid();
    const attendees = attendeesData.map((attendee, index) => {
      if (attendee.ticket_id !== tickets[index].ticket_id) {
        throw new Error("Ticket ID not found");
      }
      
      return {
        registration_id: registrationId,
        ticket_id: attendee.ticket_id,
        ticket_info: JSON.stringify(tickets[index]),
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone ? attendee.phone : null,
        status: "confirmed",
        unique_code: unique_code
      };
    });
    console.log("attendees", attendees);

    const attendeesResult = await Promise.all(
      attendees.map(async (attendee) => {
        try {
          const attendeeId = await this.attendeesModel.createAttendee(attendee);
          const qr_code = "attendee:" + attendeeId + ":" + registrationId;
          const updateAttendeeQR = await this.attendeesModel.updateAttendeeQR(attendeeId, qr_code);

          //update stock in ticket table, -1
          const ticketStock = await this.ticketsModel.decreaseTicketStock(attendee.ticket_id);

          return { attendee_id: attendeeId, qr_code: qr_code };
        } catch (error) {
          return { error: error.message };
        }
      })
    );

    //

    let returnResult = {
      registration_id: registrationId,
      attendees: attendeesResult,
    };
    // return res.status(200).json("ok");
    return res.status(200).json(returnResult);
  }

  //create registration
  async createRegistration(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const data = matchedData(req);
    const registrationData = {
      event_id: data.event_id,
      user_id: data.user_id,

      sub_total: data.sub_total,
      discount: data.discount,
      tax: data.tax,
      total: data.total,
      status: "pending",
      items: JSON.stringify(data.items),
      info: data.info,
    };

    //check is stock available
    //look through data.items, get ticket_id, to check is the stock still available
    const ticketsStock = await Promise.all(
      data.items.map(async (item) => {
        const ticketData = await this.ticketsModel.getTicketById(item.ticket_id);
        if (ticketData.stock < item.quantity) {
          return {
            ticket_id: item.ticket_id,
            is_available: false,
          };
        }
      })
    );

    ticketsStock.forEach((ticket) => {
      if (!ticket.is_available) {
        return res.status(400).json({ error: "Ticket stock not available", ticket: ticket });
      }
    });

    //stock available, create registration
    let registrationId;
    try {
      registrationId = await this.registrationsModel.createRegistration(registrationData);
      if (!registrationId) {
        return res.status(500).json({ error: "Registration not created" });
      }
      let qr_code = "registration:" + registrationId;
      const updateRegistrationQR = await this.registrationsModel.updateRegistrationQR(registrationId, qr_code);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    //create attendees data and insert to attendees table
    const attendeesData = data.attendees;
    //get related ticket info from attendeesData.ticket_id, it may contain multiple ticket_id
    const tickets = await Promise.all(
      attendeesData.map(async (attendee) => {
        const ticket = await this.ticketsModel.getTicketById(attendee.ticket_id);
        return { ticket_id: ticket.id, price: ticket.price, name: ticket.name };
      })
    );

    console.log("tickets", tickets);
    const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", 25);
    const unique_code = nanoid();
    //example tickets output [{ticket_id: 1, price: 100, name: "VIP"}, {ticket_id: 2, price: 50, name: "General"}]
    //assign ticket info to attendees, to capture the current ticket info, then assign status pending
    const attendees = attendeesData.map((attendee, index) => {
      if (attendee.ticket_id !== tickets[index].ticket_id) {
        throw new Error("Ticket ID not found");
      }
      return {
        registration_id: registrationId,
        ticket_id: attendee.ticket_id,
        ticket_info: JSON.stringify(tickets[index]),
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone ? attendee.phone : null,
        status: "pending",
        unique_code: unique_code
      };
    });
    console.log("attendees", attendees);

    //create attendees
    const attendeesResult = await Promise.all(
      attendees.map(async (attendee) => {
        try {
          const attendeeId = await this.attendeesModel.createAttendee(attendee);
          const qr_code = "attendee:" + attendeeId + ":" + registrationId;
          const updateAttendeeQR = await this.attendeesModel.updateAttendeeQR(attendeeId, qr_code);
          //decrease stock in ticket table, -1
          const ticketStock = await this.ticketsModel.decreaseTicketStock(attendee.ticket_id);

          return { attendee_id: attendeeId, qr_code: qr_code };
        } catch (error) {
          return { error: error.message };
        }
      })
    );

    //

    let returnResult = {
      registration_id: registrationId,
      attendees: attendeesResult,
    };
    // return res.status(200).json("ok");
    return res.status(200).json(returnResult);
  }

  async confirmRegistration(req, res) {
    //req body will contain id, use this id to retrieve registration id (purchase_id)
    const purchase_id = req.body.id;
    try {
      const registrationId = await this.registrationsModel.getRegistrationByPurchaseId(purchase_id);
      if (registrationId) {
        //update registration status to confirmed
        const updateRegistrationStatus = await this.registrationsModel.updateRegistrationStatus(registrationId, "confirmed");

        //update all attendees status to confirmed
        const updateAttendeesStatus = await this.attendeesModel.updateAttendeesStatus(registrationId, "confirmed");

        //initial get request to member URL, to get the user data
        const memberData = await axios.get(`${memberURL}/users/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await this.bullUtil.addJob(registrationId);

        res.status(200).json("OK");
      } else {
        res.status(404).json("Error");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Error");
    }
  }

  //fail registration
  async failRegistration(req, res) {
    const purchase_id = req.body.id;
    try {
      const registration = await this.registrationsModel.getRegistrationByPurchaseId(purchase_id);
      const registrationId = registration.id;
      if (registrationId) {
        //update registration status to failed
        const updateRegistrationStatus = await this.registrationsModel.updateRegistrationStatus(registrationId, "failed");

        //update all attendees status to failed
        const updateAttendeesStatus = await this.attendeesModel.updateAttendeesStatus(registrationId, "failed");

        //increae ticket stock
        //check how many ticket purchase, from registration.ticket_info.quantity
        const ticketInfoText = registration.ticketInfo;
        const ticketInfoJSON = JSON.parse(ticketInfoText);

        ticketInfoJSON.map(async (ticket) => {
          //update ticket stock, by passing the id and quantity
          const updateTicketStock = await this.ticketsModel.increaseTicketStock(ticket.ticket_id, parseInt(ticket.quantity));
        });

        res.status(200).json("OK");
      } else {
        res.status(404).json("Error");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Error");
    }
  }

  async getRegistrations(req, res) {

    let query = null;
    if (req.query) {
      query = req.query;
    }

    try {
      const registrations = await this.registrationsModel.getRegistrations(query);
      res.status(200).json(registrations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRegistrationById(req, res) {
    const { id } = req.params;

    try {
      const registration = await this.registrationsModel.getRegistrationById(id);
      if (registration) {
        res.status(200).json(registration);
      } else {
        res.status(404).json({ message: "Registration not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateRegistrationPaymentId(req, res) {
    const id = parseInt(req.body.reference);
    const purchase_id = req.body.id;
    const registrationData = {
      purchase_id: purchase_id,
    };
    try {
      const affectedRows = await this.registrationsModel.updateRegistration(id, registrationData);
      if (affectedRows) {
        res.status(200).json({ id: id, message: "Registration updated successfully" });
      } else {
        res.status(404).json({ id: id, message: "Registration not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateRegistration(req, res) {
    const { id } = req.params;
    const registrationData = matchedData(req);

    try {
      const affectedRows = await this.registrationsModel.updateRegistration(id, registrationData);
      console.log("affectedRows", affectedRows);
      if (affectedRows) {
        res.status(200).json({ id: id, message: "Registration updated successfully" });
      } else {
        res.status(404).json({ id: id, message: "Registration not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteRegistration(req, res) {
    const { id } = req.params;
    try {
      const affectedRows = await this.registrationsModel.deleteRegistration(id);
      if (affectedRows) {
        res.status(200).json({ message: "Registration deleted successfully" });
      } else {
        res.status(404).json({ message: "Registration not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generatePdf(req, res) {
    const registrationId = 1;
    await this.bullUtil.addJob(registrationId);
    return res.status(200).json("OK");
  }
}

export default new RegistrationsController();
