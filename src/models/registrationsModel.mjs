import pool from "../configs/db.mjs";

class RegistrationsModel {
  constructor() {
    this.pool = pool;
  }

  async createRegistration(registration) {
    try {
      const [result] = await this.pool.query("INSERT INTO registrations SET ?", [registration]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating registration: ${error.message}`);
    }
  }

  //get registration by id
  async getRegistrationById(id) {
    try {
      const [registration] = await this.pool.query("SELECT * FROM registrations WHERE id = ?", [parseInt(id)]);
      return registration[0] || null;
    } catch (error) {
      throw new Error(`Error retrieving registration by ID: ${error.message}`);
    }
  }

  //get all registrations
  async getRegistrations(query) {
    try {
      let sql = "SELECT * FROM registrations";
      let params = [];
      if (query) {
        if (query.event_id) {
          sql += " WHERE event_id = ?";
          params.push(query.event_id);
        }

        if (query.status) {
          if (params.length > 0) {
            sql += " AND status = ?";
          } else {
            sql += " WHERE status = ?";
          }
          params.push(query.status);
        }
      }
      const [registrations] = await this.pool.query(sql, params);
      return registrations;
    } catch (error) {
      throw new Error(`Error retrieving registrations: ${error.message}`);
    }
  }

  //get registration by purchase_id
  async getRegistrationByPurchaseId(purchase_id) {
    try {
      const [registration] = await this.pool.query("SELECT * FROM registrations WHERE purchase_id = ?", [purchase_id]);
      return registration[0] || null;
    } catch (error) {
      throw new Error(`Error retrieving registration by purchase_id: ${error.message}`);
    }
  }

  //update registration status
  async updateRegistrationStatus(id, status) {
    try {
      const [result] = await this.pool.query("UPDATE registrations SET status = ? WHERE id = ?", [status, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating registration status: ${error.message}`);
    }
  }

  //update registration
  async updateRegistration(id, registration) {
    try {
      const [result] = await this.pool.query("UPDATE registrations SET ? WHERE id = ?", [registration, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating registration: ${error.message}`);
    }
  }

  //updateRegistrationQR
  async updateRegistrationQR(id, qr_code) {
    try {
      const [result] = await this.pool.query("UPDATE registrations SET qr_code = ? WHERE id = ?", [qr_code, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating registration QR: ${error.message}`);
    }
  }

  //delete registration
  async deleteRegistration(id) {
    try {
      const [result] = await this.pool.query("DELETE FROM registrations WHERE id = ?", [parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting registration: ${error.message}`);
    }
  }
}

export default RegistrationsModel;
