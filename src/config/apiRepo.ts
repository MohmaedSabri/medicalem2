import axiosClient from "./axiosClient";

export const apiRepo = {
	GET(url: string) {
		return axiosClient.get(url);
	},
	POST(url: string, data: any) {
		return axiosClient.post(url, data);
	},
	PUT(url: string, data: any) {
		return axiosClient.put(url, data);
	},
	PATCH(url: string, data: any) {
		return axiosClient.patch(url, data);
	},
	DELETE(url: string) {
		return axiosClient.delete(url);
	},
};