import fetch from "cross-fetch";
import { useCachedPromise } from "@raycast/utils";
import type { MatchDetailData } from "@/types/match-detail";
import { getHeaderToken } from "@/utils/token";

export function useMatchDetail(matchId: string) {
  const { data, error, isLoading } = useCachedPromise(
    async (matchId: string): Promise<MatchDetailData> => {
      const url = `https://www.fotmob.com/api/matchDetails?matchId=${matchId}`;
      const headers = await getHeaderToken();

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch match details: ${response.status} ${response.statusText}`);
      }

      const rawData = (await response.json()) as Record<string, unknown>;

      if (!rawData) {
        throw new Error("No match data received from API");
      }

      // Transform the response to match our expected structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = rawData as any; // Use type assertion for complex nested data structure
      const transformedData: MatchDetailData = {
        id: data.general?.matchId || data.matchId || parseInt(matchId),
        home: {
          id: data.general?.homeTeam?.id || data.home?.id || 0,
          name: data.general?.homeTeam?.name || data.home?.name || "Home Team",
          shortName: data.general?.homeTeam?.shortName || data.home?.shortName || data.home?.name || "HOME",
          score: data.header?.teams?.[0]?.score || data.home?.score || 0,
          formation: data.general?.homeTeam?.formation,
        },
        away: {
          id: data.general?.awayTeam?.id || data.away?.id || 0,
          name: data.general?.awayTeam?.name || data.away?.name || "Away Team",
          shortName: data.general?.awayTeam?.shortName || data.away?.shortName || data.away?.name || "AWAY",
          score: data.header?.teams?.[1]?.score || data.away?.score || 0,
          formation: data.general?.awayTeam?.formation,
        },
        status: {
          utcTime: data.general?.matchTimeUTC || data.status?.utcTime || new Date().toISOString(),
          started: data.header?.status?.started || false,
          cancelled: data.header?.status?.cancelled || false,
          finished: data.header?.status?.finished || false,
          ongoing: data.header?.status?.ongoing || null,
          postponed: data.header?.status?.postponed || false,
          abandoned: data.header?.status?.abandoned || false,
          liveTime: data.header?.status?.liveTime || null,
          reason: data.header?.status?.reason || null,
        },
        tournament: {
          id: data.general?.leagueId || 0,
          name: data.general?.leagueName || data.tournament?.name || "Tournament",
          leagueId: data.general?.leagueId || 0,
          round: data.general?.leagueRoundName,
          season: data.general?.season,
        },
        venue: data.general?.venue
          ? {
              id: data.general.venue.id || 0,
              name: data.general.venue.name,
              city: data.general.venue.city || "",
              country: data.general.venue.country || "",
              capacity: data.general.venue.capacity,
            }
          : undefined,
        referee: data.general?.referee
          ? {
              id: data.general.referee.id || 0,
              name: data.general.referee.name,
              country: data.general.referee.country,
            }
          : undefined,
        events: Array.isArray(data.content?.matchFacts?.events) ? data.content.matchFacts.events : [],
        stats: data.content?.stats?.Periods?.All || undefined,
        attendance: data.general?.attendance,
      };

      return transformedData;
    },
    [matchId],
    {
      initialData: undefined,
    },
  );

  return { data, error, isLoading };
}
