import pool from "../configs/db.mjs";

// Constructor
class EventsModel {
  constructor() {
    this.pool = pool;
  }

  async createEvent(event, eventCategoryId, eventTagId) {
    try {
      // Insert event data
      const [result] = await this.pool.query("INSERT INTO events SET ?", [event]);
      const event_id = result.insertId;

      // Insert into event-category mapping table
      // eventCategoryId may be a comma-separated string of IDs for many-to-many relationships
      const categoryIds = eventCategoryId.split(",").map((id) => parseInt(id));

      // Prepare data in format [[event_id, categoryId], [event_id, categoryId], ...]
      const mapData = categoryIds.map((categoryId) => [event_id, categoryId]);

      // Insert multiple rows into event_category_map
      await this.pool.query("INSERT INTO event_category_map (event_id, category_id) VALUES ?", [mapData]);

      // Insert into event-tag mapping table
      // eventTagId may be a comma-separated string of IDs for many-to-many relationships
      if (eventTagId) {
        // Check if eventTagId is not null
        const tagIds = eventTagId.split(",").map((id) => parseInt(id));

        // Prepare data in format [[event_id, tagId], [event_id, tagId], ...]
        const tagMapData = tagIds.map((tagId) => [event_id, tagId]);

        // Insert multiple rows into event_tag_map
        await this.pool.query("INSERT INTO event_tag_map (event_id, tag_id) VALUES ?", [tagMapData]);
      }

      return event_id;
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    }
  }

  async getEvents() {
    try {
      const [events] = await this.pool.query(`
        SELECT e.*, 
               GROUP_CONCAT(ec.id) AS category_ids,
               GROUP_CONCAT(ec.name) AS category_names,
                GROUP_CONCAT(et.id) AS tag_ids,
                GROUP_CONCAT(et.tag) AS tag_names
        FROM events e
        LEFT JOIN event_category_map ecm ON e.id = ecm.event_id
        LEFT JOIN event_categories ec ON ecm.category_id = ec.id
        LEFT JOIN event_tag_map etm ON e.id = etm.event_id
        LEFT JOIN event_tags et ON etm.tag_id = et.id
        GROUP BY e.id
      `);
      return events;
    } catch (error) {
      throw error;
    }
  }

  async getEventById(id) {
    try {
      const [event] = await this.pool.query(
        `
        SELECT e.*, 
               GROUP_CONCAT(ec.id) AS category_ids,
               GROUP_CONCAT(ec.name) AS category_names,
                GROUP_CONCAT(et.id) AS tag_ids,
                GROUP_CONCAT(et.tag) AS tag_names
        FROM events e
        LEFT JOIN event_category_map ecm ON e.id = ecm.event_id
        LEFT JOIN event_categories ec ON ecm.category_id = ec.id
        LEFT JOIN event_tag_map etm ON e.id = etm.event_id
        LEFT JOIN event_tags et ON etm.tag_id = et.id
        WHERE e.id = ?
        GROUP BY e.id
      `,
        [id]
      );
      return event[0]; // Returns the single event object
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(id, event, eventCategoryId, eventTagId) {
    try {
      // Update the main event details
      const [result] = await this.pool.query("UPDATE events SET ? WHERE id = ?", [event, id]);

      if (eventCategoryId) {
        // Clear existing mappings
        await this.pool.query("DELETE FROM event_category_map WHERE event_id = ?", [id]);

        // Insert new category mappings
        const categoryIds = eventCategoryId.split(",").map((catId) => [id, parseInt(catId)]);
        await this.pool.query("INSERT INTO event_category_map (event_id, category_id) VALUES ?", [categoryIds]);
      }

      // Insert into event-tag mapping table
      // eventTagId may be a comma-separated string of IDs for many-to-many relationships
      if (eventTagId) {
        // Clear existing mappings
        await this.pool.query("DELETE FROM event_tag_map WHERE event_id = ?", [id]);

        // Insert new tag mappings
        const tagIds = eventTagId.split(",").map((tagId) => [id, parseInt(tagId)]);
        await this.pool.query("INSERT INTO event_tag_map (event_id, tag_id) VALUES ?", [tagIds]);
      }

      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
  async deleteEvent(id) {
    try {
      // Delete from event_category_map first to avoid orphaned mappings
      await this.pool.query("DELETE FROM event_category_map WHERE event_id = ?", [id]);

      // Delete the event itself
      const [result] = await this.pool.query("DELETE FROM events WHERE id = ?", [id]);

      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  async createEventCategory(category) {
    try {
      const [result] = await this.pool.query("INSERT INTO event_categories SET ?", [category]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  async getEventCategories() {
    try {
      const [categories] = await this.pool.query("SELECT * FROM event_categories");
      return categories;
    } catch (error) {
      throw new Error(`Error retrieving categories: ${error.message}`);
    }
  }

  async getEventCategoryById(id) {
    try {
      const [category] = await this.pool.query("SELECT * FROM event_categories WHERE id = ?", [parseInt(id)]);
      return category[0] || null;
    } catch (error) {
      throw new Error(`Error retrieving category by ID: ${error.message}`);
    }
  }

  async updateEventCategory(id, category) {
    try {
      const [result] = await this.pool.query("UPDATE event_categories SET ? WHERE id = ?", [category, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  async deleteEventCategory(id) {
    try {
      const [result] = await this.pool.query("DELETE FROM event_categories WHERE id = ?", [parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }

  async createEventTag(tag) {
    try {
      const [result] = await this.pool.query("INSERT INTO event_tags SET ?", [tag]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating tag: ${error.message}`);
    }
  }

  async getEventTags() {
    try {
      const [tags] = await this.pool.query("SELECT * FROM event_tags");
      return tags;
    } catch (error) {
      throw new Error(`Error retrieving tags: ${error.message}`);
    }
  }

  async getEventTagById(id) {
    try {
      const [tag] = await this.pool.query("SELECT * FROM event_tags WHERE id = ?", [parseInt(id)]);
      return tag[0] || null;
    } catch (error) {
      throw new Error(`Error retrieving tag by ID: ${error.message}`);
    }
  }

  async updateEventTag(id, tag) {
    try {
      const [result] = await this.pool.query("UPDATE event_tags SET ? WHERE id = ?", [tag, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating tag: ${error.message}`);
    }
  }

  async deleteEventTag(id) {
    try {
      const [result] = await this.pool.query("DELETE FROM event_tags WHERE id = ?", [parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting tag: ${error.message}`);
    }
  }

  //create event schedule
  async createEventSchedule(schedule) {
    try {
      const [result] = await this.pool.query("INSERT INTO event_schedules SET ?", [schedule]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating schedule: ${error.message}`);
    }
  }

  //get all event schedules
  async getEventSchedules(event_id) {
    try {
      const [schedules] = await this.pool.query("SELECT * FROM event_schedules WHERE event_id = ?", [parseInt(event_id)]);
      return schedules;
    } catch (error) {
      throw new Error(`Error getting schedules: ${error.message}`);
    }
  }

  //update event schedule
  async updateEventSchedule(id, schedule) {
    try {
      const [result] = await this.pool.query("UPDATE event_schedules SET ? WHERE id = ?", [schedule, parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating schedule: ${error.message}`);
    }
  }

  //delete event schedule
  async deleteEventSchedule(id) {
    try {
      const [result] = await this.pool.query("DELETE FROM event_schedules WHERE id = ?", [parseInt(id)]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting schedule: ${error.message}`);
    }
  }
}

export default EventsModel;
