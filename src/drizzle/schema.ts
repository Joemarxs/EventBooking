import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  date,
  time,
  numeric,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

import {
  relations,
  InferModel,
} from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["admin", "customer"]);
export const paymentMethodEnum = pgEnum("payment_method", ["mpesa", "card", "paypal"]);
export const supportStatusEnum = pgEnum("status", ["open", "pending", "closed"]);

// Users Table
export const users = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  role: roleEnum("role"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

// Venues Table
export const venues = pgTable("venues", {
  venue_id: serial("venue_id").primaryKey(),
  name: varchar("name", { length: 150 }),
  address: varchar("address", { length: 255 }),
  capacity: integer("capacity"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});

// Events Table
export const events = pgTable("events", {
  event_id: serial("event_id").primaryKey(),
  title: varchar("title", { length: 255 }),
  category: varchar("category", { length: 100 }),
  date: date("date"),
  time: time("time"),
  ticketPrice: numeric("ticketPrice"),
  ticketsTotal: integer("ticketsTotal"),
  ticketSold: integer("ticketSold").default(0),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
  venue_id: integer("venue_id").references(() => venues.venue_id),
});

// Payments Table
export const payments = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  event_id: integer("event_id").references(() => events.event_id),
  user_id: integer("user_id").references(() => users.user_id),
  amount: numeric("amount"),
  paymentStatus: boolean("paymentStatus"),
  paymentDate: date("paymentDate"),
  paymentMethod: paymentMethodEnum("paymentMethod"),
  transactionId: varchar("transactionId", { length: 255 }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

// Customer Support Table
export const customerSupport = pgTable("customer_support", {
  support_id: serial("support_id").primaryKey(),
  payment_id: integer("payment_id").references(() => payments.payment_id),
  user_id: integer("user_id").references(() => users.user_id),
  subject: varchar("subject", { length: 255 }),
  description: varchar("description", { length: 1000 }),
  status: supportStatusEnum("status"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});




// USERS RELATIONS 
export const usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  supportTickets: many(customerSupport),
}));

// VENUES RELATIONS 
export const venuesRelations = relations(venues, ({ many }) => ({
  events: many(events),
}));

// EVENTS RELATION 
export const eventsRelations = relations(events, ({ one, many }) => ({
  venue: one(venues, {
    fields: [events.venue_id],
    references: [venues.venue_id],
  }),
  payments: many(payments),
}));

// PAYMENTS RELATIONS
export const paymentsRelations = relations(payments, ({ one, many }) => ({
  user: one(users, {
    fields: [payments.user_id],
    references: [users.user_id],
  }),
  event: one(events, {
    fields: [payments.event_id],
    references: [events.event_id],
  }),
  supportTickets: many(customerSupport),
}));

// CUSTOMER SUPPORT RELATIONS 
export const customerSupportRelations = relations(customerSupport, ({ one }) => ({
  user: one(users, {
    fields: [customerSupport.user_id],
    references: [users.user_id],
  }),
  payment: one(payments, {
    fields: [customerSupport.payment_id],
    references: [payments.payment_id],
  }),
}));



// EXPORTS 

// Users
export type TIUser = typeof users.$inferInsert;
export type TSUser = typeof users.$inferSelect;

// Venues
export type TIVenue = typeof venues.$inferInsert;
export type TSVenue = typeof venues.$inferSelect;

// Events
export type TIEvent = typeof events.$inferInsert;
export type TSEvent = typeof events.$inferSelect;

// Payments
export type TIPayment = typeof payments.$inferInsert;
export type TSPayment = typeof payments.$inferSelect;

// Customer Support
export type TICustomerSupport = typeof customerSupport.$inferInsert;
export type TSCustomerSupport = typeof customerSupport.$inferSelect;
