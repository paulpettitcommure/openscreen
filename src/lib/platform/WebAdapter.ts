import type { RecordingSession, StoreRecordedSessionInput } from "../recordingSession";
import type { CursorTelemetryPoint, PlatformAdapter, ProcessedDesktopSource } from "./types";

export class WebAdapter implements PlatformAdapter {
	async getPlatform(): Promise<string> {
		if (/Mac|iPhone|iPad|iPod/.test(navigator.platform)) {
			return "darwin";
		}
		return "win32"; // Default fallback
	}

	async getSources(): Promise<ProcessedDesktopSource[]> {
		// In Web, we usually don't pre-list sources before getDisplayMedia
		return [];
	}

	async switchToEditor(): Promise<void> {
		// Navigate via state or routing
		window.location.search = "?windowType=editor";
	}

	async switchToHud(): Promise<void> {
		window.location.search = "?windowType=hud-overlay";
	}

	async startNewRecording(): Promise<{ success: boolean }> {
		return { success: true };
	}

	async openSourceSelector(): Promise<void> {
		// No-op or open a web dialog
	}

	async selectSource(source: ProcessedDesktopSource): Promise<ProcessedDesktopSource | null> {
		return source;
	}

	async getSelectedSource(): Promise<ProcessedDesktopSource | null> {
		// Mock for now
		return {
			id: "screen",
			name: "Entire Screen",
			display_id: "0",
			thumbnail: null,
			appIcon: null,
		};
	}

	async requestCameraAccess(): Promise<{
		success: boolean;
		granted: boolean;
		status: string;
	}> {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			stream.getTracks().forEach((t) => t.stop());
			return { success: true, granted: true, status: "granted" };
		} catch {
			return { success: true, granted: false, status: "denied" };
		}
	}

	async storeRecordedVideo(
		videoData: ArrayBuffer,
		_fileName: string,
	): Promise<{
		success: boolean;
		path?: string;
		session?: RecordingSession;
	}> {
		const blob = new Blob([videoData], { type: "video/webm" });
		const url = URL.createObjectURL(blob);
		const session: RecordingSession = {
			screenVideoPath: url,
			createdAt: Date.now(),
		};
		return { success: true, path: url, session };
	}

	async storeRecordedSession(payload: StoreRecordedSessionInput): Promise<{
		success: boolean;
		path?: string;
		session?: RecordingSession;
	}> {
		const screenBlob = new Blob([payload.screen.videoData], { type: "video/webm" });
		const screenUrl = URL.createObjectURL(screenBlob);

		let webcamUrl: string | undefined;
		if (payload.webcam) {
			const webcamBlob = new Blob([payload.webcam.videoData], { type: "video/webm" });
			webcamUrl = URL.createObjectURL(webcamBlob);
		}

		const session: RecordingSession = {
			screenVideoPath: screenUrl,
			webcamVideoPath: webcamUrl,
			createdAt: payload.createdAt || Date.now(),
		};

		return { success: true, path: screenUrl, session };
	}

	async getRecordedVideoPath(): Promise<{ success: boolean; path?: string }> {
		return { success: false };
	}

	async getAssetBasePath(): Promise<string | null> {
		return window.location.origin;
	}

	async setRecordingState(_recording: boolean): Promise<void> {
		// No-op
	}

	async getCursorTelemetry(_videoPath?: string): Promise<{
		success: boolean;
		samples: CursorTelemetryPoint[];
	}> {
		return { success: true, samples: [] };
	}

	onStopRecordingFromTray(_callback: () => void): () => void {
		return () => {};
	}

	async openExternalUrl(url: string): Promise<{ success: boolean }> {
		window.open(url, "_blank");
		return { success: true };
	}

	async saveExportedVideo(
		videoData: ArrayBuffer,
		fileName: string,
	): Promise<{
		success: boolean;
		path?: string;
	}> {
		const blob = new Blob([videoData], {
			type: fileName.endsWith(".gif") ? "image/gif" : "video/mp4",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		a.click();
		return { success: true, path: fileName };
	}

	async openVideoFilePicker(): Promise<{ success: boolean; path?: string; canceled?: boolean }> {
		return new Promise((resolve) => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "video/*";
			input.onchange = (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (file) {
					resolve({ success: true, path: URL.createObjectURL(file) });
				} else {
					resolve({ success: false, canceled: true });
				}
			};
			input.click();
		});
	}

	private currentVideoPath: string | null = null;
	private currentSession: RecordingSession | null = null;

	async setCurrentVideoPath(path: string): Promise<{ success: boolean }> {
		this.currentVideoPath = path;
		return { success: true };
	}

	async setCurrentRecordingSession(session: RecordingSession | null): Promise<{
		success: boolean;
		session?: RecordingSession;
	}> {
		this.currentSession = session;
		return { success: true, session: session ?? undefined };
	}

	async getCurrentVideoPath(): Promise<{ success: boolean; path?: string }> {
		return this.currentVideoPath
			? { success: true, path: this.currentVideoPath }
			: { success: false };
	}

	async getCurrentRecordingSession(): Promise<{
		success: boolean;
		session?: RecordingSession;
	}> {
		return this.currentSession
			? { success: true, session: this.currentSession }
			: { success: false };
	}

	async clearCurrentVideoPath(): Promise<{ success: boolean }> {
		this.currentVideoPath = null;
		this.currentSession = null;
		return { success: true };
	}

	async saveProjectFile(
		projectData: unknown,
		suggestedName?: string,
	): Promise<{
		success: boolean;
		path?: string;
	}> {
		const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = suggestedName || "project.openscreen";
		a.click();
		return { success: true, path: suggestedName };
	}

	async loadProjectFile(): Promise<{
		success: boolean;
		project?: unknown;
	}> {
		return new Promise((resolve) => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = ".openscreen,.json";
			input.onchange = async (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (file) {
					const text = await file.text();
					resolve({ success: true, project: JSON.parse(text) });
				} else {
					resolve({ success: false });
				}
			};
			input.click();
		});
	}

	async loadCurrentProjectFile(): Promise<{ success: boolean }> {
		return { success: false };
	}

	onMenuLoadProject(_callback: () => void): () => void {
		return () => {};
	}

	onMenuSaveProject(_callback: () => void): () => void {
		return () => {};
	}

	onMenuSaveProjectAs(_callback: () => void): () => void {
		return () => {};
	}

	setMicrophoneExpanded(_expanded: boolean): void {
		// No-op
	}

	setHasUnsavedChanges(_hasChanges: boolean): void {
		// No-op
	}

	onRequestSaveBeforeClose(_callback: () => Promise<boolean> | boolean): () => void {
		return () => {};
	}

	async setLocale(_locale: string): Promise<void> {
		// No-op
	}

	hudOverlayHide(): void {
		// No-op
	}

	hudOverlayClose(): void {
		// No-op
	}

	async readBinaryFile(filePath: string): Promise<{
		success: boolean;
		data?: ArrayBuffer;
		error?: string;
	}> {
		try {
			const response = await fetch(filePath);
			const data = await response.arrayBuffer();
			return { success: true, data };
		} catch (error) {
			return { success: false, error: String(error) };
		}
	}

	async revealInFolder(_filePath: string): Promise<{ success: boolean }> {
		return { success: true };
	}

	async getShortcuts(): Promise<unknown> {
		return null;
	}

	async saveShortcuts(_shortcuts: unknown): Promise<{ success: boolean }> {
		return { success: true };
	}
}
