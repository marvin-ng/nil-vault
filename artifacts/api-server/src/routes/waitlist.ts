import { Router, type IRouter } from "express";
import { db, waitlistTable, insertWaitlistSchema } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/waitlist/count", async (req, res) => {
  try {
    const result = await db.select({ count: count() }).from(waitlistTable);
    res.status(200).json({ count: result[0]?.count ?? 0 });
  } catch (err) {
    req.log.error({ err }, "Waitlist count failed");
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/waitlist", async (req, res) => {
  const parsed = insertWaitlistSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  try {
    const existing = await db
      .select()
      .from(waitlistTable)
      .where(eq(waitlistTable.email, parsed.data.email))
      .limit(1);

    if (existing.length > 0) {
      res.status(200).json({ ok: true, alreadyJoined: true });
      return;
    }

    await db.insert(waitlistTable).values(parsed.data);
    req.log.info({ email: parsed.data.email }, "Waitlist signup");
    res.status(201).json({ ok: true, alreadyJoined: false });
  } catch (err) {
    req.log.error({ err }, "Waitlist insert failed");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
