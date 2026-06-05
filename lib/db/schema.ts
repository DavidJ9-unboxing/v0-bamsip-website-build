import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
} from "drizzle-orm/pg-core"

/* ----------------------------- Better Auth ----------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

/* ------------------------------ BamSip app ------------------------------ */

export const bammerSignups = pgTable("bammer_signups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  smsOptIn: boolean("sms_opt_in").notNull().default(false),
  emailOptIn: boolean("email_opt_in").notNull().default(true),
  vibe: text("vibe"),
  frequency: text("frequency"),
  motivation: text("motivation"),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  paypalEmail: text("paypal_email"),
  status: text("status").notNull().default("pending"),
  confirmToken: text("confirm_token"),
  confirmedAt: timestamp("confirmed_at"),
  source: text("source").notNull().default("web"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const venueSignups = pgTable("venue_signups", {
  id: serial("id").primaryKey(),
  venueName: text("venue_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  role: text("role"),
  smsOptIn: boolean("sms_opt_in").notNull().default(false),
  venueType: text("venue_type"),
  goal: text("goal"),
  challenge: text("challenge"),
  status: text("status").notNull().default("pending"),
  confirmToken: text("confirm_token"),
  confirmedAt: timestamp("confirmed_at"),
  source: text("source").notNull().default("web"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  bammerId: integer("bammer_id").notNull(),
  paypalEmail: text("paypal_email").notNull(),
  amountGbp: integer("amount_gbp").notNull().default(5),
  referralsSnapshot: integer("referrals_snapshot").notNull().default(0),
  status: text("status").notNull().default("owed"),
  paypalBatchId: text("paypal_batch_id"),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
})

export const messageLog = pgTable("message_log", {
  id: serial("id").primaryKey(),
  recipientType: text("recipient_type").notNull(),
  recipientId: integer("recipient_id"),
  recipientContact: text("recipient_contact").notNull(),
  channel: text("channel").notNull(),
  template: text("template"),
  subject: text("subject"),
  body: text("body"),
  status: text("status").notNull().default("queued"),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
