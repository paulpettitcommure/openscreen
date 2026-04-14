import type { RecordingSession, StoreRecordedSessionInput } from "../recordingSession";
import type { CursorTelemetryPoint, PlatformAdapter, ProcessedDesktopSource } from "./types";

export class ElectronAdapter implements PlatformAdapter {
	async getPlatform(): Promise<string> {
		return window.electronAPI.getPlatform();
	}

	async getSources(opts?: unknown): Promise<ProcessedDesktopSource[]> {
		return window.electronAPI.getSources(opts as any);
	}

	async switchToEditor(): Promise<void> {
		return window.electronAPI.switchToEditor();
	}

	async switchToHud(): Promise<void> {
		return window.electronAPI.switchToHud();
	}

	async startNewRecording(): Promise<{ success: boolean; error?: string }> {
		return window.electronAPI.startNewRecording();
	}

	async openSourceSelector(): Promise<void> {
		return window.electronAPI.openSourceSelector();
	}

	async selectSource(source: ProcessedDesktopSource): Promise<ProcessedDesktopSource | null> {
		return window.electronAPI.selectSource(source);
	}

	async getSelectedSource(): Promise<ProcessedDesktopSource | null> {
		return window.electronAPI.getSelectedSource();
	}

	async requestCameraAccess(): Promise<{
		success: boolean;
		granted: boolean;
		status: string;
		error?: string;
	}> {
		return window.electronAPI.requestCameraAccess();
	}

	async storeRecordedVideo(
		videoData: ArrayBuffer,
		fileName: string,
	): Promise<{
		success: boolean;
		path?: string;
		session?: RecordingSession;
		message?: string;
		error?: string;
	}> {
		return window.electronAPI.storeRecordedVideo(videoData, fileName);
	}

	async storeRecordedSession(payload: StoreRecordedSessionInput): Promise<{
		success: boolean;
		path?: string;
		session?: RecordingSession;
		message?: string;
		error?: string;
	}> {
		return window.electronAPI.storeRecordedSession(payload);
	}

	async getRecordedVideoPath(): Promise<{
		success: boolean;
		path?: string;
		message?: string;
		error?: string;
	}> {
		return window.electronAPI.getRecordedVideoPath();
	}

	async getAssetBasePath(): Promise<string | null> {
		return window.electronAPI.getAssetBasePath();
	}

	async setRecordingState(recording: boolean): Promise<void> {
		return window.electronAPI.setRecordingState(recording);
	}

	async getCursorTelemetry(videoPath?: string): Promise<{
		success: boolean;
		samples: CursorTelemetryPoint[];
		message?: string;
		error?: string;
	}> {
		return window.electronAPI.getCursorTelemetry(videoPath);
	}

	onStopRecordingFromTray(callback: () => void): () => void {
		return window.electronAPI.onStopRecordingFromTray(callback);
	}

	async openExternalUrl(url: string): Promise<{ success: boolean; error?: string }> {
		return window.electronAPI.openExternalUrl(url);
	}

	async saveExportedVideo(
		videoData: ArrayBuffer,
		fileName: string,
	): Promise<{
		success: boolean;
		path?: string;
		message?: string;
		canceled?: boolean;
	}> {
		return window.electronAPI.saveExportedVideo(videoData, fileName);
	}

	async openVideoFilePicker(): Promise<{ success: boolean; path?: string; canceled?: boolean }> {
		return window.electronAPI.openVideoFilePicker();
	}

	async setCurrentVideoPath(path: string): Promise<{ success: boolean }> {
		return window.electronAPI.setCurrentVideoPath(path);
	}

	async setCurrentRecordingSession(session: RecordingSession | null): Promise<{
		success: boolean;
		session?: RecordingSession;
	}> {
		return window.electronAPI.setCurrentRecordingSession(session);
	}

	async getCurrentVideoPath(): Promise<{ success: boolean; path?: string }> {
		return window.electronAPI.getCurrentVideoPath();
	}

	async getCurrentRecordingSession(): Promise<{
		success: boolean;
		session?: RecordingSession;
	}> {
		return window.electronAPI.getCurrentRecordingSession();
	}

	async clearCurrentVideoPath(): Promise<{ success: boolean }> {
		return window.electronAPI.clearCurrentVideoPath();
	}

	async saveProjectFile(
		projectData: unknown,
		suggestedName?: string,
		existingProjectPath?: string,
	): Promise<{
		success: boolean;
		path?: string;
		message?: string;
		canceled?: boolean;
		error?: string;
	}> {
		return window.electronAPI.saveProjectFile(projectData, suggestedName, existingProjectPath);
	}

	async loadProjectFile(): Promise<{
		success: boolean;
		path?: string;
		project?: unknown;
		message?: string;
		canceled?: boolean;
		error?: string;
	}> {
		return window.electronAPI.loadProjectFile();
	}

	async loadCurrentProjectFile(): Promise<{
		success: boolean;
		path?: string;
		project?: unknown;
		message?: string;
		canceled?: boolean;
		error?: string;
	}> {
		return window.electronAPI.loadCurrentProjectFile();
	}

	onMenuLoadProject(callback: () => void): () => void {
		return window.electronAPI.onMenuLoadProject(callback);
	}

	onMenuSaveProject(callback: () => void): () => void {
		return window.electronAPI.onMenuSaveProject(callback);
	}

	onMenuSaveProjectAs(callback: () => void): () => void {
		return window.electronAPI.onMenuSaveProjectAs(callback);
	}

	setMicrophoneExpanded(expanded: boolean): void {
		return window.electronAPI.setMicrophoneExpanded(expanded);
	}

	setHasUnsavedChanges(hasChanges: boolean): void {
		return window.electronAPI.setHasUnsavedChanges(hasChanges);
	}

	onRequestSaveBeforeClose(callback: () => Promise<boolean> | boolean): () => void {
		return window.electronAPI.onRequestSaveBeforeClose(callback);
	}

	async setLocale(locale: string): Promise<void> {
		return window.electronAPI.setLocale(locale);
	}

	hudOverlayHide(): void {
		return window.electronAPI.hudOverlayHide();
	}

	hudOverlayClose(): void {
		return window.electronAPI.hudOverlayClose();
	}

	async readBinaryFile(filePath: string): Promise<{
		success: boolean;
		data?: ArrayBuffer;
		path?: string;
		message?: string;
		error?: string;
	}> {
		return window.electronAPI.readBinaryFile(filePath);
	}

	async revealInFolder(
		filePath: string,
	): Promise<{ success: boolean; error?: string; message?: string }> {
		return window.electronAPI.revealInFolder(filePath);
	}

	async getShortcuts(): Promise<unknown> {
		return window.electronAPI.getShortcuts();
	}

	async saveShortcuts(shortcuts: unknown): Promise<{ success: boolean; error?: string }> {
		return window.electronAPI.saveShortcuts(shortcuts);
	}
}
