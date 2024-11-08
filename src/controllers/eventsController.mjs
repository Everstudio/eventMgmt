import EventsModel from "../models/eventsModel.mjs";
import { validationResult, matchedData } from "express-validator";

// Constructor
class EventsController {
  constructor() {
    this.eventsModel = new EventsModel();
  }

  async createEvent(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const eventData = matchedData(req);
    let eventCategoryId = null;
    let eventTagId = null;
    if (req.body.category_id) {
      eventCategoryId = req.body.category_id; //get category_id from request body, not from matchedData
    } else {
      eventCategoryId = null;
      res.status(400).json({ message: "Category ID is required" });
    }
    if (req.body.tag_id) {
      eventTagId = req.body.tag_id; //get tag_ids from request body, not from matchedData
    }
    try {
      const eventId = await this.eventsModel.createEvent(eventData, eventCategoryId, eventTagId);
      res.status(200).json({ id: eventId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEvents(req, res) {
    try {
      const events = await this.eventsModel.getEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEventById(req, res) {
    const { id } = req.params;

    try {
      const event = await this.eventsModel.getEventById(id);
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateEvent(req, res) {
    const { id } = req.params;
    const eventData = matchedData(req);
    console.log(eventData);

    let eventCategoryId = null;
    let eventTagId = null;
    if (req.body.category_id) {
      eventCategoryId = req.body.category_id; //get category_id from request body, not from matchedData
    } else {
      res.status(400).json({ message: "Category ID is required" });
    }
    if (req.body.tag_id) {
      eventTagId = req.body.tag_id; //get tag_ids from request body, not from matchedData
    }

    try {
      const affectedRows = await this.eventsModel.updateEvent(id, eventData, eventCategoryId, eventTagId);
      if (affectedRows) {
        res.status(200).json({ message: "Event updated successfully" });
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteEvent(req, res) {
    const { id } = req.params;

    try {
      const affectedRows = await this.eventsModel.deleteEvent(id);
      if (affectedRows) {
        res.status(200).json({ message: "Event deleted successfully" });
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create event category
  async createEventCategory(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const categoryData = matchedData(req);
    try {
      const categoryId = await this.eventsModel.createEventCategory(categoryData);
      res.status(200).json({ id: categoryId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all event categories
  async getEventCategories(req, res) {
    try {
      const categories = await this.eventsModel.getEventCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get event category by ID
  async getEventCategoryById(req, res) {
    const { id } = req.params;
    try {
      const category = await this.eventsModel.getEventCategoryById(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "Event category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update event category
  async updateEventCategory(req, res) {
    const { id } = req.params;
    const categoryData = matchedData(req);
    try {
      const affectedRows = await this.eventsModel.updateEventCategory(id, categoryData);
      if (affectedRows) {
        res.status(200).json({ message: "Event category updated successfully" });
      } else {
        res.status(404).json({ message: "Event category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete event category
  async deleteEventCategory(req, res) {
    const { id } = req.params;
    try {
      const affectedRows = await this.eventsModel.deleteEventCategory(id);
      if (affectedRows) {
        res.status(200).json({ message: "Event category deleted successfully" });
      } else {
        res.status(404).json({ message: "Event category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create event tag
  async createEventTag(req, res) {
    const eventData = matchedData(req);
    try {
      const tagId = await this.eventsModel.createEventTag(eventData);
      res.status(200).json({ id: tagId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all event tags
  async getEventTags(req, res) {
    try {
      const tags = await this.eventsModel.getEventTags();
      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get event tag by ID
  async getEventTagById(req, res) {
    const { id } = req.params;
    try {
      const tag = await this.eventsModel.getEventTagById(id);
      if (tag) {
        res.status(200).json(tag);
      } else {
        res.status(404).json({ message: "Event tag not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update event tag
  async updateEventTag(req, res) {
    const { id } = req.params;
    const eventData = matchedData(req);
    try {
      const affectedRows = await this.eventsModel.updateEventTag(id, eventData);
      if (affectedRows) {
        res.status(200).json({ message: "Event tag updated successfully" });
      } else {
        res.status(404).json({ message: "Event tag not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete event tag
  async deleteEventTag(req, res) {
    const { id } = req.params;
    try {
      const affectedRows = await this.eventsModel.deleteEventTag(id);
      if (affectedRows) {
        res.status(200).json({ message: "Event tag deleted successfully" });
      } else {
        res.status(404).json({ message: "Event tag not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //create or update the event schedule, check if id exists, if exists, update, if not, create
  //the event schedule is like an agenda that bind to an event, and is array of objects
  async createEventSchedule(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const matchedScheduleData = matchedData(req);
    const scheduleData = matchedScheduleData.schedules

    // Make sure scheduleData is an array
    if (!Array.isArray(scheduleData)) {
      return res.status(400).json({ error: "Schedule data must be an array." });
    }

    try {
      // Use Promise.all to handle the array of schedules
      const schedules = await Promise.all(
        scheduleData.map(async (schedule) => {
          if (schedule.id) {
            // Update existing schedule
            try {
              const affectedRows = await this.eventsModel.updateEventSchedule(schedule.id, schedule);
              if (affectedRows) {
                return { id: schedule.id, message: "Event schedule updated successfully" };
              } else {
                return { id: schedule.id, message: "Event schedule not found" };
              }
            } catch (error) {
              return { id: schedule.id, error: error.message };
            }
          } else {
            // Create new schedule
            try {
              const scheduleId = await this.eventsModel.createEventSchedule(schedule);
              return { id: scheduleId, message: "Event schedule created successfully" };
            } catch (error) {
              return { error: error.message };
            }
          }
        })
      );

      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //get all event schedules
  async getEventSchedules(req, res) {
    const event_id = req.params.event_id;
    try {
      const schedules = await this.eventsModel.getEventSchedules(event_id);
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //delete event schedule
  async deleteEventSchedule(req, res) {
    const { id } = req.params;
    try {
      const affectedRows = await this.eventsModel.deleteEventSchedule(id);
      if (affectedRows) {
        res.status(200).json({ message: "Event schedule deleted successfully" });
      } else {
        res.status(404).json({ message: "Event schedule not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new EventsController();
