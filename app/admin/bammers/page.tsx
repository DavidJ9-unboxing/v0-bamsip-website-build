import { requireAdmin } from "@/lib/admin"
import { listBammers } from "@/app/actions/admin"
import { BammersTable } from "@/components/admin/bammers-table"

export default async function BammersPage() {
  await requireAdmin()
  const rows = await listBammers()
  return <BammersTable initial={rows} />
}
