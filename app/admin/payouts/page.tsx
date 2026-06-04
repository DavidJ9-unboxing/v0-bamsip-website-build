import { requireAdmin } from "@/lib/admin"
import { listPayouts, getServiceStatus } from "@/app/actions/admin"
import { PayoutsPanel } from "@/components/admin/payouts-panel"
import { AUTO_APPROVE_CAP_GBP, PAYOUT_APPROVER_EMAIL } from "@/lib/referral"

export default async function PayoutsPage() {
  const admin = await requireAdmin()
  const [rows, status] = await Promise.all([listPayouts(), getServiceStatus()])
  const totalOwed = rows
    .filter((r) => r.status === "owed")
    .reduce((sum, r) => sum + r.amountGbp, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Referral payouts</h1>
        <p className="text-sm text-muted-foreground">
          £5 owed for every 50 confirmed sign-ups a Bammer refers. The first £
          {AUTO_APPROVE_CAP_GBP} per person auto-approves; anything beyond needs
          approval from {PAYOUT_APPROVER_EMAIL}.
        </p>
      </div>
      <PayoutsPanel
        payouts={rows}
        paypalConfigured={status.paypal}
        totalOwed={totalOwed}
        adminEmail={admin.email}
        approverEmail={PAYOUT_APPROVER_EMAIL}
      />
    </div>
  )
}
