import type { LayoutIntent, MediaItem } from "./layoutEngine";
import { make } from "./sampleContent";

export interface ScenarioState {
  label: string;
  prompt: string;        // what the user "said" to Russ
  intent: LayoutIntent;
  items: MediaItem[];
}

export interface Scenario {
  id: string;
  name: string;
  states: ScenarioState[];
}

// ----------------------------------------------------------------
// Cat Café Launch Kit — mirrors the demo flow
// ----------------------------------------------------------------
const catCafe: Scenario = {
  id: "cat-cafe",
  name: "Cat café launch",
  states: [
    {
      label: "Brainstorm — 3 concepts",
      prompt: "Help me make a tiny brand for a pop-up cat café.",
      intent: "concepts",
      items: [
        make.concept("Studio Whiskers", "A calm, designy café where adoptable cats lounge like little art critics.", "Calm"),
        make.concept("Saturday Nine Lives", "A weekend pop-up. Loud, colorful, fast — espresso, posters, kittens.", "Playful"),
        make.concept("Quiet Paws", "Tea-room slow. Library quiet. Cats as the whole point.", "Minimal"),
      ],
    },
    {
      label: "Brand board",
      prompt: "Use Studio Whiskers. Show me the vibe.",
      intent: "brandBoard",
      items: [
        make.palette("Calm warmth", ["#f7f1ea", "#e6d5c1", "#c98664", "#3a2e26", "#1a1614"]),
        make.typeSample("Söhne Breit", "Inter", "Soft mornings begin with a quiet purr."),
        make.quote("Friendly, unhurried, just a little literary."),
      ],
    },
    {
      label: "Three visual directions",
      prompt: "Make three visual directions.",
      intent: "directions",
      items: [
        make.image("linear-gradient(135deg, #f7f1ea 0%, #c98664 100%)"),
        make.image("linear-gradient(135deg, #3a2e26 0%, #c98664 100%)"),
        make.image("linear-gradient(135deg, #e6d5c1 0%, #1a1614 100%)"),
      ],
    },
    {
      label: "Hero — premium take",
      prompt: "Use the cozy one. Make it more premium.",
      intent: "hero",
      items: [
        make.image("linear-gradient(135deg, #1a1614 0%, #c98664 60%, #f7f1ea 100%)"),
        make.text("Studio Whiskers — a quiet café for cats and the people who notice them."),
      ],
    },
    {
      label: "Mascot variations",
      prompt: "Use this cat as the mascot.",
      intent: "mascotSet",
      items: [
        make.image("linear-gradient(135deg, #c98664 0%, #3a2e26 100%)"),
        make.image("linear-gradient(135deg, #e6d5c1 0%, #c98664 100%)"),
        make.image("linear-gradient(135deg, #1a1614 0%, #c98664 100%)"),
        make.image("linear-gradient(135deg, #f7f1ea 0%, #e6d5c1 100%)"),
      ],
    },
    {
      label: "Storyboard",
      prompt: "Make a 15-second ad storyboard.",
      intent: "storyboard",
      items: [
        make.storyFrame(1, "Door opens. Morning light.", "linear-gradient(135deg, #f7f1ea 0%, #e6d5c1 100%)"),
        make.storyFrame(2, "Latte pour, close on crema.", "linear-gradient(135deg, #e6d5c1 0%, #c98664 100%)"),
        make.storyFrame(3, "Cat blinks slowly at camera.", "linear-gradient(135deg, #c98664 0%, #3a2e26 100%)"),
        make.storyFrame(4, "Quiet adoption moment.", "linear-gradient(135deg, #3a2e26 0%, #1a1614 100%)"),
        make.storyFrame(5, "Logo end card.", "linear-gradient(135deg, #1a1614 0%, #c98664 100%)"),
      ],
    },
    {
      label: "Video — ad",
      prompt: "Make the ad.",
      intent: "mediaPlayer",
      items: [
        make.video("Studio Whiskers — 15s spot", "0:15"),
        make.text("Final cut. Soft jazz over. Cat blinks. Logo."),
      ],
    },
    {
      label: "Music bed",
      prompt: "Add soft jazzy music.",
      intent: "mediaPlayer",
      items: [
        make.audio("Late café (soft jazz)", "Russ AI", "1:42"),
      ],
    },
    {
      label: "Launch kit — presentation",
      prompt: "Show me the whole launch kit.",
      intent: "presentationKit",
      items: [
        make.section("Brand"),
        make.palette("Calm warmth", ["#f7f1ea", "#e6d5c1", "#c98664", "#3a2e26", "#1a1614"]),
        make.section("Mascot"),
        make.image("linear-gradient(135deg, #c98664 0%, #3a2e26 100%)"),
        make.section("Posters"),
        make.image("linear-gradient(135deg, #1a1614 0%, #c98664 100%)"),
        make.section("Ad"),
        make.video("Studio Whiskers — 15s spot", "0:15"),
        make.section("Music"),
        make.audio("Late café (soft jazz)", "Russ AI", "1:42"),
        make.section("Captions"),
        make.quote("Soft mornings begin with a quiet purr."),
      ],
    },
    {
      label: "Calendar — open slots",
      prompt: "Find time tomorrow afternoon to show this to my boss.",
      intent: "calendar",
      items: [
        make.slot("Tomorrow", "1:30 PM"),
        make.slot("Tomorrow", "2:00 PM"),
        make.slot("Tomorrow", "3:00 PM"),
        make.slot("Tomorrow", "4:30 PM"),
      ],
    },
    {
      label: "Invite booked",
      prompt: "Book the 3 PM slot.",
      intent: "confirmation",
      items: [
        {
          id: "invite-1", type: "calendarSlot", content: "3:00 PM",
          meta: { day: "Tomorrow", duration: "30 min", status: "booked", title: "Cat café concept review", with: "Boss" },
        },
      ],
    },
    {
      label: "Email sent",
      prompt: "Send my boss the concept and meeting note.",
      intent: "confirmation",
      items: [
        make.email(
          "boss@studio.com",
          "Cat café concept + Wed 3pm",
          "Hi — quick share of the Studio Whiskers concept and a 30-min hold tomorrow at 3 PM to walk you through it. Brand board, mascot, storyboard, and 15s spot attached.",
        ),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Bonus scenario: travel itinerary (different shape, reuses surfaces)
// ----------------------------------------------------------------
const travel: Scenario = {
  id: "travel",
  name: "Weekend in Lisbon",
  states: [
    {
      label: "Three trip concepts",
      prompt: "Plan a weekend in Lisbon.",
      intent: "concepts",
      items: [
        make.concept("Slow & seafood", "Miradouros at sunset, long lunches in Alfama, one museum.", "Calm"),
        make.concept("Music weekend", "Fado night, vinyl shops, Bairro Alto until late.", "Loud"),
        make.concept("Design crawl", "MAAT, Underdogs, ceramics studios, tiled façades.", "Visual"),
      ],
    },
    {
      label: "Flight options",
      prompt: "Find me a flight Friday morning.",
      intent: "moodboard",
      items: [
        make.flight("TP 204", "JFK", "LIS", "9:15 PM", "9:40 AM", "6h 25m", "TAP Air Portugal", "Fri Sep 12"),
        make.flight("UA 9742", "EWR", "LIS", "7:55 PM", "8:20 AM", "6h 25m", "United", "Fri Sep 12"),
      ],
    },
    {
      label: "Weather + base",
      prompt: "What's the weather, and where am I staying?",
      intent: "moodboard",
      items: [
        make.weather("Lisbon", "78°", "Sunny", 81, 64, "sun"),
        make.map("Memmo Alfama", "Lisbon, Portugal", "Travessa das Merceeiras 27"),
      ],
    },
    {
      label: "Open times tomorrow",
      prompt: "When can I book a tour?",
      intent: "calendar",
      items: [
        make.slot("Saturday", "10:00 AM", "2 hr"),
        make.slot("Saturday", "1:00 PM", "2 hr"),
        make.slot("Sunday", "11:00 AM", "3 hr"),
      ],
    },
    {
      label: "Itinerary",
      prompt: "Pull it all together.",
      intent: "presentationKit",
      items: [
        make.section("Saturday"),
        make.text("Pastéis de Belém → MAAT → sunset at Miradouro de Santa Catarina."),
        make.section("Sunday"),
        make.text("Time Out Market → tram 28 → Alfama wander → fado dinner."),
        make.section("Packing"),
        make.checklist("Don't forget", [
          { t: "Passport", d: true },
          { t: "Plug adapter", d: true },
          { t: "Light jacket (evenings)", d: false },
          { t: "Comfy shoes for hills", d: false },
        ]),
        make.section("Music"),
        make.audio("Fado playlist", "Russ AI", "42:10"),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Indie album launch
// ----------------------------------------------------------------
const album: Scenario = {
  id: "album",
  name: "Indie album launch",
  states: [
    {
      label: "Album name concepts",
      prompt: "I need a name for my next album.",
      intent: "concepts",
      items: [
        make.concept("Paper Moons", "Soft, nostalgic, late-night drives.", "Warm"),
        make.concept("Static Bloom", "Lo-fi shoegaze with bursts of color.", "Noisy"),
        make.concept("Hours Apart", "Long-distance love letters as songs.", "Tender"),
      ],
    },
    {
      label: "Cover art directions",
      prompt: "Three cover art directions for Paper Moons.",
      intent: "directions",
      items: [
        make.image("linear-gradient(135deg, #1b1033 0%, #ff7a59 100%)"),
        make.image("linear-gradient(135deg, #0f0f1a 0%, #f5e6c8 100%)"),
        make.image("linear-gradient(135deg, #2a1b4a 0%, #f48fb1 100%)"),
      ],
    },
    {
      label: "Tracklist preview",
      prompt: "Play the singles.",
      intent: "presentationKit",
      items: [
        make.section("Side A"),
        make.audio("01 — Paper Moons", "Nova Lane", "3:42"),
        make.audio("02 — Hallway Light", "Nova Lane", "2:58"),
        make.section("Side B"),
        make.audio("03 — Static Bloom", "Nova Lane", "4:11"),
        make.audio("04 — Hours Apart", "Nova Lane", "3:20"),
      ],
    },
    {
      label: "Release day held",
      prompt: "Book the release party.",
      intent: "confirmation",
      items: [
        {
          id: "release-1", type: "calendarSlot", content: "8:00 PM",
          meta: { day: "Fri Oct 18", duration: "3 hr", status: "booked", title: "Paper Moons release party", with: "Band + label" },
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Startup pitch
// ----------------------------------------------------------------
const pitch: Scenario = {
  id: "pitch",
  name: "Seed pitch deck",
  states: [
    {
      label: "Positioning angles",
      prompt: "Help me pitch my startup, Loop.",
      intent: "concepts",
      items: [
        make.concept("Linear for ops", "Keyboard-first workflow tool for operators.", "Productivity"),
        make.concept("Slack you don't hate", "Async by default, quiet by design.", "Comms"),
        make.concept("The work OS for tiny teams", "One surface for tasks, docs, and decisions.", "Platform"),
      ],
    },
    {
      label: "Brand board",
      prompt: "Make a brand board for Loop.",
      intent: "brandBoard",
      items: [
        make.palette("Cool focus", ["#f4f6fb", "#dde3f0", "#5b6cff", "#1a1f3a", "#0a0d1f"]),
        make.typeSample("GT Walsheim", "Inter", "Ship the work, skip the meeting."),
        make.quote("Calm, opinionated, fast."),
      ],
    },
    {
      label: "Traction snapshot",
      prompt: "Show the traction numbers.",
      intent: "moodboard",
      items: [
        make.metric("$14k", "MRR", "+38% WoW", true, "9 weeks since launch"),
        make.metric("420", "Active teams", "+72", true, "vs. last week"),
        make.chart("Weekly signups", [
          { l: "W1", v: 18 }, { l: "W2", v: 27 }, { l: "W3", v: 35 },
          { l: "W4", v: 44 }, { l: "W5", v: 52 }, { l: "W6", v: 61 },
          { l: "W7", v: 70 }, { l: "W8", v: 78 }, { l: "W9", v: 92 },
        ]),
      ],
    },
    {
      label: "Deck — investor view",
      prompt: "Compile the seed deck.",
      intent: "presentationKit",
      items: [
        make.section("Problem"),
        make.text("Operators run 11 tabs. Context lives nowhere. Decisions get lost."),
        make.section("Solution"),
        make.text("Loop is one surface for tasks, docs, and decisions — keyboard-first."),
        make.section("Traction"),
        make.metric("$14k", "MRR", "+38% WoW", true, "9 weeks since launch"),
        make.chart("Weekly signups", [
          { l: "W1", v: 18 }, { l: "W2", v: 27 }, { l: "W3", v: 35 },
          { l: "W4", v: 44 }, { l: "W5", v: 52 }, { l: "W6", v: 61 },
          { l: "W7", v: 70 }, { l: "W8", v: 78 }, { l: "W9", v: 92 },
        ]),
        make.section("Ask"),
        make.text("$2.5M seed. 18 months runway. Hire 4 engineers + design."),
      ],
    },
    {
      label: "Investor times",
      prompt: "When can I meet Sequoia this week?",
      intent: "calendar",
      items: [
        make.slot("Wed", "11:00 AM", "30 min"),
        make.slot("Wed", "2:30 PM", "30 min"),
        make.slot("Thu", "9:30 AM", "30 min"),
        make.slot("Fri", "4:00 PM", "30 min"),
      ],
    },
    {
      label: "Intro email sent",
      prompt: "Send the intro.",
      intent: "confirmation",
      items: [
        make.email(
          "partner@sequoiacap.com",
          "Loop — seed round, 9 weeks in",
          "Hi — quick intro to Loop. We're a keyboard-first work OS for tiny teams. 420 teams, $14k MRR, growing 38% WoW. Deck attached. Free Thu 9:30 if you want to chat.",
        ),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Wedding planning
// ----------------------------------------------------------------
const wedding: Scenario = {
  id: "wedding",
  name: "Wedding planning",
  states: [
    {
      label: "Three vibes",
      prompt: "Help me plan our wedding. Outdoor, ~80 people.",
      intent: "concepts",
      items: [
        make.concept("Garden long-table", "Olive trees, linen, candles, one long table.", "Romantic"),
        make.concept("Coastal & barefoot", "Sand, white cotton, sunset ceremony.", "Easy"),
        make.concept("Mountain cabin", "Pine, wool, fireplace, fairy lights.", "Cozy"),
      ],
    },
    {
      label: "Palette & type",
      prompt: "Lock the garden look.",
      intent: "brandBoard",
      items: [
        make.palette("Olive grove", ["#f5f1e8", "#e0d9c4", "#a8a47a", "#7a8c5c", "#2e3a25"]),
        make.typeSample("Canela Deck", "Söhne", "We'd love to have you there."),
        make.quote("Warm, slow, full of friends."),
      ],
    },
    {
      label: "Venue options",
      prompt: "Three venues that fit 80.",
      intent: "directions",
      items: [
        make.image("linear-gradient(135deg, #f5f1e8 0%, #7a8c5c 100%)"),
        make.image("linear-gradient(135deg, #e0d9c4 0%, #2e3a25 100%)"),
        make.image("linear-gradient(135deg, #a8a47a 0%, #f5f1e8 100%)"),
      ],
    },
    {
      label: "Day-of timeline",
      prompt: "Show the day-of plan.",
      intent: "storyboard",
      items: [
        make.storyFrame(1, "4:30 — Guests arrive.", "linear-gradient(135deg, #f5f1e8 0%, #e0d9c4 100%)"),
        make.storyFrame(2, "5:00 — Ceremony under olives.", "linear-gradient(135deg, #e0d9c4 0%, #a8a47a 100%)"),
        make.storyFrame(3, "6:00 — Cocktails on terrace.", "linear-gradient(135deg, #a8a47a 0%, #7a8c5c 100%)"),
        make.storyFrame(4, "7:30 — Long-table dinner.", "linear-gradient(135deg, #7a8c5c 0%, #2e3a25 100%)"),
        make.storyFrame(5, "10:00 — Dance floor opens.", "linear-gradient(135deg, #2e3a25 0%, #7a8c5c 100%)"),
      ],
    },
    {
      label: "Save-the-date sent",
      prompt: "Send save-the-dates.",
      intent: "confirmation",
      items: [
        make.email(
          "friends@list.com",
          "Save the date — Sam & Theo, June 14",
          "We're getting married! Saturday, June 14, garden ceremony just outside town. Formal invite to follow. Block the day — bring sunglasses.",
        ),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Customer support thread
// ----------------------------------------------------------------
const support: Scenario = {
  id: "support",
  name: "Refund request",
  states: [
    {
      label: "Customer note",
      prompt: "Pull up the customer's request.",
      intent: "confirmation",
      items: [
        make.email(
          "maya@example.com",
          "Order #4821 arrived broken",
          "Hi — my order #4821 arrived broken. I'd prefer a refund over a replacement if possible. Thanks.",
        ),
      ],
    },
    {
      label: "Three response drafts",
      prompt: "Draft my reply, three tones.",
      intent: "concepts",
      items: [
        make.concept("Warm & human", "Apologize, refund instantly, throw in a discount on next order.", "Friendly"),
        make.concept("Crisp & efficient", "Confirm refund, share timeline, close the loop.", "Direct"),
        make.concept("Premium & personal", "Hand-written tone, refund + replacement offered as a gift.", "VIP"),
      ],
    },
    {
      label: "Refund issued",
      prompt: "Send the warm reply and refund.",
      intent: "confirmation",
      items: [
        make.email(
          "maya@example.com",
          "Refund processed — order #4821",
          "Hi Maya — really sorry your order arrived broken. I just refunded $84.00 to your card (3-5 business days). I also added a 20% off code for next time: SORRYMAYA. Thanks for the patience.",
        ),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Recipe night
// ----------------------------------------------------------------
const recipe: Scenario = {
  id: "recipe",
  name: "Dinner party menu",
  states: [
    {
      label: "Three menu ideas",
      prompt: "Dinner for 6 friends, Saturday.",
      intent: "concepts",
      items: [
        make.concept("Italian summer", "Burrata, lemon pasta, tiramisu.", "Comfort"),
        make.concept("Spanish small plates", "Pan con tomate, gambas, flan.", "Social"),
        make.concept("Japanese izakaya", "Edamame, karaage, miso cod.", "Light"),
      ],
    },
    {
      label: "Italian — courses",
      prompt: "Do the Italian one.",
      intent: "storyboard",
      items: [
        make.storyFrame(1, "Burrata, peaches, basil.", "linear-gradient(135deg, #fff5e6 0%, #f9c784 100%)"),
        make.storyFrame(2, "Lemon spaghetti, parm.", "linear-gradient(135deg, #fef9d7 0%, #c8e870 100%)"),
        make.storyFrame(3, "Roast chicken, herbs.", "linear-gradient(135deg, #f9c784 0%, #c44d3a 100%)"),
        make.storyFrame(4, "Tiramisu, espresso.", "linear-gradient(135deg, #6b4423 0%, #f5e6c8 100%)"),
      ],
    },
    {
      label: "Shopping kit",
      prompt: "What do I need to buy?",
      intent: "presentationKit",
      items: [
        make.section("Produce"),
        make.text("2 lemons · 4 peaches · basil · arugula · 1 head garlic"),
        make.section("Dairy"),
        make.text("2 balls burrata · parmesan wedge · mascarpone · heavy cream"),
        make.section("Pantry"),
        make.text("500g spaghetti · ladyfingers · espresso · cocoa · olive oil"),
        make.section("Protein"),
        make.text("1 whole chicken (~1.8kg)"),
      ],
    },
    {
      label: "Invite sent",
      prompt: "Tell everyone 7pm Saturday.",
      intent: "confirmation",
      items: [
        make.email(
          "friends@dinner.com",
          "Saturday dinner — 7pm at mine",
          "Cooking Italian this Saturday at 7. Burrata, lemon pasta, roast chicken, tiramisu. Bring wine if you feel like it. Let me know if anything's off-limits.",
        ),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Morning briefing — daily standup with AI
// ----------------------------------------------------------------
const briefing: Scenario = {
  id: "briefing",
  name: "Morning briefing",
  states: [
    {
      label: "Good morning",
      prompt: "What's my morning look like?",
      intent: "confirmation",
      items: [
        make.weather("San Francisco", "62°", "Foggy, clearing by noon", 71, 56, "cloud-sun"),
      ],
    },
    {
      label: "Markets",
      prompt: "How are the markets?",
      intent: "moodboard",
      items: [
        make.stock("AAPL", "Apple Inc.", "212.48", "+2.14", "+1.02%", true, [10,12,11,14,13,16,15,18,17,20,22,21,24]),
        make.stock("NVDA", "NVIDIA", "1184.20", "+38.40", "+3.35%", true, [40,42,45,44,48,52,56,60,64,68,72,78,84]),
        make.stock("TSLA", "Tesla", "178.92", "-4.18", "-2.28%", false, [30,28,29,26,27,24,25,22,23,20,21,19,18]),
      ],
    },
    {
      label: "Today's focus",
      prompt: "What should I focus on?",
      intent: "confirmation",
      items: [
        make.checklist("Today", [
          { t: "Ship onboarding redesign", d: false },
          { t: "Review Q3 roadmap", d: false },
          { t: "1:1 with Priya", d: true },
          { t: "Reply to investor email", d: false },
        ]),
      ],
    },
    {
      label: "Top read",
      prompt: "What should I read?",
      intent: "confirmation",
      items: [
        make.link(
          "How small teams ship faster than big ones",
          "stratechery.com",
          "A long read on org design, async work, and why 6-person teams keep outpacing 60-person ones.",
          "https://stratechery.com/2026/small-teams",
          "linear-gradient(135deg, #f59e0b 0%, #ef4444 60%, #7c3aed 100%)",
        ),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Launch dashboard — post-launch metrics review
// ----------------------------------------------------------------
const launchDash: Scenario = {
  id: "launch-dash",
  name: "Launch dashboard",
  states: [
    {
      label: "Top-line metrics",
      prompt: "How did launch day go?",
      intent: "moodboard",
      items: [
        make.metric("$42.8k", "Day-1 revenue", "+18.2%", true, "vs. forecast"),
        make.metric("1,284", "New signups", "+312", true, "best day ever"),
        make.metric("3.4%", "Activation rate", "-0.6%", false, "watch onboarding"),
      ],
    },
    {
      label: "Signups by hour",
      prompt: "Show me the signup curve.",
      intent: "confirmation",
      items: [
        make.chart("Signups by hour", [
          { l: "6a", v: 12 }, { l: "8a", v: 34 }, { l: "10a", v: 68 },
          { l: "12p", v: 92 }, { l: "2p", v: 78 }, { l: "4p", v: 64 },
          { l: "6p", v: 88 }, { l: "8p", v: 110 }, { l: "10p", v: 72 },
        ]),
      ],
    },
    {
      label: "Team poll",
      prompt: "What should we tackle first this week?",
      intent: "confirmation",
      items: [
        make.poll("What should we tackle first?", [
          { l: "Fix onboarding drop-off", v: 64 },
          { l: "Ship referral program", v: 22 },
          { l: "Write launch retro", v: 14 },
        ]),
      ],
    },
    {
      label: "Follow-up checklist",
      prompt: "Make a punch list for tomorrow.",
      intent: "confirmation",
      items: [
        make.checklist("Tomorrow's punch list", [
          { t: "Patch signup form validation bug", d: false },
          { t: "Send press follow-ups", d: false },
          { t: "Draft thank-you email to beta users", d: false },
          { t: "Schedule retro for Friday", d: false },
        ]),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Dev review — code, tests, ship
// ----------------------------------------------------------------
const devReview: Scenario = {
  id: "dev-review",
  name: "Code review",
  states: [
    {
      label: "Three approaches",
      prompt: "How should I memoize this expensive selector?",
      intent: "concepts",
      items: [
        make.concept("useMemo", "Inline, cheapest. Tied to the component.", "Local"),
        make.concept("Reselect", "Shared selector cache across components.", "Shared"),
        make.concept("React Query select", "Already in cache — derive at read time.", "Server"),
      ],
    },
    {
      label: "Suggested patch",
      prompt: "Show me the diff.",
      intent: "confirmation",
      items: [
        make.code(
          "import { createSelector } from 'reselect';\n\nexport const selectActiveItems = createSelector(\n  [(s) => s.items, (s) => s.filter],\n  (items, filter) => items.filter(i => i.tag === filter),\n);",
          "typescript",
          "selectors.ts",
        ),
      ],
    },
    {
      label: "Test coverage",
      prompt: "How's coverage trending?",
      intent: "moodboard",
      items: [
        make.metric("87.4%", "Line coverage", "+2.1%", true, "vs. last week"),
        make.chart("Coverage by package", [
          { l: "ui", v: 92 }, { l: "core", v: 88 }, { l: "api", v: 81 },
          { l: "db", v: 76 }, { l: "cli", v: 64 },
        ]),
      ],
    },
    {
      label: "Ship checklist",
      prompt: "What's left before merge?",
      intent: "confirmation",
      items: [
        make.checklist("Pre-merge", [
          { t: "All tests passing", d: true },
          { t: "Coverage threshold hit", d: true },
          { t: "Reviewed by @priya", d: false },
          { t: "Changelog entry", d: false },
        ]),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// Shopping concierge — gift hunt
// ----------------------------------------------------------------
const shopping: Scenario = {
  id: "shopping",
  name: "Gift hunt",
  states: [
    {
      label: "Three gift directions",
      prompt: "Help me find a birthday gift for my sister. She loves cozy stuff.",
      intent: "concepts",
      items: [
        make.concept("Snug at home", "Throw blanket, candle, slippers — full nesting kit.", "Cozy"),
        make.concept("Slow weekends", "Cookbook, ceramic mug, loose-leaf tea sampler.", "Quiet"),
        make.concept("Reading nook", "Hardcover novel, reading light, bookmark set.", "Bookish"),
      ],
    },
    {
      label: "Picks",
      prompt: "Show me actual things to buy.",
      intent: "moodboard",
      items: [
        make.product("Linen Throw Blanket", "Hearth & Loom", "$148", 4.7),
        make.product("Hand-thrown Mug", "Lostine", "$42", 4.9),
        make.product("Cedar Candle", "P.F. Candle Co.", "$28", 4.8),
        make.product("Wool Slippers", "Glerups", "$95", 4.6),
      ],
    },
    {
      label: "Quick poll",
      prompt: "Ask Mom which one she'd pick.",
      intent: "confirmation",
      items: [
        make.poll("Which would she love most?", [
          { l: "Throw blanket", v: 52 },
          { l: "Mug + tea", v: 28 },
          { l: "Candle", v: 12 },
          { l: "Slippers", v: 8 },
        ]),
      ],
    },
    {
      label: "Order placed",
      prompt: "Order the blanket, ship to Mom's.",
      intent: "confirmation",
      items: [
        make.email(
          "you@inbox.com",
          "Order confirmed — Linen Throw Blanket",
          "Order #C-9421 confirmed. $148.00 + free shipping. Arriving Tue Jun 18 to Mom's address. Gift-wrapped with the note: 'Happy birthday, Sis. Stay cozy.'",
        ),
      ],
    },
  ],
};

// ================================================================
// VIDEO CREATION WORKFLOW SCENARIOS
// ================================================================

const G = {
  warm: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 60%, #b45309 100%)",
  cool: "linear-gradient(135deg, #dbeafe 0%, #3b82f6 60%, #1e3a8a 100%)",
  noir: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
  sunset: "linear-gradient(135deg, #fb923c 0%, #ec4899 50%, #8b5cf6 100%)",
  ocean: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
  forest: "linear-gradient(135deg, #84cc16 0%, #166534 100%)",
  mint: "linear-gradient(135deg, #a7f3d0 0%, #10b981 100%)",
  rose: "linear-gradient(135deg, #fecdd3 0%, #e11d48 100%)",
  cream: "linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)",
  steel: "linear-gradient(135deg, #cbd5e1 0%, #475569 100%)",
};

// ----------------------------------------------------------------
// 1. TikTok UGC reel — sneaker brand
// ----------------------------------------------------------------
const tiktokReel: Scenario = {
  id: "tiktok-reel",
  name: "TikTok UGC reel",
  states: [
    {
      label: "Three hook concepts",
      prompt: "Make me a TikTok for the new runner drop.",
      intent: "concepts",
      items: [
        make.concept("POV unboxing", "First-person, no face. Box reveal → close-ups → first run.", "POV"),
        make.concept("Get ready with me", "Lace up, fit check, mirror shot, walk out.", "GRWM"),
        make.concept("Street test", "Friend hands the shoe over. Cut to running.", "Trend"),
      ],
    },
    {
      label: "VO script — POV unboxing",
      prompt: "Use the POV one. Write the voiceover.",
      intent: "document",
      items: [
        make.script("POV unboxing — 18s", "Hands-only. Box on desk.\nVoice: Okay, the drop everyone's been waiting on.\nLid lifts. Tissue pulls back.\nVoice: Foam's heavier than I expected.\nLace pull, side profile.\nVoice: But the upper? Unreal.\nCut to feet, first step outside.\nVoice: Run incoming.", "0:18"),
      ],
    },
    {
      label: "Shot list",
      prompt: "Break it into shots.",
      intent: "confirmation",
      items: [
        make.shotList("POV unboxing — 18s", [
          { n: 1, t: "Wide — box on desk, soft window light" },
          { n: 2, t: "ECU — lid lifting, tissue rustle" },
          { n: 3, t: "Top-down — shoe in box, hero beat" },
          { n: 4, t: "Macro — lace pull, foam squeeze" },
          { n: 5, t: "Outdoor — first step, slow-mo" },
          { n: 6, t: "Logo end card, 1s" },
        ]),
      ],
    },
    {
      label: "Three reel cuts",
      prompt: "Show me three edits.",
      intent: "reelStack",
      items: [
        make.reel("POV: the drop finally landed 👟", "284K", "0:18", G.sunset),
        make.reel("rate the unboxing 1-10", "112K", "0:21", G.warm),
        make.reel("foam check incoming", "67K", "0:15", G.noir),
      ],
    },
    {
      label: "Caption + hashtags",
      prompt: "Write the caption.",
      intent: "confirmation",
      items: [
        make.caption("the drop finally landed. foam check at 0:14, first run at 0:16. who's copping?", ["sneakertok", "unboxing", "runner", "fyp", "newdrop"]),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 2. YouTube Short — creator title strategy
// ----------------------------------------------------------------
const youtubeShort: Scenario = {
  id: "youtube-short",
  name: "YouTube Short",
  states: [
    {
      label: "Three hook angles",
      prompt: "I built a desk in a weekend. Make it a short.",
      intent: "concepts",
      items: [
        make.concept("Before / after", "Empty room → finished desk. Speed-ramp the middle.", "Reveal"),
        make.concept("Mistake reel", "Open with the cut that went wrong. Then save it.", "Tension"),
        make.concept("Tool of the day", "One tool drives the whole edit. Track saw hero.", "Niche"),
      ],
    },
    {
      label: "Thumbnail options",
      prompt: "Make three thumbnails.",
      intent: "directions",
      items: [
        make.thumbnail("I BUILT THIS IN 48 HRS", "NEW", G.warm),
        make.thumbnail("$87 DESK CHALLENGE", "WOW", G.cool),
        make.thumbnail("DON'T MAKE THIS CUT", "FAIL", G.rose),
      ],
    },
    {
      label: "Subtitle styling",
      prompt: "Show me the burned-in caption style.",
      intent: "confirmation",
      items: [
        make.subtitleStrip("this is where it almost went wrong", "VO", "00:14"),
      ],
    },
    {
      label: "Final reel",
      prompt: "Render the short.",
      intent: "mediaPlayer",
      items: [
        make.video("48hr Desk Build — Short", "0:58"),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 3. Instagram ad — DTC skincare
// ----------------------------------------------------------------
const instagramAd: Scenario = {
  id: "instagram-ad",
  name: "Instagram ad set",
  states: [
    {
      label: "Three angles",
      prompt: "I need ad creative for the new serum. Three angles.",
      intent: "concepts",
      items: [
        make.concept("Founder story", "30s talking head. Why I made this.", "Trust"),
        make.concept("Before / after", "7-day glow time-lapse. Receipts.", "Proof"),
        make.concept("Ingredient hero", "Macro shots of the bottle + the molecule.", "Premium"),
      ],
    },
    {
      label: "Static ad variants",
      prompt: "Show me three static ads we can A/B.",
      intent: "adVariants",
      items: [
        make.adVariant("Skin that actually shows up.", "Try it free", "Meta", G.cream),
        make.adVariant("7 days. Real glow.", "See results", "Meta", G.rose),
        make.adVariant("One ingredient. No fluff.", "Shop now", "Meta", G.mint),
      ],
    },
    {
      label: "Reel — 9:16",
      prompt: "Now make the reel cut.",
      intent: "reelStack",
      items: [
        make.reel("the founder's 30s pitch ✨", "48K", "0:32", G.cream),
        make.reel("7 days of glow — receipts", "94K", "0:28", G.rose),
        make.reel("one drop. that's it.", "22K", "0:18", G.mint),
      ],
    },
    {
      label: "Launch-day metrics",
      prompt: "How are they performing?",
      intent: "moodboard",
      items: [
        make.metric("$18.4k", "Ad spend", "+$2.1k", true, "today"),
        make.metric("3.8x", "ROAS", "+0.6x", true, "vs. yesterday"),
        make.metric("2.1%", "CTR", "+0.4%", true, "best variant: Glow"),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 4. Product launch trailer — gadget
// ----------------------------------------------------------------
const productLaunch: Scenario = {
  id: "product-launch",
  name: "Product launch film",
  states: [
    {
      label: "Tone directions",
      prompt: "We're launching the new earbuds. 60s trailer.",
      intent: "concepts",
      items: [
        make.concept("Quiet & cinematic", "Black, slow push-ins, one sound bed.", "Premium"),
        make.concept("Fast & bold", "Cuts on the beat, color flashes, big type.", "Energetic"),
        make.concept("Documentary", "Hands-on with the engineers. Voices, lab shots.", "Honest"),
      ],
    },
    {
      label: "Storyboard — 6 frames",
      prompt: "Build the storyboard for the cinematic one.",
      intent: "storyboard",
      items: [
        make.storyFrame(1, "Black. Cue tone.", G.noir),
        make.storyFrame(2, "Buds rotate, single light.", "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)"),
        make.storyFrame(3, "Logo etch reveals.", "linear-gradient(135deg, #0f172a 0%, #1e40af 100%)"),
        make.storyFrame(4, "User. Eyes close. Sound enters.", G.cool),
        make.storyFrame(5, "City fades. Quiet.", "linear-gradient(135deg, #1e3a8a 0%, #000 100%)"),
        make.storyFrame(6, "Logo. Tagline. Out.", G.noir),
      ],
    },
    {
      label: "Edit timeline",
      prompt: "Open the timeline.",
      intent: "editTimeline",
      items: [
        make.timeline([
          { name: "V1", color: "#3b82f6", clips: [{ s: 0, e: 0.12 }, { s: 0.14, e: 0.28 }, { s: 0.3, e: 0.48 }, { s: 0.5, e: 0.7 }, { s: 0.72, e: 0.9 }, { s: 0.92, e: 1 }] },
          { name: "V2", color: "#a78bfa", clips: [{ s: 0.4, e: 0.55 }, { s: 0.78, e: 0.88 }] },
          { name: "A1", color: "#10b981", clips: [{ s: 0, e: 1 }] },
          { name: "A2", color: "#f59e0b", clips: [{ s: 0.1, e: 0.95 }] },
          { name: "SFX", color: "#ef4444", clips: [{ s: 0.02, e: 0.06 }, { s: 0.46, e: 0.5 }, { s: 0.96, e: 1 }] },
        ]),
        make.video("Earbuds — 60s trailer (rough)", "1:00"),
      ],
    },
    {
      label: "Launch kit",
      prompt: "Compile the launch kit.",
      intent: "presentationKit",
      items: [
        make.section("Trailer"),
        make.video("Earbuds — 60s trailer", "1:00"),
        make.section("Thumbnails"),
        make.thumbnail("THE QUIETEST EARBUDS YET", "NEW", G.noir),
        make.section("Static ads"),
        make.adVariant("Hear less. Feel more.", "Pre-order", "Meta", G.noir),
        make.section("Caption"),
        make.caption("Hear less. Feel more. Pre-orders open at noon ET.", ["audio", "launch", "design"]),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 5. Real estate listing reel
// ----------------------------------------------------------------
const realEstateReel: Scenario = {
  id: "real-estate-reel",
  name: "Real estate listing reel",
  states: [
    {
      label: "Cover thumbnails",
      prompt: "New 3BR listing on Elm. Make a reel.",
      intent: "directions",
      items: [
        make.thumbnail("JUST LISTED — 142 ELM", "HOT", G.warm),
        make.thumbnail("$1.2M · MUST SEE", "OPEN", G.cool),
        make.thumbnail("INSIDE A $1.2M HOME", "TOUR", G.cream),
      ],
    },
    {
      label: "Walk-through shots",
      prompt: "Plan the walk-through.",
      intent: "confirmation",
      items: [
        make.shotList("142 Elm — walk-through", [
          { n: 1, t: "Drone — pull up to driveway" },
          { n: 2, t: "Front door push-in, gimbal" },
          { n: 3, t: "Foyer pan to living room" },
          { n: 4, t: "Kitchen counter slide" },
          { n: 5, t: "Primary bedroom reveal" },
          { n: 6, t: "Backyard pull-out, drone up" },
        ]),
      ],
    },
    {
      label: "Three reel cuts",
      prompt: "Three versions, different vibes.",
      intent: "reelStack",
      items: [
        make.reel("inside the $1.2M elm street listing 🏡", "182K", "0:34", G.warm),
        make.reel("the kitchen is unreal", "98K", "0:22", G.cream),
        make.reel("open house Saturday — come thru", "44K", "0:28", G.ocean),
      ],
    },
    {
      label: "Open house booked",
      prompt: "Schedule the open house.",
      intent: "confirmation",
      items: [
        {
          id: "oh-1", type: "calendarSlot", content: "11:00 AM",
          meta: { day: "Saturday", duration: "3 hr", status: "booked", title: "Open house — 142 Elm", with: "Buyers + agents" },
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 6. Recipe reel — cooking shortform
// ----------------------------------------------------------------
const recipeReel: Scenario = {
  id: "recipe-reel",
  name: "Recipe reel",
  states: [
    {
      label: "Three formats",
      prompt: "Crispy gnocchi recipe. Make it a reel.",
      intent: "concepts",
      items: [
        make.concept("ASMR no-talking", "Sizzles, pours, scrape. Burned subs.", "Sensory"),
        make.concept("Talking-head fast", "Looking at camera, fast cuts on action.", "Personality"),
        make.concept("Top-down only", "Overhead lock-off. Hands enter frame.", "Clean"),
      ],
    },
    {
      label: "Burned-in captions",
      prompt: "Show the subtitle style.",
      intent: "confirmation",
      items: [
        make.subtitleStrip("get the pan SCREAMING hot", "Chef", "00:06"),
      ],
    },
    {
      label: "B-roll gallery",
      prompt: "What b-roll do I need?",
      intent: "confirmation",
      items: [
        make.gallery("B-roll — gnocchi reel", [G.cream, G.warm, G.forest, G.cream, G.warm, G.rose]),
      ],
    },
    {
      label: "Three cuts",
      prompt: "Three reel cuts to A/B.",
      intent: "reelStack",
      items: [
        make.reel("crispy gnocchi in 60s 🧈", "412K", "0:58", G.cream),
        make.reel("you've been cooking gnocchi wrong", "228K", "0:42", G.warm),
        make.reel("the only recipe i make on tuesdays", "78K", "0:36", G.forest),
      ],
    },
    {
      label: "Caption",
      prompt: "Caption it.",
      intent: "confirmation",
      items: [
        make.caption("crispy edges, pillow centers. brown butter + sage. don't skip the lemon.", ["recipe", "30minmeals", "foodtok", "italian"]),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 7. Gym coach UGC
// ----------------------------------------------------------------
const gymCoach: Scenario = {
  id: "gym-coach",
  name: "Gym coach UGC",
  states: [
    {
      label: "Three series ideas",
      prompt: "Help me grow my coaching account.",
      intent: "concepts",
      items: [
        make.concept("Form fix Fridays", "Critique a trending lift. Slow-mo + draw-overs.", "Educational"),
        make.concept("60-sec workouts", "Pure follow-along. No talking, just timer.", "Useful"),
        make.concept("Myth-buster", "Quote → wrong → here's why.", "Punchy"),
      ],
    },
    {
      label: "Shot list — form fix",
      prompt: "Plan the form-fix episode.",
      intent: "confirmation",
      items: [
        make.shotList("Form fix — RDL", [
          { n: 1, t: "Hook clip — wrong form" },
          { n: 2, t: "Freeze frame + red arrow" },
          { n: 3, t: "Side angle, correct form" },
          { n: 4, t: "Slow-mo hip hinge close-up" },
          { n: 5, t: "Talking head — 3 cues" },
          { n: 6, t: "End card — try this set" },
        ]),
      ],
    },
    {
      label: "Three reel cuts",
      prompt: "Three versions.",
      intent: "reelStack",
      items: [
        make.reel("you're doing RDLs wrong (probably)", "612K", "0:54", G.forest),
        make.reel("the hip hinge that fixed my back", "208K", "0:48", G.mint),
        make.reel("3 cues. fix it today.", "94K", "0:38", G.steel),
      ],
    },
    {
      label: "Weekly metrics",
      prompt: "How's the channel doing?",
      intent: "moodboard",
      items: [
        make.metric("48.2k", "Followers", "+4.1k", true, "this week"),
        make.metric("2.1M", "Views (7d)", "+38%", true, "form fix hit"),
        make.metric("6.8%", "Engagement", "+1.2%", true, "above niche avg"),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 8. Podcast clip — finding the moment
// ----------------------------------------------------------------
const podcastClip: Scenario = {
  id: "podcast-clip",
  name: "Podcast clip",
  states: [
    {
      label: "Three viral moments",
      prompt: "Find me clip-worthy moments from episode 47.",
      intent: "concepts",
      items: [
        make.concept("The unfiltered take", "Guest disagrees, raises voice. 45s of fire.", "Spicy"),
        make.concept("Mind-changing stat", "One number reframes the whole topic.", "Curious"),
        make.concept("Personal story", "Guest opens up about their pivot.", "Human"),
      ],
    },
    {
      label: "Pulled transcript",
      prompt: "Pull the unfiltered take.",
      intent: "confirmation",
      items: [
        make.script("Clip — 47:12 to 47:58", "GUEST: No, that's the lie everyone tells.\nHOST: Wait, why?\nGUEST: Because if you actually did the math nobody would do it.\nHOST: Run the math then.\nGUEST: Fine. You're paying for status, not for the product.", "0:46"),
      ],
    },
    {
      label: "Burned-in caption styling",
      prompt: "How will the captions look?",
      intent: "confirmation",
      items: [
        make.subtitleStrip("you're paying for STATUS, not the product", "Guest", "47:38"),
      ],
    },
    {
      label: "Three clip cuts",
      prompt: "Three cuts for short-form.",
      intent: "reelStack",
      items: [
        make.reel("\"you're paying for STATUS\" 🔥", "1.2M", "0:46", G.noir),
        make.reel("the lie nobody talks about", "428K", "0:38", G.rose),
        make.reel("run the math — you won't like it", "184K", "0:42", G.cool),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 9. Travel montage
// ----------------------------------------------------------------
const travelMontage: Scenario = {
  id: "travel-montage",
  name: "Travel montage",
  states: [
    {
      label: "Three edit vibes",
      prompt: "Cut my Japan trip into a 60s reel.",
      intent: "concepts",
      items: [
        make.concept("Lo-fi slow", "Film grain, ambient bed, long holds.", "Mellow"),
        make.concept("Beat-cut", "Sharp cuts on every snare. Up-tempo.", "Hype"),
        make.concept("Diary voice", "Your VO over wides. Personal.", "Intimate"),
      ],
    },
    {
      label: "B-roll selects",
      prompt: "Show me the selects.",
      intent: "confirmation",
      items: [
        make.gallery("Japan — selects", [G.rose, G.cream, G.noir, G.warm, G.cool, G.forest, G.mint, G.sunset, G.ocean]),
      ],
    },
    {
      label: "Transitions plan",
      prompt: "What transitions are we using?",
      intent: "moodboard",
      items: [
        make.transition("Whip pan", "Train window", "Tokyo street", "6 frames"),
        make.transition("Match cut", "Bowl steam", "Bath steam", "1 frame"),
        make.transition("Light leak", "Shrine torii", "Mountain", "12 frames"),
      ],
    },
    {
      label: "Edit timeline",
      prompt: "Open the edit.",
      intent: "editTimeline",
      items: [
        make.timeline([
          { name: "V1", color: "#ec4899", clips: [{ s: 0, e: 0.08 }, { s: 0.1, e: 0.18 }, { s: 0.2, e: 0.32 }, { s: 0.34, e: 0.46 }, { s: 0.48, e: 0.6 }, { s: 0.62, e: 0.74 }, { s: 0.76, e: 0.88 }, { s: 0.9, e: 1 }] },
          { name: "V2", color: "#8b5cf6", clips: [{ s: 0.3, e: 0.4 }, { s: 0.7, e: 0.82 }] },
          { name: "A1", color: "#10b981", clips: [{ s: 0, e: 1 }] },
          { name: "SFX", color: "#f59e0b", clips: [{ s: 0.18, e: 0.22 }, { s: 0.46, e: 0.5 }, { s: 0.88, e: 0.92 }] },
        ]),
        make.video("Japan — 60s reel (v3)", "1:00"),
      ],
    },
    {
      label: "Final caption",
      prompt: "Caption it.",
      intent: "confirmation",
      items: [
        make.caption("14 days. 6 cities. one tape. saving every yen i didn't spend on coffee.", ["japan", "travelreel", "filmgrain", "memories"]),
      ],
    },
  ],
};

// ----------------------------------------------------------------
// 10. Event recap reel — conference
// ----------------------------------------------------------------
const eventRecap: Scenario = {
  id: "event-recap",
  name: "Event recap reel",
  states: [
    {
      label: "Three recap angles",
      prompt: "Cut a recap for the design summit.",
      intent: "concepts",
      items: [
        make.concept("Energy highlight", "Cheers, applause, big stage shots, fast.", "Hype"),
        make.concept("Talk teaser", "One quote per speaker. Documentary feel.", "Substance"),
        make.concept("Behind-the-scenes", "Setup, soundcheck, attendee laughs.", "Authentic"),
      ],
    },
    {
      label: "Best moments storyboard",
      prompt: "Storyboard the energy cut.",
      intent: "storyboard",
      items: [
        make.storyFrame(1, "Doors open. Crowd flows in.", G.sunset),
        make.storyFrame(2, "Stage lights up. Logo hits.", G.noir),
        make.storyFrame(3, "Keynote walks out — applause.", G.warm),
        make.storyFrame(4, "Attendees laughing in halls.", G.cream),
        make.storyFrame(5, "After-party. Confetti drop.", G.rose),
      ],
    },
    {
      label: "Photo gallery",
      prompt: "Show the photo selects.",
      intent: "confirmation",
      items: [
        make.gallery("Design Summit '26 — selects", [G.sunset, G.noir, G.warm, G.cream, G.rose, G.cool]),
      ],
    },
    {
      label: "Three cut lengths",
      prompt: "Cut at 15s, 30s, and 60s.",
      intent: "reelStack",
      items: [
        make.reel("Design Summit '26 in 15s ⚡", "84K", "0:15", G.sunset),
        make.reel("the 30-second tour", "162K", "0:30", G.warm),
        make.reel("Design Summit '26 — full recap", "246K", "1:00", G.noir),
      ],
    },
    {
      label: "Thank-you email",
      prompt: "Send the thank-you to attendees.",
      intent: "confirmation",
      items: [
        make.email(
          "attendees@designsummit.co",
          "thanks for an unreal weekend — recap inside",
          "What a weekend. 1,400 of you, 38 talks, one packed dance floor. We cut a 60s recap (link below) and dropped every keynote on YouTube. See you in '27.",
        ),
      ],
    },
  ],
};

export const scenarios: Scenario[] = [
  catCafe, travel, album, pitch, wedding, support, recipe,
  briefing, launchDash, devReview, shopping,
  // video creation workflows
  tiktokReel, youtubeShort, instagramAd, productLaunch, realEstateReel,
  recipeReel, gymCoach, podcastClip, travelMontage, eventRecap,
];
