"use server"

import { db } from "@/lib/db"
import { pageViews } from "@/lib/db/schema"
import { and, gte, sql } from "drizzle-orm"
import { getAdminSession } from "@/lib/admin"

async function assertAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error("Unauthorized")
  return session.user
}

export type AnalyticsRange = 7 | 30 | 90

function sinceDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Headline counts: total views + unique visitors for the window and the
 *  immediately preceding window (for a % change). */
export async function getVisitStats(days: AnalyticsRange = 30) {
  await assertAdmin()
  const since = sinceDate(days)
  const prevSince = sinceDate(days * 2)

  const [current] = await db
    .select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.visitorId})::int`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))

  const [previous] = await db
    .select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.visitorId})::int`,
    })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, prevSince), sql`${pageViews.createdAt} < ${since}`))

  const pct = (now: number, before: number) =>
    before === 0 ? (now > 0 ? 100 : 0) : Math.round(((now - before) / before) * 100)

  // views per visitor as a rough "pages per session"
  const perVisitor =
    current.visitors > 0
      ? Math.round((current.views / current.visitors) * 10) / 10
      : 0

  return {
    views: current.views,
    visitors: current.visitors,
    perVisitor,
    viewsChange: pct(current.views, previous.views),
    visitorsChange: pct(current.visitors, previous.visitors),
  }
}

/** Daily views + unique visitors for the trend chart. */
export async function getVisitTrend(days: AnalyticsRange = 30) {
  await assertAdmin()
  const since = sinceDate(days)
  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${pageViews.createdAt}), 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.visitorId})::int`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`date_trunc('day', ${pageViews.createdAt})`)
    .orderBy(sql`date_trunc('day', ${pageViews.createdAt})`)
  return rows
}

/** Most viewed pages. */
export async function getTopPages(days: AnalyticsRange = 30, limit = 10) {
  await assertAdmin()
  const since = sinceDate(days)
  return db
    .select({
      label: pageViews.path,
      count: sql<number>`count(*)::int`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.path)
    .orderBy(sql`count(*) desc`)
    .limit(limit)
}

/** Traffic sources, grouping null referrer host as "Direct". */
export async function getReferrers(days: AnalyticsRange = 30, limit = 10) {
  await assertAdmin()
  const since = sinceDate(days)
  return db
    .select({
      label: sql<string>`coalesce(${pageViews.referrerHost}, 'Direct')`,
      count: sql<number>`count(*)::int`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`coalesce(${pageViews.referrerHost}, 'Direct')`)
    .orderBy(sql`count(*) desc`)
    .limit(limit)
}

/** Device split (mobile / desktop / tablet). */
export async function getDeviceBreakdown(days: AnalyticsRange = 30) {
  await assertAdmin()
  const since = sinceDate(days)
  return db
    .select({
      label: pageViews.device,
      count: sql<number>`count(*)::int`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.device)
    .orderBy(sql`count(*) desc`)
}

/** Top countries by views. */
export async function getGeoBreakdown(days: AnalyticsRange = 30, limit = 8) {
  await assertAdmin()
  const since = sinceDate(days)
  return db
    .select({
      label: sql<string>`coalesce(${pageViews.country}, 'Unknown')`,
      count: sql<number>`count(*)::int`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`coalesce(${pageViews.country}, 'Unknown')`)
    .orderBy(sql`count(*) desc`)
    .limit(limit)
}
