"use client";

import {
	Captions,
	ChevronDown,
	Clapperboard,
	Mic2,
	Palette,
	PlayCircle,
	Save,
	Sparkles,
	Type,
	WandSparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

const backgroundOptions = [
	{ value: "minecraft-parkour", label: "Minecraft Parkour" },
	{ value: "subway-surfers", label: "Subway Surfers" },
	{ value: "satisfying-loop", label: "Satisfying Visual Loop" },
	{ value: "slime-cutting", label: "Slime Cutting" },
];

const voiceOptions = [
	{ value: "neutral-us", label: "AI Voiceover - Neutral (US)" },
	{ value: "narrator-uk", label: "AI Voiceover - Narrator (UK)" },
	{ value: "energetic", label: "AI Voiceover - Energetic" },
	{ value: "soft-calm", label: "AI Voiceover - Soft / Calm" },
];

const subtitleStyleOptions = [
	{ value: "clean", label: "Clean minimal" },
	{ value: "bold-social", label: "Bold social captions" },
	{ value: "karaoke", label: "Karaoke word highlight" },
	{ value: "cinematic", label: "Cinematic lower-third" },
];

const subtitlePositionOptions = [
	{ value: "bottom", label: "Bottom center" },
	{ value: "middle", label: "Middle overlay" },
	{ value: "top", label: "Top center" },
];

const backgroundVideoUrls: Record<string, string> = {
	// Replace these with your own links (watch URLs or youtu.be URLs both work).
	"minecraft-parkour": "https://www.youtube.com/watch?v=s600FYgI5-s",
	"subway-surfers": "https://www.youtube.com/watch?v=QPW3XwBoQlw",
	"satisfying-loop": "https://www.youtube.com/shorts/SbI5EWTE4Uk",
	"slime-cutting": "https://www.youtube.com/watch?v=JvI-02Q69ms",
};

const PREVIEW_CHAR_LIMIT = 130;
const hexToRgba = (hex: string, opacity: number) => {
	const normalized = hex.replace("#", "");
	const safeHex =
		normalized.length === 3
			? normalized
					.split("")
					.map((char) => `${char}${char}`)
					.join("")
			: normalized;
	const int = Number.parseInt(safeHex, 16);
	const r = (int >> 16) & 255;
	const g = (int >> 8) & 255;
	const b = int & 255;
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getYouTubeEmbedUrl = (url: string) => {
	if (!url) return "";
	try {
		const parsed = new URL(url);
		const host = parsed.hostname.replace("www.", "");
		let videoId = "";
		if (host === "youtu.be") {
			videoId = parsed.pathname.replace("/", "");
		} else if (host === "youtube.com" || host === "m.youtube.com") {
			if (parsed.pathname.startsWith("/shorts/")) {
				videoId = parsed.pathname.replace("/shorts/", "").split("/")[0] ?? "";
			} else {
				videoId = parsed.searchParams.get("v") ?? "";
			}
		}

		if (!videoId) return "";
		return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0`;
	} catch {
		return "";
	}
};

const PrototypePage = () => {
	const [prompt, setPrompt] = useState("");
	const [backgroundType, setBackgroundType] = useState(
		backgroundOptions[0].value,
	);
	const [voiceType, setVoiceType] = useState(voiceOptions[0].value);
	const [subtitleStyle, setSubtitleStyle] = useState(
		subtitleStyleOptions[1].value,
	);
	const [subtitlePosition, setSubtitlePosition] = useState(
		subtitlePositionOptions[0].value,
	);
	const [emphasizeKeywords, setEmphasizeKeywords] = useState(true);
	const [subtitleFontFamily, setSubtitleFontFamily] = useState("geist");
	const [subtitleFontSize, setSubtitleFontSize] = useState(12);
	const [subtitleTextColor, setSubtitleTextColor] = useState("#ffffff");
	const [subtitleBgColor, setSubtitleBgColor] = useState("#000000");
	const [subtitleBgOpacity, setSubtitleBgOpacity] = useState(75);
	const [subtitleBorderRadius, setSubtitleBorderRadius] = useState(16);
	const [subtitleShowBox, setSubtitleShowBox] = useState(true);

	const selectedBackgroundLabel = useMemo(
		() =>
			backgroundOptions.find((option) => option.value === backgroundType)
				?.label ?? backgroundOptions[0].label,
		[backgroundType],
	);

	const selectedVoiceLabel = useMemo(
		() =>
			voiceOptions.find((option) => option.value === voiceType)?.label ??
			voiceOptions[0].label,
		[voiceType],
	);
	const selectedBackgroundVideoUrl = useMemo(
		() => backgroundVideoUrls[backgroundType] ?? "",
		[backgroundType],
	);
	const selectedBackgroundEmbedUrl = useMemo(
		() => getYouTubeEmbedUrl(selectedBackgroundVideoUrl),
		[selectedBackgroundVideoUrl],
	);

	const previewSubtitleText = useMemo(() => {
		const fallback =
			"Scene 1: The strange beginning. Exterior walls, early morning, dramatic reveal...";
		const normalized = prompt.trim();
		const source = normalized.length > 0 ? normalized : fallback;
		return source.length > PREVIEW_CHAR_LIMIT
			? `${source.slice(0, PREVIEW_CHAR_LIMIT - 1).trimEnd()}…`
			: source;
	}, [prompt]);

	const subtitlePositionClass =
		subtitlePosition === "top"
			? "absolute inset-x-4 top-4"
			: subtitlePosition === "middle"
				? "absolute inset-x-4 top-1/2 -translate-y-1/2"
				: "absolute inset-x-4 bottom-4";

	const subtitleStyleClass =
		subtitleStyle === "clean"
			? "rounded-xl p-3"
			: subtitleStyle === "bold-social"
				? "rounded-2xl p-3 shadow-lg"
				: subtitleStyle === "karaoke"
					? "rounded-2xl p-3 ring-1 ring-yellow-300/60"
					: "rounded-md p-3 border border-white/35";
	const subtitleFontClass =
		subtitleFontFamily === "mono"
			? "font-mono"
			: subtitleFontFamily === "serif"
				? "font-serif"
				: "font-sans";
	const subtitleInlineStyle = useMemo(
		() => ({
			backgroundColor: subtitleShowBox
				? hexToRgba(subtitleBgColor, subtitleBgOpacity / 100)
				: "transparent",
			color: subtitleTextColor,
			fontSize: `${subtitleFontSize}px`,
			borderRadius: subtitleShowBox ? `${subtitleBorderRadius}px` : "0px",
		}),
		[
			subtitleBgColor,
			subtitleBgOpacity,
			subtitleShowBox,
			subtitleTextColor,
			subtitleFontSize,
			subtitleBorderRadius,
		],
	);

	return (
		<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex flex-col gap-8">
				<div className="max-w-3xl">
					<h1
						className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50"
						data-tag="title"
					>
						Hypnotic Video Generator
					</h1>
					<div
						className="mt-4 space-y-3 text-zinc-600 dark:text-zinc-400"
						data-tag="subtitle"
					>
						<p className="text-lg leading-8">
							Build your clip in three quick steps:
						</p>
						<ol className="list-decimal space-y-1 pl-5 text-base leading-7 marker:font-medium marker:text-zinc-500 dark:marker:text-zinc-400">
							<li>
								Write a short prompt describing your story, mood, and pacing.
							</li>
							<li>Choose a background video type and AI voiceover style.</li>
							<li>
								Click generate to preview your hypnotic social-video concept.
							</li>
						</ol>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<section className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
						<div className="mb-5 flex items-center justify-between">
							<span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
								<Type className="h-3.5 w-3.5" aria-hidden="true" />
								Video Builder
							</span>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
								<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
								AI Movie Maker
							</span>
						</div>

						<div className="space-y-3">
							<details className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/70" open>
								<summary className="cursor-pointer list-none text-sm font-semibold text-black dark:text-zinc-100">
									<div className="flex items-center justify-between">
										<span className="inline-flex items-center gap-2">
											<Type className="h-4 w-4" aria-hidden="true" />
											Prompt
										</span>
										<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
									</div>
								</summary>
								<div className="mt-4">
									<label
										htmlFor="prototype-prompt"
										className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
									>
										Prompt
									</label>
									<textarea
										id="prototype-prompt"
										className="min-h-40 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-500 focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100"
										placeholder="Any text added here will be transcribed into a script, and will be the foundation for your AI voiceover."
										value={prompt}
										onChange={(event) => setPrompt(event.target.value)}
									/>

									<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div>
											<label
												htmlFor="prototype-background"
												className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-black dark:text-zinc-100"
											>
												<Clapperboard className="h-4 w-4" aria-hidden="true" />
												Background video type
											</label>
											<div className="relative">
												<select
													id="prototype-background"
													className="h-11 w-full appearance-none rounded-xl border border-zinc-300 bg-white pl-3 pr-12 text-sm text-zinc-900 outline-none transition-colors focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100"
													value={backgroundType}
													onChange={(event) => setBackgroundType(event.target.value)}
												>
													{backgroundOptions.map((option) => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</select>
												<ChevronDown
													className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
													aria-hidden="true"
												/>
											</div>
										</div>

										<div>
											<label
												htmlFor="prototype-voice"
												className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-black dark:text-zinc-100"
											>
												<Mic2 className="h-4 w-4" aria-hidden="true" />
												Voiceover type
											</label>
											<div className="relative">
												<select
													id="prototype-voice"
													className="h-11 w-full appearance-none rounded-xl border border-zinc-300 bg-white pl-3 pr-12 text-sm text-zinc-900 outline-none transition-colors focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100"
													value={voiceType}
													onChange={(event) => setVoiceType(event.target.value)}
												>
													{voiceOptions.map((option) => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</select>
												<ChevronDown
													className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
													aria-hidden="true"
												/>
											</div>
										</div>
									</div>
								</div>
							</details>

							<details className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/70" open>
								<summary className="cursor-pointer list-none text-sm font-semibold text-black dark:text-zinc-100">
									<div className="flex items-center justify-between">
										<span className="inline-flex items-center gap-2">
											<Captions className="h-4 w-4" aria-hidden="true" />
											Transcribed subtitles
										</span>
										<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
									</div>
								</summary>

								<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label
											htmlFor="prototype-subtitle-style"
											className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
										>
											Subtitle style
										</label>
										<div className="relative">
											<select
												id="prototype-subtitle-style"
												className="h-11 w-full appearance-none rounded-xl border border-zinc-300 bg-white pl-3 pr-12 text-sm text-zinc-900 outline-none transition-colors focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100"
												value={subtitleStyle}
												onChange={(event) => setSubtitleStyle(event.target.value)}
											>
												{subtitleStyleOptions.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
											<ChevronDown
												className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
												aria-hidden="true"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="prototype-subtitle-position"
											className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
										>
											Position
										</label>
										<div className="relative">
											<select
												id="prototype-subtitle-position"
												className="h-11 w-full appearance-none rounded-xl border border-zinc-300 bg-white pl-3 pr-12 text-sm text-zinc-900 outline-none transition-colors focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100"
												value={subtitlePosition}
												onChange={(event) =>
													setSubtitlePosition(event.target.value)
												}
											>
												{subtitlePositionOptions.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
											<ChevronDown
												className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
												aria-hidden="true"
											/>
										</div>
									</div>
								</div>

								<label className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
									<input
										type="checkbox"
										className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-100"
										checked={emphasizeKeywords}
										onChange={(event) =>
											setEmphasizeKeywords(event.target.checked)
										}
									/>
									Emphasize key words as they are spoken
								</label>
							</details>

							<details className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/70">
								<summary className="cursor-pointer list-none text-sm font-semibold text-black dark:text-zinc-100">
									<div className="flex items-center justify-between">
										<span className="inline-flex items-center gap-2">
											<Palette className="h-4 w-4" aria-hidden="true" />
											Styling
										</span>
										<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
									</div>
								</summary>
								<label
									htmlFor="subtitle-show-box"
									className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
								>
									<input
										id="subtitle-show-box"
										type="checkbox"
										className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-100"
										checked={subtitleShowBox}
										onChange={(event) => setSubtitleShowBox(event.target.checked)}
									/>
									Show subtitle background box
								</label>
								<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label
											htmlFor="subtitle-font-family"
											className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
										>
											Font family
										</label>
										<div className="relative">
											<select
												id="subtitle-font-family"
												className="h-11 w-full appearance-none rounded-xl border border-zinc-300 bg-white pl-3 pr-12 text-sm text-zinc-900 outline-none transition-colors focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100"
												value={subtitleFontFamily}
												onChange={(event) => setSubtitleFontFamily(event.target.value)}
											>
												<option value="geist">Geist Sans</option>
												<option value="mono">Mono</option>
												<option value="serif">Serif</option>
											</select>
											<ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
										</div>
									</div>
									<div>
										<label
											htmlFor="subtitle-font-size"
											className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
										>
											Font size ({subtitleFontSize}px)
										</label>
										<input
											id="subtitle-font-size"
											type="range"
											min={10}
											max={20}
											value={subtitleFontSize}
											onChange={(event) => setSubtitleFontSize(Number(event.target.value))}
											className="w-full"
										/>
									</div>
									<div>
										<label
											htmlFor="subtitle-font-color"
											className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
										>
											Font color
										</label>
										<input
											id="subtitle-font-color"
											type="color"
											value={subtitleTextColor}
											onChange={(event) => setSubtitleTextColor(event.target.value)}
											className="h-11 w-full rounded-xl border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900"
										/>
									</div>
									<div>
										<label
											htmlFor="subtitle-background-color"
											className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
										>
											Background color
										</label>
										<input
											id="subtitle-background-color"
											type="color"
											value={subtitleBgColor}
											onChange={(event) => setSubtitleBgColor(event.target.value)}
											className="h-11 w-full rounded-xl border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900"
										/>
									</div>
									<div>
										<label
											htmlFor="subtitle-background-opacity"
											className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
										>
											Background opacity ({subtitleBgOpacity}%)
										</label>
										<input
											id="subtitle-background-opacity"
											type="range"
											min={0}
											max={100}
											value={subtitleBgOpacity}
											onChange={(event) => setSubtitleBgOpacity(Number(event.target.value))}
											className="w-full"
										/>
									</div>
									<div>
										<label
											htmlFor="subtitle-box-roundness"
											className="mb-2 block text-sm font-medium text-black dark:text-zinc-100"
										>
											Box roundness ({subtitleBorderRadius}px)
										</label>
										<input
											id="subtitle-box-roundness"
											type="range"
											min={0}
											max={24}
											value={subtitleBorderRadius}
											onChange={(event) =>
												setSubtitleBorderRadius(Number(event.target.value))
											}
											className="w-full"
										/>
									</div>
								</div>
							</details>
						</div>

					</section>

					<section className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
						<div className="mb-5 flex items-center justify-between">
							<span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
								<PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
								Final video
							</span>
							<span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
								Preview
							</span>
						</div>

						<div className="relative mx-auto aspect-9/16 w-full max-w-[290px] overflow-hidden rounded-3xl border border-zinc-200 bg-linear-to-b from-zinc-100 via-zinc-200 to-zinc-300 dark:border-zinc-700 dark:from-zinc-800 dark:via-zinc-900 dark:to-black">
							{selectedBackgroundEmbedUrl ? (
								<iframe
									title={`${selectedBackgroundLabel} preview`}
									src={selectedBackgroundEmbedUrl}
									className="absolute inset-0 h-full w-full"
									allow="autoplay; encrypted-media; picture-in-picture"
									allowFullScreen
								/>
							) : (
								<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.25),transparent_45%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.09),transparent_45%)]" />
							)}
							<div
								className={`${subtitlePositionClass} ${subtitleStyleClass} ${subtitleFontClass} ${subtitleShowBox ? "backdrop-blur" : ""}`}
								style={subtitleInlineStyle}
							>
								<p
									className={`text-xs leading-5 ${emphasizeKeywords ? "font-semibold" : "font-normal"}`}
								>
									"{previewSubtitleText}"
								</p>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
								<p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
									Background
								</p>
								<p className="mt-1 text-sm font-medium text-black dark:text-zinc-100">
									{selectedBackgroundLabel}
								</p>
							</div>
							<div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
								<p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
									Voiceover
								</p>
								<p className="mt-1 text-sm font-medium text-black dark:text-zinc-100">
									{selectedVoiceLabel}
								</p>
							</div>
						</div>

						<div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
							<button
								type="button"
								className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
							>
								<WandSparkles className="h-4 w-4" aria-hidden="true" />
								Generate Brainrot Clip
							</button>
							<button
								type="button"
								className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-5 text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
							>
								<Save className="h-4 w-4" aria-hidden="true" />
								Save Draft
							</button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default PrototypePage;
