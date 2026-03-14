import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import {toast} from "react-hot-toast";

export const useProblemStore = create((set)=>({
    problems:[],
    problem:null,
    solvedproblems:[],
    isProblemsLoading:false,
    isProblemLoading:false,


    getAllProblems: async()=>{
        try {
            set({isProblemsLoading: true})

            const res = await axiosInstance.get("/problems/get-all-problems");

            set({problems: res.data.data})
        } catch (error) {
            console.log("Error getting all problems", error);
            toast.error("Error in getting problems");
        }finally{
             set({isProblemsLoading: false})
        }
    },

    getProblemById: async(id)=>{
        try {
            set({isProblemLoading : true});
            const res =  await axiosInstance.get(`/problems/get-problem/${id}`);
            set({problem: res.data.data})
        } catch (error) {
            console.log("Error getting all problems", error);
            toast.error("Error in getting problems");
        }finally{
             set({isProblemLoading : false});
        }
    },

    getsolvedProblemByUser: async()=>{
        try {
            const res = await axiosInstance.get("/problems/get-solved-problem");
            set({solvedproblems: res.data.data});
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error getting solved problems", error);
            toast.error("Error getting solved problems");
        }
    },

    deleteProblem: async (id) => {
        try {
            const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
            set((state) => ({
                problems: state.problems.filter((p) => p.id !== id)
            }));
            toast.success(res.data.message || "Problem deleted successfully");
        } catch (error) {
            console.log("Error deleting problem", error);
            toast.error(error.response?.data?.message || "Error deleting problem");
        }
    }
}))