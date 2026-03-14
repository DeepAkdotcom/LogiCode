import axios from "axios";
export const getJudge0LanguageId  = (language) => {
    const languageMap = {
        "PYTHON": "71",
        "JAVASCRIPT": "63",
        "JAVA": "62",
        "TYPESCRIPT": "74",
        "CPP": "54",
        "C": "50",
        "GO": "60",
        "RUST": "73",
        "RUBY": "72",
        "PHP": "68",
        "SWIFT": "83",
        "CSHARP": "51",
        "KOTLIN": "78",
        "SCALA": "81",
    }

    return languageMap[language.toUpperCase()];
}

export const getLanguageName = (LanguageId)=>{
    const LANGUAGE_NAMES = {
        71: "Python",
        63: "JavaScript",
        62: "Java",
        74: "TypeScript",
        54: "C++",
        50: "C",
        60: "Go",
        73: "Rust",
        72: "Ruby",
        68: "PHP",
        83: "Swift",
        51: "C#",
        78: "Kotlin",
        81: "Scala",
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