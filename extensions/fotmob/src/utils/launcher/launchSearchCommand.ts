import { LaunchType, launchCommand } from "@raycast/api";

export function launchSearchCommand() {
	return launchCommand({
		name: "favorite",
		type: LaunchType.UserInitiated,
	});
}