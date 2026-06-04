import { requireAdmin } from "@/lib/admin"
import {
  listDirectory,
  getDirectoryStats,
  getDirectoryCategories,
} from "@/app/actions/directory"
import { DirectoryTable } from "@/components/admin/directory-table"

export default async function VenueDirectoryPage() {
  await requireAdmin()
  const [rows, stats, categories] = await Promise.all([
    listDirectory(),
    getDirectoryStats(),
    getDirectoryCategories(),
  ])
  return <DirectoryTable initial={rows} stats={stats} categories={categories} />
}
