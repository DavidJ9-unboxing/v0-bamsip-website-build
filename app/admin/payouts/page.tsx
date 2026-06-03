import { requireAdmin } from "@/lib/admin"
import { listPayouts, getServiceStatus } from "@/app/actions/admin"
import { PayoutsPanel } from "@/components/admin/payouts-panel"

export default async function PayoutsPage() {
  await requireAdmin()
  const [rows, status] = await Promise.all([listPayouts(), getServiceStatus()])
  const totalOwed = rows
    .filter((r) => r.status === "owed")
    .reduce((sum, r) => sum + r.amountGbp, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Referral payouts</h1>
        <p className="text-sm text-muted-foreground">
          £5 owed for every 50 confirmed sign-ups a Bammer refers. Send via
          PayPal or mark paid manually.
        </p>
      </div>
      <PayoutsPanel
        payouts={rows}
        paypalConfigured={status.paypal}
        totalOwed={totalOwed}
      />
    </div>
  )
}
