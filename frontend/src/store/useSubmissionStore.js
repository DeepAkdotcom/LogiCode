import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios"
import { create } from "zustand";



export const useSubmissionStore = create((set) => ({
    isLoading: false,
    submissions: [],
    submission: null,
    submissionCount: null,

    getAllSubmissions: async () => {
        try {
            set({ isLoading: true })
            const res = await axiosInstance.get("/submissions/get-all-submissions");
            set({ submissions: res.data.data });
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error getting all submissions", error);
            toast.error("Error getting all submissions");
        } finally {
            set({ isLoading: false })
        }
    },

    getSubmissionForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(`/submissions/get-submission/${problemId}`);
            set({ submission: res.data.data })
        } catch (error) {
            console.log("Error getting submissions for problem", error);
            toast.error("Error getting submissions for problem");
        } finally {
            set({ isLoading: false });
        }
    },

    getSubmissionCountForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(`/submissions/get-submissions-count/${problemId}`);
            set({ submissionCount: res.data.data });
        } catch (error) {
            console.log("Error getting submission count for problem", error);
            toast.error("Error getting submission count for problem");
        }
    }
}))