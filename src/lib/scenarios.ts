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

export const scenarios: Scenario[] = [catCafe, travel];
