import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";

const useUploadService = () => {
	const [error, setError] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);

	const upload = async (url: string, data: FormData, config?: AxiosRequestConfig) => {
		try {
			return await axios.post(
				url,
				data,
				config ?? {
					onUploadProgress(progressEvent) {
						const { loaded, total = 0 } = progressEvent;
						const percentCompleted = Math.round((loaded * 100) / total);
						setProgress(percentCompleted);
					},
				},
			);
		} catch (error) {
			const { message } = error as Error;
			setIsUploading(false);
			return setError(message);
		} finally {
			setIsUploading(false);
			setProgress(0);
			return;
		}
	};

	return { error, isUploading, progress, upload };
};

export default useUploadService;

