import { validationResult, matchedData } from "express-validator";
import AttendeesModel from "../models/attendeesModel.mjs";

class AttendeesController {
  constructor() {
    this.attendeesModel = new AttendeesModel();
  }

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
    try {
      const attendees = await this.attendeesModel.getAttendees();
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
    try {
      const attendees = await this.attendeesModel.getAttendeesByRegistrationId(registration_id);
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

    try {
      const affectedRows = await this.attendeesModel.updateAttendee(attendeeData);
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
