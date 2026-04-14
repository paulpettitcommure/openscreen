import type { CalloutData } from "./types";

interface CalloutProps {
	data: CalloutData;
	content: string;
	width: number;
	height: number;
}

export function Callout({ data, content, width, height }: CalloutProps) {
	const { tailPosition, tailOffset, backgroundColor, color, borderRadius } = data;

	// Tail dimensions
	const tailWidth = 20;
	const tailHeight = 12;

	// Calculate tail path based on position and offset
	const getTailPath = () => {
		const offset = (tailOffset / 100);

		switch (tailPosition) {
			case "top": {
				const x = width * offset;
				return `M ${x - tailWidth / 2} ${tailHeight} L ${x} 0 L ${x + tailWidth / 2} ${tailHeight}`;
			}
			case "bottom": {
				const x = width * offset;
				return `M ${x - tailWidth / 2} ${height - tailHeight} L ${x} ${height} L ${x + tailWidth / 2} ${height - tailHeight}`;
			}
			case "left": {
				const y = height * offset;
				return `M ${tailHeight} ${y - tailWidth / 2} L 0 ${y} L ${tailHeight} ${y + tailWidth / 2}`;
			}
			case "right": {
				const y = height * offset;
				return `M ${width - tailHeight} ${y - tailWidth / 2} L ${width} ${y} L ${width - tailHeight} ${y + tailWidth / 2}`;
			}
			default:
				return "";
		}
	};

	const getPadding = () => {
		switch (tailPosition) {
			case "top": return { paddingTop: tailHeight };
			case "bottom": return { paddingBottom: tailHeight };
			case "left": return { paddingLeft: tailHeight };
			case "right": return { paddingRight: tailHeight };
			default: return {};
		}
	};

	const tailPath = getTailPath();

	return (
		<div className="w-full h-full relative" style={getPadding()}>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				className="absolute inset-0 w-full h-full drop-shadow-lg"
				preserveAspectRatio="none"
			>
				<path
					d={tailPath}
					fill={backgroundColor}
				/>
				<rect
					x={tailPosition === "left" ? tailHeight : 0}
					y={tailPosition === "top" ? tailHeight : 0}
					width={
						tailPosition === "left" || tailPosition === "right"
							? width - tailHeight
							: width
					}
					height={
						tailPosition === "top" || tailPosition === "bottom"
							? height - tailHeight
							: height
					}
					rx={borderRadius}
					fill={backgroundColor}
				/>
			</svg>
			<div
				className="relative w-full h-full flex items-center justify-center p-4 text-center overflow-hidden"
				style={{ color, fontWeight: "500", fontSize: "14px" }}
			>
				<span className="whitespace-pre-wrap break-words">{content}</span>
			</div>
		</div>
	);
}
