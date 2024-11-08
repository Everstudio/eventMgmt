import { validationResult, matchedData } from "express-validator";
import RegistrationsModel from "../models/registrationsModel.mjs";
import TicketsModel from "../models/ticketsModel.mjs";
import AttendeesModel from "../models/attendeesModel.mjs";

//constructor
class RegistrationsController {
  constructor() {
    this.registrationsModel = new RegistrationsModel();
    this.ticketsModel = new TicketsModel();
    this.attendeesModel = new AttendeesModel();
  }

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
      status: data.status,
      items: JSON.stringify(data.items),
      info: data.info,
     
    };
    console.log("registrationData", registrationData);

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
      };
    });
    console.log("attendees", attendees);

    const attendeesResult = await Promise.all(
      attendees.map(async (attendee) => {
        try {
          const attendeeId = await this.attendeesModel.createAttendee(attendee);
          const qr_code = "attendee:" + attendeeId + ":" + registrationId;
          const updateAttendeeQR = await this.attendeesModel.updateAttendeeQR(attendeeId, qr_code);
          return { attendee_id: attendeeId, qr_code: qr_code };
        } catch (error) {
          return { error: error.message };
        }
      })
    );

    let returnResult = {
      registration_id: registrationId,
      attendees: attendeesResult,
    };
    // return res.status(200).json("ok");
    return res.status(200).json(returnResult);
  }

  async getRegistrations(req, res) {
    try {
      const registrations = await this.registrationsModel.getRegistrations();
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

  async updateRegistration(req, res) {
    const { id } = req.params;
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
}

export default new RegistrationsController();
