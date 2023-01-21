import { ChangeEventHandler, MouseEventHandler, useRef, useState } from "react";
import useUploadService from "../hooks/useUploadService";
import { Uploader } from "../components/Uploader";
import { Player } from "../components/Player";

const Home = () => {
	return <Uploader />;
	// return <Player videoId="" />;
};

export default Home;

