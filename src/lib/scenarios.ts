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
        make.brand("Studio Whiskers", "Slow mornings, soft purrs.", "#c98664"),
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
        make.brand("Studio Whiskers", "Slow mornings, soft purrs.", "#c98664"),
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
        make.brand("Loop", "Quiet software for noisy teams.", "#5b6cff"),
        make.palette("Cool focus", ["#f4f6fb", "#dde3f0", "#5b6cff", "#1a1f3a", "#0a0d1f"]),
        make.typeSample("GT Walsheim", "Inter", "Ship the work, skip the meeting."),
        make.quote("Calm, opinionated, fast."),
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
        make.text("420 teams · 38% WoW active · $14k MRR in 9 weeks."),
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
        make.brand("Sam & Theo", "Saturday, June 14.", "#7a8c5c"),
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
      label: "Conversation so far",
      prompt: "Pull up the customer thread.",
      intent: "transcript",
      items: [
        make.chat("Maya (customer)", "Hi — my order #4821 arrived broken. Can I get a refund?", "9:02"),
        make.chat("Russ", "So sorry about that. I can see the order. Pulling up options now.", "9:02"),
        make.chat("Maya (customer)", "Thanks. I'd prefer a refund over a replacement.", "9:03"),
        make.chat("Russ", "Got it. Full refund of $84.00 to your original card. Want me to send it?", "9:03"),
        make.chat("Maya (customer)", "Yes please.", "9:04"),
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

export const scenarios: Scenario[] = [catCafe, travel, album, pitch, wedding, support, recipe];
