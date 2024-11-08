import { validationResult, matchedData } from "express-validator";
import HostsModel from "../models/hostsModel.mjs";

// Constructor
class HostsController {
  constructor() {
    this.hostsModel = new HostsModel();
  }

  async createHost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const hostData = matchedData(req);

    try {
      const hostId = await this.hostsModel.createHost(hostData);
      res.status(200).json({ id: hostId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHosts(req, res) {
    try {
      const hosts = await this.hostsModel.getHosts();
      res.status(200).json(hosts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHostById(req, res) {
    const { id } = req.params;

    try {
      const host = await this.hostsModel.getHostById(id);
      if (host) {
        res.status(200).json(host);
      } else {
        res.status(404).json({ message: "Host not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateHost(req, res) {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const hostData = matchedData(req);

    try {
      const affectedRows = await this.hostsModel.updateHost(id, hostData);
      if (affectedRows) {
        res.status(200).json({ message: "Host updated successfully" });
      } else {
        res.status(404).json({ message: "Host not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteHost(req, res) {
    const { id } = req.params;

    try {
      const affectedRows = await this.hostsModel.deleteHost(id);
      if (affectedRows) {
        res.status(200).json({ message: "Host deleted successfully" });
      } else {
        res.status(404).json({ message: "Host not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new HostsController();
