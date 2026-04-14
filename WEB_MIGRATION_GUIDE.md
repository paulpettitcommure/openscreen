# OpenScreen Web Migration Feasibility Report

## Executive Summary
**Feasibility: High (Editor), Medium (Recorder)**

OpenScreen is built on a modern web stack (React, PixiJS, WebCodecs, Vite) making it a strong candidate for a web-based version. While the Editor can be ported with minimal effort, the Screen Recorder requires architectural changes to work within the browser's security sandbox.

---

## 1. Core Component Analysis

### A. Video Editor (High Portability)
The editor is almost entirely platform-independent.
- **Rendering:** PixiJS and GSAP are native web libraries.
- **Processing:** `web-demuxer` (WASM) and `mediabunny` work in standard browser environments.
- **Exporting:** WebCodecs is supported in Chrome for hardware-accelerated encoding.

### B. Screen Recorder (Medium Portability)
The recorder relies on Electron's deeper OS integration.
- **HUD Overlay:** **Not possible in Web.** Browsers cannot create transparent, always-on-top windows outside the main tab.
- **Source Selection:** Electron's `desktopCapturer` allows for a custom picker. Web must use the browser's native `getDisplayMedia` dialog.
- **Global Shortcuts:** Global hotkeys (e.g., Ctrl+Shift+R to stop recording while minimized) are not supported in browsers.

---

## 2. Technical Blockers & Solutions

| Feature | Electron (Current) | Web (Chrome) |
| :--- | :--- | :--- |
| **File Storage** | `fs` (Node.js) | **File System Access API** (User-picked folders) or **Origin Private File System** (High-perf sandbox). |
| **IPC / Windows** | `ipcRenderer` / `BrowserWindow` | Single Page Application (SPA) state or `BroadcastChannel`. |
| **System Audio** | Low-level loopback | `getDisplayMedia` (System audio checkbox in share dialog). |
| **Binary Assets** | `electronAPI.readBinaryFile` | `fetch(blobUrl)` or `File.arrayBuffer()`. |

---

## 3. Migration Roadmap

1.  **Abstraction Layer:** Introduce a `PlatformAdapter` to swap between Electron and Web implementations of file I/O and recording.
2.  **Redesign Recording Flow:** Since the HUD is not possible, implement a "Record" tab within the app that transitions to the "Editor" once the stream ends.
3.  **Cross-Origin Isolation:** Enable COOP/COEP headers on the server to support high-performance WASM memory sharing.
4.  **Local File Access:** Use the File System Access API to allow users to "Open Folder" for their recordings library, maintaining a similar feel to the local app.

## Conclusion
Running OpenScreen in Chrome is highly feasible and would greatly increase its accessibility. The main trade-off is the loss of the "utility" feel (tray icon, HUD, global shortcuts) in favor of a standard web application workflow.
