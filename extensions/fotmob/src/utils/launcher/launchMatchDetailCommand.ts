import { LaunchType, launchCommand } from "@raycast/api";

export async function launchMatchDetailCommand(matchId: string | number) {
	await launchCommand({
		name: "match-detail",
		type: LaunchType.UserInitiated,
		arguments: {
			matchId: matchId.toString(),
		},
	});
}
