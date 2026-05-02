// Email notifications are stubbed — Resend will be wired up later.
// All functions log to console instead of sending real emails.

export async function sendDealDeadlineReminder(params: {
  athleteEmail: string;
  athleteName: string;
  brandName: string;
  deadline: string;
  dealId: string;
}) {
  console.log("[EMAIL STUB] Deal deadline reminder:", params);
  return { success: true, stubbed: true };
}

export async function sendPaymentReceived(params: {
  athleteEmail: string;
  athleteName: string;
  brandName: string;
  amount: number;
}) {
  console.log("[EMAIL STUB] Payment received notification:", params);
  return { success: true, stubbed: true };
}

export async function sendComplianceAlert(params: {
  athleteEmail: string;
  athleteName: string;
  issue: string;
}) {
  console.log("[EMAIL STUB] Compliance alert:", params);
  return { success: true, stubbed: true };
}
