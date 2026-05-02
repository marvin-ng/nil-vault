import { subDays, addDays, subMonths, format } from "date-fns";

const today = new Date("2026-05-02");

export const DEMO_PROFILE = {
  id: "demo-user-id",
  email: "jordan@utexas.edu",
  full_name: "Jordan Williams",
  sport: "Basketball",
  school: "University of Texas",
  division: "NCAA D1",
  role: "athlete" as const,
  program_id: null,
};

export const DEMO_DEALS = [
  {
    id: "deal-1",
    brand_name: "Nike",
    amount: 3500,
    status: "signed" as const,
    deadline: format(addDays(today, 6), "yyyy-MM-dd"),
    deliverable_type: "Instagram Reel",
    ftc_compliant: null,
    notes: "Full outfit campaign. Must tag @Nike and use #NikeBasketball.",
  },
  {
    id: "deal-2",
    brand_name: "Gatorade",
    amount: 1200,
    status: "posted" as const,
    deadline: format(subDays(today, 12), "yyyy-MM-dd"),
    deliverable_type: "TikTok Video",
    ftc_compliant: false,
    notes: "Recovery drink promo. Caption pending FTC review.",
  },
  {
    id: "deal-3",
    brand_name: "Under Armour",
    amount: 5000,
    status: "inquiry" as const,
    deadline: null,
    deliverable_type: "Brand Ambassador",
    ftc_compliant: null,
    notes: "Interested in a 3-month ambassador deal. Contract TBD.",
  },
  {
    id: "deal-4",
    brand_name: "Beats by Dre",
    amount: 2800,
    status: "negotiating" as const,
    deadline: format(addDays(today, 13), "yyyy-MM-dd"),
    deliverable_type: "YouTube Integration",
    ftc_compliant: null,
    notes: "Pre-game routine video. Rate being negotiated.",
  },
  {
    id: "deal-5",
    brand_name: "Celsius Energy",
    amount: 800,
    status: "paid" as const,
    deadline: format(subDays(today, 32), "yyyy-MM-dd"),
    deliverable_type: "Instagram Story",
    ftc_compliant: true,
    notes: "Completed. Used #ad in caption.",
  },
  {
    id: "deal-6",
    brand_name: "New Balance",
    amount: 4200,
    status: "signed" as const,
    deadline: format(addDays(today, 3), "yyyy-MM-dd"),
    deliverable_type: "Shoe Campaign",
    ftc_compliant: null,
    notes: "Court shoot in Austin. Deadline soon.",
  },
  {
    id: "deal-7",
    brand_name: "Body Armor",
    amount: null,
    status: "inquiry" as const,
    deadline: null,
    deliverable_type: "Twitter Post",
    ftc_compliant: null,
    notes: "Initial DM only. No rate discussed yet.",
  },
  {
    id: "deal-8",
    brand_name: "Amazon",
    amount: 950,
    status: "posted" as const,
    deadline: format(subDays(today, 4), "yyyy-MM-dd"),
    deliverable_type: "Product Review",
    ftc_compliant: false,
    notes: "Review posted, needs FTC tag update.",
  },
];

const mkDate = (monthsAgo: number, day: number) => {
  const d = subMonths(today, monthsAgo);
  d.setDate(day);
  return d.toISOString();
};

export const DEMO_PAYMENTS = [
  {
    id: "pay-1",
    deal_id: "deal-5",
    amount: 800,
    paid_at: mkDate(1, 15),
    notes: "Celsius – first campaign payment",
    deals: { brand_name: "Celsius Energy" },
  },
  {
    id: "pay-2",
    deal_id: "deal-1",
    amount: 1750,
    paid_at: mkDate(2, 3),
    notes: "Nike – deposit (50%)",
    deals: { brand_name: "Nike" },
  },
  {
    id: "pay-3",
    deal_id: "deal-4",
    amount: 1400,
    paid_at: mkDate(3, 20),
    notes: "Beats by Dre – retainer",
    deals: { brand_name: "Beats by Dre" },
  },
  {
    id: "pay-4",
    deal_id: "deal-6",
    amount: 2100,
    paid_at: mkDate(4, 8),
    notes: "New Balance – shoot day fee",
    deals: { brand_name: "New Balance" },
  },
  {
    id: "pay-5",
    deal_id: "deal-2",
    amount: 1200,
    paid_at: mkDate(5, 11),
    notes: "Gatorade – content fee",
    deals: { brand_name: "Gatorade" },
  },
  {
    id: "pay-6",
    deal_id: "deal-8",
    amount: 475,
    paid_at: mkDate(6, 27),
    notes: "Amazon – half on completion",
    deals: { brand_name: "Amazon" },
  },
];
