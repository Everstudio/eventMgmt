import pool from "../configs/db.mjs";

class AttendeesModel {
  constructor() {
    this.pool = pool;
  }

  //create attendee
  async createAttendee(attendee) {
    try {
      const [result] = await this.pool.query("INSERT INTO attendees SET ?", [attendee]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating attendee: ${error.message}`);
    }
  }

  //get all attendees
  async getAttendees(query) {
    try {
      let sql = "SELECT attendees.*, events.name as event_name FROM attendees JOIN registrations ON attendees.registration_id = registrations.id JOIN events ON registrations.event_id = events.id";
      let params = [];
      if (query) {
        if (query.event_id) {
          sql += " WHERE events.id = ?";
          params.push(query.event_id);
        }

        if (query.status) {
          if (params.length > 0) {
            sql += " AND attendees.status = ?";
          } else {
            sql += " WHERE attendees.status = ?";
          }
          params.push(query.status);
        }
      }

      const [attendees] = await this.pool.query(sql, params);
      return attendees;
    } catch (error) {
      throw new Error(`Error retrieving attendees: ${error.message}`);
    }
  }

  //get attendee by id
  async getAttendeeById(id) {
    try {
      //get the attendee and also the event name from the events table
      const [attendees] = await this.pool.query(
        "SELECT attendees.*, events.name as event_name FROM attendees JOIN registrations ON attendees.registration_id = registrations.id JOIN events ON registrations.event_id = events.id WHERE attendees.id = ?",
        [parseInt(id)]
      );
      return attendees;
    } catch (error) {
      throw new Error(`Error retrieving attendee by ID: ${error.message}`);
    }
  }

  //get all attendees by registration id
  async getAttendeesByRegistrationId(registration_id, query) {
    try {
      let sql =
        "SELECT attendees.*, events.name as event_name FROM attendees JOIN registrations ON attendees.registration_id = registrations.id JOIN events ON registrations.event_id = events.id WHERE attendees.registration_id = ?";
      let params = [parseInt(registration_id)];
      if (query) {
        if (query.status) {
          sql += " AND attendees.status = ?";
          params.push(query.status);
        }
      }
      //get the attendee and also the event name from the events table
      const [attendees] = await this.pool.query(sql, params);
      return attendees;
    } catch (error) {
      throw new Error(`Error retrieving attendees by registration ID: ${error.message}`);
    }
  }

  //update attendee
  async updateAttendee(id, attendee) {
    try {
      const [result] = await this.pool.query("UPDATE attendees SET ? WHERE id = ?", [attendee, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating attendee: ${error.message}`);
    }
  }

  //update attendee status
  async updateAttendeesStatus(registrationId, status) {
    try {
      const [result] = await this.pool.query("UPDATE attendees SET status = ? WHERE registration_id = ?", [status, parseInt(registrationId)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating attendee status: ${error.message}`);
    }
  }

  //update attendee qr code
  async updateAttendeeQR(id, qr_code) {
    try {
      const [result] = await this.pool.query("UPDATE attendees SET qr_code = ? WHERE id = ?", [qr_code, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating attendee QR code: ${error.message}`);
    }
  }

  //delete attendee
  async deleteAttendee(id) {
    try {
      const [result] = await this.pool.query("DELETE FROM attendees WHERE id = ?", [parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting attendee: ${error.message}`);
    }
  }

  //get attendees e-ticket
  async getAttendeesETicket(query) {
    const registrationId = query.id;
    const unique_code = query.e;

    //retrieve all the attendees with the registration id and unique code
    try {
      //get the attendee and also the event name from the events table
      const [attendees] = await this.pool.query(
        "SELECT attendees.*, events.name as event_name FROM attendees JOIN registrations ON attendees.registration_id = registrations.id JOIN events ON registrations.event_id = events.id WHERE attendees.registration_id = ? AND attendees.unique_code = ?",
        [parseInt(registrationId), unique_code]
      );
      return attendees;
    } catch (error) {
      console.log(error);
      throw new Error(`Error retrieving attendees e-ticket: ${error.message}`);
    }
  }

  //get attendees by event id
  async getAttendeesByEventId(event_id, query) {
    try {
      let sql = "SELECT attendees.*, events.name as event_name FROM attendees JOIN registrations ON attendees.registration_id = registrations.id JOIN events ON registrations.event_id = events.id WHERE events.id = ?";
      let params = [parseInt(event_id)];

      if (query) {
        if (query.status) {
          sql += " AND attendees.status = ?";
          params.push(query.status);
        }
      }
      const [attendees] = await this.pool.query(sql, params);
      return attendees;
    } catch (error) {
      throw new Error(`Error retrieving attendees by event ID: ${error.message}`);
    }
  }
}

export default AttendeesModel;
