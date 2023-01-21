import type { NextApiRequest, NextApiResponse } from "next";
import busboy from "busboy";
import { createWriteStream, createReadStream, statSync } from "fs";

const ALLOWED_AUDIO = ["mp3"];
const ALLOWED_VIDEO = ["mp4"];
const ALLOWED_DOC = ["pdf"];
const ALLOWED_IMG = ["jpeg", "png"];

export const config = {
	api: {
		bodyParser: false,
	},
};

const getUploadDestination = (mediaType: string) => {
	if (ALLOWED_AUDIO.includes(mediaType)) return "audios";
	if (ALLOWED_VIDEO.includes(mediaType)) return "videos";
	if (ALLOWED_DOC.includes(mediaType)) return "documents";
	if (ALLOWED_IMG.includes(mediaType)) return "images";
};

const uploadVideo = async (req: NextApiRequest, res: NextApiResponse) => {
	const bb = busboy({ headers: req.headers });
	bb.on("file", (_, file, info) => {
		const fileName = info.filename;
		const location = getUploadDestination(info.mimeType.split("/")[1]);
		const filePath = `./media/${location}/${fileName}`;

		const stream = createWriteStream(filePath);
		file.pipe(stream);
	});
	bb.on("close", () => {
		res.writeHead(200, { Connection: "closed" });
		res.end();
	});
	return req.pipe(bb);
};

const streamVideo = async (req: NextApiRequest, res: NextApiResponse) => {
	const { range } = req.headers;
	if (!range) return res.status(400).json({ error: "Range must be provided" });
	const SIZE_IN_BYTES = 1000000;
	const { name } = req.query;
	const filePath = `./media/videos/${name}.mp4`;
	const { size } = statSync(filePath);
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + SIZE_IN_BYTES, size - 1);
	const contentLength = end - start + 1;
	const headers = {
		"Content-Range": `bytes ${start}-${end}/${size}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};
	res.writeHead(206, headers);

	const stream = createReadStream(filePath, { start, end });
	stream.pipe(res);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method } = req;
	switch (method) {
		case "GET":
			return streamVideo(req, res);
		case "POST":
			return uploadVideo(req, res);
		default:
			return res.status(405).json({ error: `Method ${method} is not allowed` });
	}
}

