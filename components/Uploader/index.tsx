import { ChangeEventHandler, ComponentPropsWithRef, MouseEventHandler, useRef, useState } from "react";
import useUploadService from "../../hooks/useUploadService";

export const Uploader = () => {
	const { upload, error, progress, isUploading } = useUploadService();
	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | undefined>(undefined);

	const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
		const { files } = e.target;
		if (!files) return;
		return setFile(files[0]);
	};

	const onUploadHandler: MouseEventHandler<HTMLButtonElement> = async (e) => {
		if (!file) return;
		const fd = new FormData();
		fd.append("file", file, file.name);
		await upload(`/api/videos/`, fd);
		if (!isUploading) return setFile(undefined);
	};

	return (
		<main>
			<div className="container container_col">
				{eval(progress.toString()) ? (
					<>
						<progress max={100} value={progress}></progress>
						{progress}%
					</>
				) : null}
				{eval(error) ? <p>{error}</p> : null}
				<div className="container container_row">
					<button onClick={() => inputRef.current?.click()} disabled={isUploading || file ? true : false}>
						Choose File
					</button>
					<button onClick={onUploadHandler} disabled={isUploading || !file ? true : false}>
						Upload
					</button>
					<input type="file" onChange={onChangeHandler} ref={inputRef} hidden />
				</div>
			</div>
		</main>
	);
};

