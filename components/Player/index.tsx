import { FC, useEffect, useRef } from "react";

export const Player: FC<{ videoId: string }> = ({ videoId }) => {
	const playerRef = useRef<HTMLVideoElement>(null);
	const playMedia = async () => {
		try {
			await playerRef.current?.play();
		} catch (error) {
			return console.error(error);
		}
	};
	// playMedia();
	return (
		<main>
			<video id="video_player" width="600px" height="auto" muted controls>
				<source src={`/api/videos?name=${videoId}`} />
			</video>
		</main>
	);
};

