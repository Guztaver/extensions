import { LaunchType, launchCommand } from "@raycast/api";

export function launchPlayerCommand(playerId: string) {
	return launchCommand({
		name: "player",
		type: LaunchType.UserInitiated,
		arguments: { playerId },
	});
}
