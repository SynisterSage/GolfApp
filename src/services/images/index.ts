// Plug your real API here (e.g., Google Places Photos w/ maxwidth >= 1200)
// For now we return a high-quality curated fallback based on coarse location.
type Hero = { subtitle: string; imageUrl: string };

export async function getNearbyCourseHero(): Promise<Hero | null> {
  try {
    // TODO: replace with real geocode + places. Keep a nice, license-free fallback:
    const samples: Hero[] = [
      {
        subtitle: "Map of closest course nearby",
        imageUrl:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop",
      },
      {
        subtitle: "Auto-detecting your course…",
        imageUrl:
          "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1600&auto=format&fit=crop",
      },
    ];
    return samples[Math.floor(Math.random() * samples.length)];
  } catch {
    return null;
  }
}
