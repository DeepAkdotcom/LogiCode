import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios"
import { create } from "zustand";


export const useExecutionStore = create((set)=>({
    isExecuting:false,
    submission:null,

    executeCode:async(source_code, language_id, stdin, expected_outputs, problemId) => {
        try {
            set({isExecuting:true})
            console.log("Submission:",JSON.stringify({
                source_code,
                language_id,
                stdin,
                expected_outputs,
                problemId
            }));
            const res = await axiosInstance.post("/execute-code", {source_code, language_id, stdin, expected_outputs, problemId});
            console.log("AXIOS RESPONSE:", res);
            console.log("res.data:", res.data);
            console.log("res.data.data:", res.data?.data);
            set({submission:res.data.data})
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error executing code", error);
            toast.error("Error executing code")
        }finally{
            set({isExecuting:false})
        }
    }
}))