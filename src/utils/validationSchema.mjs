export const createEventValidationSchema = {
  name: {
    isString: {
      errorMessage: "Event name must be a string",
    },
    notEmpty: {
      errorMessage: "Event name is required",
    },
  },
  description: {
    isString: {
      errorMessage: "Event description must be a string",
    },
    optional: true,
  },
  location: {
    isString: {
      errorMessage: "Event location must be a string",
    },
    optional: true,
  },
  start_date: {
    isISO8601: {
      errorMessage: "Start date must be a valid date",
    },
    notEmpty: {
      errorMessage: "Start date is required",
    },
  },
  end_date: {
    isISO8601: {
      errorMessage: "End date must be a valid date",
    },
    notEmpty: {
      errorMessage: "End date is required",
    },
  },
  is_recurring: {
    isBoolean: {
      errorMessage: "Is recurring must be a boolean",
    },
    optional: true,
  },
  recurrence_pattern: {
    isString: {
      errorMessage: "Recurrence pattern must be a string",
    },
    optional: true,
  },
};

export const createEventCategoryValidationSchema = {
  name: {
    isString: {
      errorMessage: "Event category name must be a string",
    },
    notEmpty: {
      errorMessage: "Event category name is required",
    },
  },
  description: {
    isString: {
      errorMessage: "Event category description must be a string",
    },
    optional: true,
  },
};

export const createEventTagValidationSchema = {
  tag: {
    isString: {
      errorMessage: "Event tag name must be a string",
    },
    notEmpty: {
      errorMessage: "Event tag name is required",
    },
  },
};

export const createEventHostValidationSchema = {
  name: {
    isString: {
      errorMessage: "Host name must be a string",
    },
    notEmpty: {
      errorMessage: "Host name is required",
    },
  },
  email: {
    isEmail: {
      errorMessage: "Host email must be a valid email",
    },
    notEmpty: {
      errorMessage: "Host email is required",
    },
  },
  phone: {
    isString: {
      errorMessage: "Host phone must be a string",
    },
    optional: true,
  },
  organization: {
    isString: {
      errorMessage: "Host organization must be a string",
    },
    optional: true,
  },
  bio: {
    isString: {
      errorMessage: "Host bio must be a string",
    },
    optional: true,
  },
};

export const createEventScheduleValidationSchema = {
  schedules: {
    isArray: {
      errorMessage: "Schedules must be an array.",
    },
    notEmpty: {
      errorMessage: "Schedules array is required.",
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Schedules must be an array.");
        }
        return true; // All checks passed
      },
    },
  },
  "schedules.*.id": {
    //only exists when updating, so is optional
    isInt: {
      errorMessage: "Schedule ID must be an integer",
    },
    optional: true,
  },
  "schedules.*.event_id": {
    isInt: {
      errorMessage: "Event ID must be an integer",
    },
    notEmpty: {
      errorMessage: "Event ID is required",
    },
  },
  "schedules.*.host_id": {
    isInt: {
      errorMessage: "Host ID must be an integer",
    },
    notEmpty: {
      errorMessage: "Host ID is required",
    },
  },
  "schedules.*.start_time": {
    isISO8601: {
      errorMessage: "Start time must be a valid date",
    },
    notEmpty: {
      errorMessage: "Start time is required",
    },
  },
  "schedules.*.end_time": {
    isISO8601: {
      errorMessage: "End time must be a valid date",
    },
    notEmpty: {
      errorMessage: "End time is required",
    },
  },
  "schedules.*.agenda": {
    isString: {
      errorMessage: "Agenda must be a string",
    },
    optional: true,
  },
  "schedules.*.order": {
    isInt: {
      errorMessage: "Order must be an integer",
    },
    optional: true,
  },
};

export const createEventRegistrationValidationSchema = {
  event_id: {
    isInt: {
      errorMessage: "Event ID must be an integer",
    },
    notEmpty: {
      errorMessage: "Event ID is required",
    },
  },
  user_id: {
    isInt: {
      errorMessage: "User ID must be an integer",
    },
    notEmpty: {
      errorMessage: "User ID is required",
    },
  },
  sub_total: {
    isFloat: {
      errorMessage: "Sub total must be a float",
    },
    notEmpty: {
      errorMessage: "Sub total is required",
    },
  },
  discount: {
    isFloat: {
      errorMessage: "Discount must be a float",
    },
    optional: true,
  },
  tax: {
    isFloat: {
      errorMessage: "Tax must be a float",
    },
    optional: true,
  },
  total: {
    isFloat: {
      errorMessage: "Total must be a float",
    },
    notEmpty: {
      errorMessage: "Total is required",
    },
  },
  status: {
    isString: {
      errorMessage: "Status must be a string",
    },
    notEmpty: {
      errorMessage: "Status is required",
    },
  },
  items: {
    //json array of items
    isArray: {
      errorMessage: "Items must be an array.",
    },
    notEmpty: {
      errorMessage: "Items array is required.",
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Items must be an array.");
        }
        return true; // All checks passed
      },
    },
  },
  info: {
    isString: {
      errorMessage: "Info must be a string",
    },
    optional: true,
  },
  qr_code: {
    isString: {
      errorMessage: "QR code must be a string",
    },
    optional: true,
  },
  attendees: {
    //json array of attendees
    isArray: {
      errorMessage: "Attendees must be an array.",
    },
    notEmpty: {
      errorMessage: "Attendees array is required.",
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Attendees must be an array.");
        }
        return true; // All checks passed
      },
    },
  },
  "attendees.*.name": {
    isString: {
      errorMessage: "First name must be a string",
    },
    notEmpty: {
      errorMessage: "First name is required",
    },
  },
  "attendees.*.email": {
    isEmail: {
      errorMessage: "Email must be a valid email",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  "attendees.*.phone": {
    isString: {
      errorMessage: "Phone must be a string",
    },
    optional: true,
  },
  "attendees.*.ticket_id": {
    isInt: {
      errorMessage: "Ticket ID must be an integer",
    },
    notEmpty: {
      errorMessage: "Ticket ID is required",
    },
  },
};

export const createEventTicketValidationSchema = {
  //is array of objects
  tickets: {
    isArray: {
      errorMessage: "Tickets must be an array.",
    },
    notEmpty: {
      errorMessage: "Tickets array is required.",
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Tickets must be an array.");
        }
        return true; // All checks passed
      },
    },
  },
  "tickets.*.event_id": {
    isInt: {
      errorMessage: "Event ID must be an integer",
    },
    optional: true, //only required when updating
  },
  "tickets.*.event_id": {
    isInt: {
      errorMessage: "Event ID must be an integer",
    },
    notEmpty: {
      errorMessage: "Event ID is required",
    },
  },
  "tickets.*.name": {
    isString: {
      errorMessage: "Ticket name must be a string",
    },
    notEmpty: {
      errorMessage: "Ticket name is required",
    },
  },
  "tickets.*.price": {
    isFloat: {
      errorMessage: "Price must be a float",
    },
    notEmpty: {
      errorMessage: "Price is required",
    },
  },
  "tickets.*.quantity": {
    isInt: {
      errorMessage: "Quantity must be an integer",
    },
    notEmpty: {
      errorMessage: "Quantity is required",
    },
  },
  "tickets.*.attendee_limit": {
    isInt: {
      errorMessage: "Attendee limit must be an integer",
    },
    optional: true,
  },
};

export const createEventAttendeeValidationSchema = {
  registration_id: {
    isInt: {
      errorMessage: "Registration ID must be an integer",
    },
    notEmpty: {
      errorMessage: "Registration ID is required",
    },
  },
  ticket_id: {
    isInt: {
      errorMessage: "Ticket ID must be an integer",
    },
    notEmpty: {
      errorMessage: "Ticket ID is required",
    },
  },
  ticket_info: {
    //is json object
    isObject: {
      errorMessage: "Ticket info must be an object",
    },
    notEmpty: {
      errorMessage: "Ticket info is required",
    },
  },
  name: {
    isString: {
      errorMessage: "Name must be a string",
    },
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  email: {
    isEmail: {
      errorMessage: "Email must be a valid email",
    },
    optional: true,
  },
  phone: {
    isString: {
      errorMessage: "Phone must be a string",
    },
    optional: true,
  },
  qr_code: {
    isString: {
      errorMessage: "QR code must be a string",
    },
    optional: true,
  },
  checked_in: {
    isBoolean: {
      errorMessage: "Checked in must be a boolean",
    },
    optional: true,
  },
};
