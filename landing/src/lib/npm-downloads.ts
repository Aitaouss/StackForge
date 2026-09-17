const NPM_WEEKLY_DOWNLOADS_URL =
  "https://api.npmjs.org/downloads/point/last-week/create-stackforge-app";

export type NpmWeeklyDownloads = {
  downloads: number;
  start: string;
  end: string;
  package: string;
};

export async function fetchNpmWeeklyDownloads(): Promise<NpmWeeklyDownloads | null> {
  try {
    const res = await fetch(NPM_WEEKLY_DOWNLOADS_URL, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data: unknown = await res.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "downloads" in data &&
      typeof (data as NpmWeeklyDownloads).downloads === "number"
    ) {
      return data as NpmWeeklyDownloads;
    }
    return null;
  } catch {
    return null;
  }
}

export function formatWeeklyDownloads(count: number): string {
  return new Intl.NumberFormat("en-US").format(count);
}
