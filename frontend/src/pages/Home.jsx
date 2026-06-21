import Hero from "../components/Hero";
import Card from "../components/Card";

import heroFarm from "../assets/images/hero-farm.jpg";
import cardWheat from "../assets/images/card-wheat.jpg";
import cardIrrigation from "../assets/images/card-irrigation.jpg";
import cardJournal from "../assets/images/card-journal.jpg";

const PREVIEW_ENTRIES = [
  {
    tag: "Punjab · Wheat · Rabi 2025",
    title: "Switched to drip irrigation mid-season",
    description:
      "Reduced water use by 30% after a dry spell. Yield held steady, soil stayed workable through harvest.",
    image: cardIrrigation,
    imageAlt: "Irrigation system in a field",
  },
  {
    tag: "Maharashtra · Cotton · Kharif 2025",
    title: "Delayed sowing by two weeks",
    description:
      "Waited out an early monsoon false start. Avoided the seedling loss neighbors saw that year.",
    image: cardWheat,
    imageAlt: "Wheat field during season",
  },
  {
    tag: "Karnataka · Tomato · 2025",
    title: "Tried a new fertilizer mix",
    description:
      "Higher yield, but pest pressure increased. Noted for next season's planning.",
    image: cardJournal,
    imageAlt: "Farmer recording notes in a journal",
  },
];

export default function Home() {
  return (
    <div>
      <Hero
        imageSrc={heroFarm}
        imageAlt="A lush green farm field during daytime"
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-2">
              RECENT ENTRIES
            </p>
            <h2 className="font-display text-2xl font-medium text-(--color-ink)">
              Decisions from the community
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREVIEW_ENTRIES.map((entry) => (
            <Card
              key={entry.title}
              tag={entry.tag}
              title={entry.title}
              description={entry.description}
              imageSrc={entry.image}
              imageAlt={entry.imageAlt}
              actionLabel="Read entry"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
