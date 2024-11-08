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
  async getAttendees() {
    try {
      const [attendees] = await this.pool.query("SELECT * FROM attendees");
      return attendees;
    } catch (error) {
      throw new Error(`Error retrieving attendees: ${error.message}`);
    }
  }

  //get attendee by id
  async getAttendeeById(id) {
    try {
      const [attendee] = await this.pool.query("SELECT * FROM attendees WHERE id = ?", [parseInt(id)]);
      return attendee[0] || null;
    } catch (error) {
      throw new Error(`Error retrieving attendee by ID: ${error.message}`);
    }
  }

  //get all attendees by registration id
  async getAttendeesByRegistrationId(registration_id) {
    try {
      const [attendees] = await this.pool.query("SELECT * FROM attendees WHERE registration_id = ?", [parseInt(registration_id)]);
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
}

export default AttendeesModel;
