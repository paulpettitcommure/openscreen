import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	build: {
		target: "esnext",
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ["console.log", "console.debug"],
			},
		},
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("pixi.js")) {
						return "pixi";
					}
					if (id.includes("react") || id.includes("react-dom")) {
						return "react-vendor";
					}
					if (
						id.includes("mediabunny") ||
						id.includes("mp4box") ||
						id.includes("@fix-webm-duration/fix")
					) {
						return "video-processing";
					}
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
});
