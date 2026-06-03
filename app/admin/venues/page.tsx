import { requireAdmin } from "@/lib/admin"
import { listVenues } from "@/app/actions/admin"
import { VenuesTable } from "@/components/admin/venues-table"

export default async function VenuesPage() {
  await requireAdmin()
  const rows = await listVenues()
  return <VenuesTable initial={rows} />
}
