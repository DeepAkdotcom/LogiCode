function getLanguageName(languageId) {
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
    };
    return LANGUAGE_NAMES[languageId] || "Unknown";
  }

  export { getLanguageName };


  export const SUPPORTED_LANGUAGES = [
    "PYTHON",
    "JAVASCRIPT",
    "JAVA",
    "TYPESCRIPT",
    "CPP",
    "C",
    "GO",
    "RUST",
    "RUBY",
    "PHP",
    "SWIFT",
    "CSHARP",
    "KOTLIN",
    "SCALA",
  ];

  export function getLanguageId(language) {
    const languageMap = {
      "PYTHON": 71,
      "JAVASCRIPT": 63,
      "JAVA": 62,
      "TYPESCRIPT": 74,
      "CPP": 54,
      "C": 50,
      "GO": 60,
      "RUST": 73,
      "RUBY": 72,
      "PHP": 68,
      "SWIFT": 83,
      "CSHARP": 51,
      "KOTLIN": 78,
      "SCALA": 81,
    };
    return languageMap[language.toUpperCase()];
  }