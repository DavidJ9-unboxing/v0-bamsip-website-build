import { requireAdmin } from "@/lib/admin"
import { getMessageLog, getServiceStatus } from "@/app/actions/admin"
import { MessagesPanel } from "@/components/admin/messages-panel"

export default async function MessagesPage() {
  await requireAdmin()
  const [log, status] = await Promise.all([
    getMessageLog(),
    getServiceStatus(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Send email or SMS to a segment of your list. Texts only go to people
          who opted in.
        </p>
      </div>
      <MessagesPanel
        log={log}
        emailConfigured={status.email}
        smsConfigured={status.sms}
      />
    </div>
  )
}
