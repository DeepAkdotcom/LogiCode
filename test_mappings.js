
import { getLanguageId as getFrontendLangId, getLanguageName as getFrontendLangName } from './frontend/src/lib/lang.js';
import { getJudge0LanguageId as getBackendLangId, getLanguageName as getBackendLangName } from './backend/src/libs/judge0.lib.js';

const languagesToTest = [
    "PYTHON", "JAVASCRIPT", "JAVA", "TYPESCRIPT", "CPP", "C", "GO", "RUST", 
    "RUBY", "PHP", "SWIFT", "CSHARP", "KOTLIN", "SCALA"
];

console.log("--- Verifying Language Mappings ---");

let allPassed = true;

languagesToTest.forEach(lang => {
    const fId = getFrontendLangId(lang);
    const bId = parseInt(getBackendLangId(lang));
    
    if (fId === bId && fId !== undefined) {
        console.log(`[PASS] ${lang}: ID ${fId}`);
        
        const fName = getFrontendLangName(fId);
        const bName = getBackendLangName(bId);
        
        if (fName === bName && fName !== "Unknown") {
            console.log(`      Name match: ${fName}`);
        } else {
            console.error(`[FAIL] ${lang}: Name mismatch! Frontend: ${fName}, Backend: ${bName}`);
            allPassed = false;
        }
    } else {
        console.error(`[FAIL] ${lang}: ID mismatch! Frontend: ${fId}, Backend: ${bId}`);
        allPassed = false;
    }
});

if (allPassed) {
    console.log("\n[SUCCESS] All language mappings are consistent across frontend and backend.");
} else {
    console.error("\n[FAILURE] Consistency check failed.");
    process.exit(1);
}
