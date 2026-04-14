import { ElectronAdapter } from "./ElectronAdapter";
import type { PlatformAdapter } from "./types";
import { WebAdapter } from "./WebAdapter";

let adapter: PlatformAdapter | null = null;

export function getPlatformAdapter(): PlatformAdapter {
	if (adapter) return adapter;

	if (typeof window !== "undefined" && window.electronAPI) {
		adapter = new ElectronAdapter();
	} else {
		adapter = new WebAdapter();
	}

	return adapter;
}
