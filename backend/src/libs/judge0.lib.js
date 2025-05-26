import axios from "axios";
export const getJudge0LanguageId  = (language) => {
    const languageMap = {
        "JAVA": "62",
        "PYHTON": "71",
        "JAVASCRIPT": "63",
        "Go": "105",
    }

    return languageMap[language.toUpperCase()];
}

export const getLanguageName = (LanguageId)=>{
    const LANGUAGE_NAMES = {
        74:"TypeScript",
        63:"JavaScript",
        71:"Python",
        62:"Java"
    }

    return LANGUAGE_NAMES[LanguageId] || "unknown"
}

export const submitBatch = async (submissions) => {
    console.log("submissions in submitBatch---->",submissions);
    console.log(`${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`);
    const {data} = await axios.post(`${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`, {submissions});

    console.log("submissions: ", data);
    return data;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const pollBatchresults = async (tokens) => {
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false
            }
        });
        console.log(data);

        const results = data.submissions

        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2 
        )
        
        console.log("isAllDone: ", isAllDone);
        if(isAllDone){
            return results;
        }

        await sleep(1000);
    }
}