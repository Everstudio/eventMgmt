import { validationResult, matchedData } from "express-validator";
import AttendeesModel from "../models/attendeesModel.mjs";

class AttendeesController {
  constructor() {
    this.attendeesModel = new AttendeesModel();
  }

  
async getAttendeesETicket(req, res) {
  try {
    let query = null;
    if (req.query) {
      query = req.query;
    }else{
      return res.status(400).send("Bad Request"); //if no query params, must return 400
    }
    const tickets = await this.attendeesModel.getAttendeesETicket(query);
    return res.status(200).send(tickets);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

  // async createAttendee(req, res) {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //     return res.status(400).json(errors.array());
  //     }

  //     const attendeeData = matchedData(req);

  //     try {
  //     const attendeeId = await this.attendeesModel.createAttendee(attendeeData);
  //     res.status(200).json({ id: attendeeId });
  //     } catch (error) {
  //     res.status(500).json({ error: error.message });
  //     }
  // }

  //get all attendees
  async getAllAttendees(req, res) {

    let query = null;
    if(req.query){
      query = req.query;
    }


    try {
      const attendees = await this.attendeesModel.getAttendees(query);
      res.status(200).json(attendees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAttendees(req, res) {
    const id = req.params.id;
    try {
      const attendees = await this.attendeesModel.getAttendeeById(id);
      res.status(200).json(attendees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //get attendee by registration id
  async getAttendeesByRegistrationId(req, res) {
    const registration_id = req.params.registration_id;
    let query = null;
    if(req.query){
      query = req.query;
    }

    try {
      const attendees = await this.attendeesModel.getAttendeesByRegistrationId(registration_id, query);
      res.status(200).json(attendees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //get event attendee by event id
  async getAttendeesByEventId(req, res) {
    const event_id = req.params.event_id;
    let query = null;
    if(req.query){
      query = req.query;
    }


    try {
      const attendees = await this.attendeesModel.getAttendeesByEventId(event_id, query);
      res.status(200).json(attendees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateAttendee(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const attendeeData = matchedData(req);
    const id = req.params.id;

    try {
      const affectedRows = await this.attendeesModel.updateAttendee(id, attendeeData);
      if (affectedRows) {
        res.status(200).json({ id: data.id, message: "Attendee updated successfully" });
      } else {
        res.status(404).json({ id: data.id, message: "Attendee not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAttendee(req, res) {
    const id = req.params.id;
    try {
      const affectedRows = await this.attendeesModel.deleteAttendee(id);
      if (affectedRows) {
        res.status(200).json({ message: "Attendee deleted successfully" });
      } else {
        res.status(404).json({ message: "Attendee not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AttendeesController();
