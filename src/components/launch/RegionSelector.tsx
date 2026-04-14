import { useState, useRef } from "react";
import { Button } from "../ui/button";

export function RegionSelector() {
	const [isSelecting, setIsSelecting] = useState(false);
	const [startPos, setStartPos] = useState({ x: 0, y: 0 });
	const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsSelecting(true);
		setStartPos({ x: e.clientX, y: e.clientY });
		setCurrentPos({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isSelecting) {
			setCurrentPos({ x: e.clientX, y: e.clientY });
		}
	};

	const handleMouseUp = () => {
		if (!isSelecting) return;
		setIsSelecting(false);

		const x = Math.min(startPos.x, currentPos.x);
		const y = Math.min(startPos.y, currentPos.y);
		const width = Math.abs(currentPos.x - startPos.x);
		const height = Math.abs(currentPos.y - startPos.y);

		if (width > 20 && height > 20) {
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;

			window.electronAPI.selectRegion({
				x: x / screenWidth,
				y: y / screenHeight,
				width: width / screenWidth,
				height: height / screenHeight,
			});
		}
	};

	const rectStyle = {
		left: Math.min(startPos.x, currentPos.x),
		top: Math.min(startPos.y, currentPos.y),
		width: Math.abs(currentPos.x - startPos.x),
		height: Math.abs(currentPos.y - startPos.y),
	};

	return (
		<div
			ref={containerRef}
			className="w-full h-full bg-black/30 cursor-crosshair relative"
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
		>
			<div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 pointer-events-none">
				Drag to select a region to record
			</div>
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
				<Button
					variant="ghost"
					onClick={() => window.close()}
					className="bg-black/80 text-white hover:bg-black"
				>
					Cancel
				</Button>
			</div>
			{isSelecting && (
				<div
					className="absolute border-2 border-[#005DE8] bg-[#005DE8]/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
					style={rectStyle}
				/>
			)}
		</div>
	);
}
