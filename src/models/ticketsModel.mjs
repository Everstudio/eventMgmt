import pool from "../configs/db.mjs";

// Constructor
class TicketsModel {
  constructor() {
    this.pool = pool;
  }

  async createTicket(ticket) {
    try {
      const [result] = await this.pool.query("INSERT INTO tickets SET ?", [ticket]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating ticket: ${error.message}`);
    }
  }

  //get all tickets
  async getTickets(query) {
    let sql = "SELECT * FROM tickets";
    const params = [];
    //default condition, tickets with status confirmed
    const conditions = ["status = 'confirmed'"];

    if (query.all === "true") {
      return await this.getAllTickets();
    }

    if (query.event_id) {
      conditions.push("event_id = ?");
      params.push(parseInt(query.event_id));
    }

    if (query.ticket_id) {
      conditions.push("id = ?");
      params.push(parseInt(query.ticket_id));
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    try {
      const [tickets] = await this.pool.query(sql, params);
      return tickets;
    } catch (error) {
      throw new Error(`Error retrieving tickets: ${error.message}`);
    }
  }

  async getAllTickets() {
    try {
      const [tickets] = await this.pool.query("SELECT * FROM tickets");
      return tickets;
    } catch (error) {
      throw new Error(`Error retrieving tickets: ${error.message}`);
    }
  }

  async getTicketsByEventId(event_id) {
    try {
      const [tickets] = await this.pool.query("SELECT * FROM tickets WHERE event_id = ?", [parseInt(event_id)]);
      return tickets;
    } catch (error) {
      throw new Error(`Error retrieving tickets: ${error.message}`);
    }
  }

  async getTicketById(id) {
    try {
      const [ticket] = await this.pool.query("SELECT * FROM tickets WHERE id = ?", [parseInt(id)]);
      return ticket[0] || null;
    } catch (error) {
      throw new Error(`Error retrieving ticket by ID: ${error.message}`);
    }
  }

  async updateTicket(id, ticket) {
    try {
      const [result] = await this.pool.query("UPDATE tickets SET ? WHERE id = ?", [ticket, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating ticket: ${error.message}`);
    }
  }

  //decrease ticket stock
  async decreaseTicketStock(id) {
    try {
      const [result] = await this.pool.query("UPDATE tickets SET stock = stock - 1 WHERE id = ?", [parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating ticket stock: ${error.message}`);
    }
  }

  //increase ticket stock
  async increaseTicketStock(id, quantity) {
    try {
      const [result] = await this.pool.query("UPDATE tickets SET stock = stock + ? WHERE id = ?", [parseInt(quantity), parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating ticket stock: ${error.message}`);
    }
  }

  async deleteTicket(id) {
    try {
      const [result] = await this.pool.query("DELETE FROM tickets WHERE id = ?", [parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting ticket: ${error.message}`);
    }
  }
}

export default TicketsModel;
