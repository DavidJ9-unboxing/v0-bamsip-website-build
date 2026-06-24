import { requireAdmin } from "@/lib/admin"
import { getEmailableVenues } from "@/app/actions/venue-email"
import { emailConfigured } from "@/lib/messaging"
import { getBaseUrl } from "@/lib/referral"
import { VenueEmailComposer } from "@/components/admin/venue-email-composer"

export default async function VenueEmailPage() {
  const admin = await requireAdmin()
  const venues = await getEmailableVenues()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Email venues</h1>
        <p className="text-sm text-muted-foreground">
          Compose a personalised email and send it to every venue or a hand-picked
          selection. Use {"{{venueName}}"} and {"{{contactName}}"} to personalise.
        </p>
      </div>
      <VenueEmailComposer
        venues={venues}
        emailConfigured={emailConfigured()}
        defaultCtaUrl={`${getBaseUrl()}/venues`}
        adminEmail={admin.email ?? ""}
      />
    </div>
  )
}
