import pool from "../configs/db.mjs";


// Constructor
class HostsModel {
    constructor() {
      this.pool = pool;
    }


    // Get all hosts
    async getHosts() {
      try {
        const [hosts] = await this.pool.query("SELECT * FROM hosts");
        return hosts;
      } catch (error) {
        throw new Error(`Error getting hosts: ${error.message}`);
      }
    }

    // Get host by ID
    async getHostById(id) {
      try {
        const [host] = await this.pool.query("SELECT * FROM hosts WHERE id = ?", [parseInt(id)]);
        return host[0] || null;
      } catch (error) {
        throw new Error(`Error getting host by ID: ${error.message}`);
      }
    }

    // Create host
    async createHost(host) {
      try {
        const [result] = await this.pool.query("INSERT INTO hosts SET ?", [host]);
        return result.insertId;
      } catch (error) {
        throw new Error(`Error creating host: ${error.message}`);
      }
    }

    // Update host
    async updateHost(id, host) {
      try {
        const [result] = await this.pool.query("UPDATE hosts SET ? WHERE id = ?", [host, parseInt(id)]);
        return result.affectedRows;
      } catch (error) {
        throw new Error(`Error updating host: ${error.message}`);
      }
    }

    // Delete host
    async deleteHost(id) {
      try {
        const [result] = await this.pool.query("DELETE FROM hosts WHERE id = ?", [parseInt(id)]);
        return result.affectedRows;
      } catch (error) {
        throw new Error(`Error deleting host: ${error.message}`);
      }
    }
}

export default HostsModel;