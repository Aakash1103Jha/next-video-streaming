import { useRouter } from "next/router";
import { Player } from "../../components/Player";
import { GetServerSideProps } from "next";

const VideoPlayerPage = (props: unknown) => {
	const { name } = useRouter().query as { name: string };
	return (
		<main>
			<Player videoId={name} />
		</main>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	return {
		props: { query: ctx.query },
	};
};

export default VideoPlayerPage;

