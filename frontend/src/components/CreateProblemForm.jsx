import React from 'react'
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from 'react';
import {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SUPPORTED_LANGUAGES } from "../lib/lang";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.record(
    z.string(),
    z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    })
  ),
  codeSnippets: z.record(z.string(), z.string().min(1, "Code snippet is required")),
  referenceSolutions: z.record(z.string(), z.string().min(1, "Solution is required")),
});


const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testCases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: { input: "n = 2", output: "2", explanation: "1+1 or 2" },
    PYTHON: { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
    JAVA: { input: "n = 4", output: "5", explanation: "..." },
    CPP: { input: "n = 5", output: "8", explanation: "..." },
    TYPESCRIPT: { input: "n = 2", output: "2", explanation: "..." },
    C: { input: "n = 3", output: "3", explanation: "..." },
    GO: { input: "n = 4", output: "5", explanation: "..." },
    RUST: { input: "n = 5", output: "8", explanation: "..." },
    RUBY: { input: "n = 2", output: "2", explanation: "..." },
    PHP: { input: "n = 3", output: "3", explanation: "..." },
    SWIFT: { input: "n = 4", output: "5", explanation: "..." },
    CSHARP: { input: "n = 5", output: "8", explanation: "..." },
    KOTLIN: { input: "n = 2", output: "2", explanation: "..." },
    SCALA: { input: "n = 3", output: "3", explanation: "..." },
  },
  codeSnippets: {
    JAVASCRIPT: `function climbStairs(n) {\n  // Write your code here\n}\n\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, terminal: false });\nrl.on('line', (line) => {\n  console.log(climbStairs(parseInt(line.trim())));\n  rl.close();\n});`,
    PYTHON: `import sys\ndef climbStairs(n):\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    n = int(sys.stdin.readline().strip())\n    print(climbStairs(n))`,
    JAVA: `import java.util.Scanner;\nclass Main {\n    public int climbStairs(int n) {\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner s = new Scanner(System.in);\n        int n = s.nextInt();\n        System.out.println(new Main().climbStairs(n));\n    }\n}`,
    CPP: `#include <iostream>\nusing namespace std;\nclass Solution {\npublic:\n    int climbStairs(int n) {\n        return 0;\n    }\n};\nint main() {\n    int n; cin >> n;\n    cout << Solution().climbStairs(n) << endl;\n    return 0;\n}`,
    TYPESCRIPT: `function climbStairs(n: number): number {\n  return 0;\n}\nimport * as fs from "fs";\nconst input = fs.readFileSync(0, "utf8");\nconsole.log(climbStairs(parseInt(input.trim())));`,
    C: `#include <stdio.h>\nint climbStairs(int n) {\n    return 0;\n}\nint main() {\n    int n; scanf("%d", &n);\n    printf("%d\\n", climbStairs(n));\n    return 0;\n}`,
    GO: `package main\nimport "fmt"\nfunc climbStairs(n int) int {\n    return 0\n}\nfunc main() {\n    var n int\n    fmt.Scan(&n)\n    fmt.Println(climbStairs(n))\n}`,
    RUST: `use std::io;\nfn climb_stairs(n: i32) -> i32 {\n    0\n}\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n    let n: i32 = input.trim().parse().unwrap();\n    println!("{}", climb_stairs(n));\n}`,
    RUBY: `def climb_stairs(n)\n  0\nend\nn = gets.to_i\nputs climb_stairs(n)`,
    PHP: `<?php\nfunction climbStairs($n) {\n    return 0;\n}\nfscanf(STDIN, "%d", $n);\necho climbStairs($n);`,
    SWIFT: `import Foundation\nfunc climbStairs(_ n: Int) -> Int {\n    return 0\n}\nif let input = readLine(), let n = Int(input) {\n    print(climbStairs(n))\n}`,
    CSHARP: `using System;\nclass Program {\n    static int ClimbStairs(int n) {\n        return 0;\n    }\n    static void Main() {\n        int n = int.Parse(Console.ReadLine());\n        Console.WriteLine(ClimbStairs(n));\n    }\n}`,
    KOTLIN: `import java.util.Scanner\nfun climbStairs(n: Int): Int {\n    return 0\n}\nfun main() {\n    val sc = Scanner(System.\`in\`)\n    val n = sc.nextInt()\n    println(climbStairs(n))\n}`,
    SCALA: `import scala.io.StdIn\nobject Main {\n    def climbStairs(n: Int): Int = {\n        0\n    }\n    def main(args: Array[String]): Unit = {\n        val n = StdIn.readInt()\n        println(climbStairs(n))\n    }\n}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, terminal: false });\nrl.on('line', (line) => {\n  console.log(climbStairs(parseInt(line.trim())));\n  rl.close();\n});`,
    PYTHON: `import sys\ndef climbStairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\nif __name__ == "__main__":\n    n = int(sys.stdin.readline().strip())\n    print(climbStairs(n))`,
    JAVA: `import java.util.Scanner;\nclass Main {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int t = a + b; a = b; b = t;\n        }\n        return b;\n    }\n    public static void main(String[] args) {\n        Scanner s = new Scanner(System.in);\n        int n = s.nextInt();\n        System.out.println(new Main().climbStairs(n));\n    }\n}`,
    CPP: `#include <iostream>\nusing namespace std;\nclass Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int t = a + b; a = b; b = t;\n        }\n        return b;\n    }\n};\nint main() {\n    int n; cin >> n;\n    cout << Solution().climbStairs(n) << endl;\n    return 0;\n}`,
    TYPESCRIPT: `function climbStairs(n: number): number {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    let t = a + b; a = b; b = t;\n  }\n  return b;\n}\nimport * as fs from "fs";\nconst input = fs.readFileSync(0, "utf8");\nconsole.log(climbStairs(parseInt(input.trim())));`,
    C: `#include <stdio.h>\nint climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int t = a + b; a = b; b = t;\n    }\n    return b;\n}\nint main() {\n    int n; scanf("%d", &n);\n    printf("%d\\n", climbStairs(n));\n    return 0;\n}`,
    GO: `package main\nimport "fmt"\nfunc climbStairs(n int) int {\n    if n <= 2 { return n }\n    a, b := 1, 2\n    for i := 3; i <= n; i++ {\n        a, b = b, a + b\n    }\n    return b\n}\nfunc main() {\n    var n int\n    fmt.Scan(&n)\n    fmt.Println(climbStairs(n))\n}`,
    RUST: `use std::io;\nfn climb_stairs(n: i32) -> i32 {\n    if n <= 2 { return n; }\n    let (mut a, mut b) = (1, 2);\n    for _ in 3..=n {\n        let t = a + b; a = b; b = t;\n    }\n    b\n}\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n    let n: i32 = input.trim().parse().unwrap();\n    println!("{}", climb_stairs(n));\n}`,
    RUBY: `def climb_stairs(n)\n  return n if n <= 2\n  a, b = 1, 2\n  (3..n).each { t = a + b; a = b; b = t }\n  b\nend\nn = gets.to_i\nputs climb_stairs(n)`,
    PHP: `<?php\nfunction climbStairs($n) {\n    if ($n <= 2) return $n;\n    $a = 1; $b = 2;\n    for ($i = 3; $i <= $n; $i++) { $t = $a + $b; $a = $b; $b = $t; }\n    return $b;\n}\nfscanf(STDIN, "%d", $n);\necho climbStairs($n);`,
    SWIFT: `import Foundation\nfunc climbStairs(_ n: Int) -> Int {\n    if n <= 2 { return n }\n    var a = 1, b = 2\n    for _ in 3...n { let t = a + b; a = b; b = t }\n    return b\n}\nif let input = readLine(), let n = Int(input) {\n    print(climbStairs(n))\n}`,
    CSHARP: `using System;\nclass Program {\n    static int ClimbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) { int t = a + b; a = b; b = t; }\n        return b;\n    }\n    static void Main() {\n        int n = int.Parse(Console.ReadLine());\n        Console.WriteLine(ClimbStairs(n));\n    }\n}`,
    KOTLIN: `import java.util.Scanner\nfun climbStairs(n: Int): Int {\n    if (n <= 2) return n\n    var a = 1; var b = 2\n    for (i in 3..n) { val t = a + b; a = b; b = t }\n    return b\n}\nfun main() {\n    val sc = Scanner(System.\`in\`)\n    val n = sc.nextInt()\n    println(climbStairs(n))\n}`,
    SCALA: `import scala.io.StdIn\nobject Main {\n    def climbStairs(n: Int): Int = {\n        if (n <= 2) return n\n        var a = 1; var b = 2\n        for (i <- 3 to n) { val t = a + b; a = b; b = t }\n        b\n    }\n    def main(args: Array[String]): Unit = {\n        val n = StdIn.readInt()\n        println(climbStairs(n))\n    }\n}`,
  },
};

// Sample problem data for another type of question
const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testCases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
    PYTHON: { input: 's = "race a car"', output: "false", explanation: '"raceacar" is not a palindrome.' },
    JAVA: { input: 's = "race a car"', output: "false", explanation: "..." },
    CPP: { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: "..." },
    TYPESCRIPT: { input: 's = "race a car"', output: "false", explanation: "..." },
    C: { input: 's = "race a car"', output: "false", explanation: "..." },
    GO: { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: "..." },
    RUST: { input: 's = "race a car"', output: "false", explanation: "..." },
    RUBY: { input: 's = "race a car"', output: "false", explanation: "..." },
    PHP: { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: "..." },
    SWIFT: { input: 's = "race a car"', output: "false", explanation: "..." },
    CSHARP: { input: 's = "race a car"', output: "false", explanation: "..." },
    KOTLIN: { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: "..." },
    SCALA: { input: 's = "race a car"', output: "false", explanation: "..." },
  },
  codeSnippets: {
    JAVASCRIPT: `function isPalindrome(s) {\n  // Write your code here\n}\nconst rl = require('readline').createInterface({ input: process.stdin, terminal: false });\nrl.on('line', (line) => {\n  console.log(isPalindrome(line) ? "true" : "false");\n  rl.close();\n});`,
    PYTHON: `import sys\ndef isPalindrome(s):\n    # Write your code here\n    pass\nif __name__ == "__main__":\n    s = sys.stdin.readline().strip()\n    print(str(isPalindrome(s)).lower())`,
    JAVA: `import java.util.Scanner;\nclass Main {\n    public boolean isPalindrome(String s) {\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String input = sc.hasNextLine() ? sc.nextLine() : "";\n        System.out.println(new Main().isPalindrome(input) ? "true" : "false");\n    }\n}`,
    CPP: `#include <iostream>\n#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        return false;\n    }\n};\nint main() {\n    string s; getline(cin, s);\n    cout << (Solution().isPalindrome(s) ? "true" : "false") << endl;\n    return 0;\n}`,
    TYPESCRIPT: `function isPalindrome(s: string): boolean {\n  return false;\n}\nimport * as fs from "fs";\nconst input = fs.readFileSync(0, "utf8").trim();\nconsole.log(isPalindrome(input) ? "true" : "false");`,
    C: `#include <stdio.h>\n#include <string.h>\n#include <stdbool.h>\nbool isPalindrome(char* s) {\n    return false;\n}\nint main() {\n    char s[1024]; if(fgets(s, 1024, stdin)) { s[strcspn(s, "\\n")] = 0; }\n    printf("%s\\n", isPalindrome(s) ? "true" : "false");\n    return 0;\n}`,
    GO: `package main\nimport ("fmt"; "bufio"; "os"; "strings")\nfunc isPalindrome(s string) bool {\n    return false\n}\nfunc main() {\n    reader := bufio.NewReader(os.Stdin)\n    input, _ := reader.ReadString('\\n')\n    fmt.Println(isPalindrome(strings.TrimSpace(input)))\n}`,
    RUST: `use std::io::{self, BufRead};\nfn is_palindrome(s: String) -> bool {\n    false\n}\nfn main() {\n    let s = io::stdin().lock().lines().next().unwrap().or(Ok("".to_string())).unwrap();\n    println!("{}", is_palindrome(s));\n}`,
    RUBY: `def is_palindrome(s)\n  false\nend\nputs is_palindrome(gets.to_s.chomp) ? "true" : "false"`,
    PHP: `<?php\nfunction isPalindrome($s) {\n    return false;\n}\necho isPalindrome(fgets(STDIN)) ? "true" : "false";`,
    SWIFT: `import Foundation\nfunc isPalindrome(_ s: String) -> Bool {\n    return false\n}\nprint(isPalindrome(readLine() ?? "") ? "true" : "false")`,
    CSHARP: `using System;\nclass Program {\n    static bool IsPalindrome(string s) {\n        return false;\n    }\n    static void Main() {\n        Console.WriteLine(IsPalindrome(Console.ReadLine() ?? "") ? "true" : "false");\n    }\n}`,
    KOTLIN: `import java.util.Scanner\nfun isPalindrome(s: String): Boolean {\n    return false\n}\nfun main() {\n    val sc = Scanner(System.\`in\`)\n    val s = if (sc.hasNextLine()) sc.nextLine() else ""\n    println(if (isPalindrome(s)) "true" else "false")\n}`,
    SCALA: `import scala.io.StdIn\nobject Main {\n    def isPalindrome(s: String): Boolean = {\n        false\n    }\n    def main(args: Array[String]): Unit = {\n        println(if (isPalindrome(StdIn.readLine())) "true" else "false")\n    }\n}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `function isPalindrome(s) {\n  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return s === s.split('').reverse().join('');\n}\nconst rl = require('readline').createInterface({ input: process.stdin, terminal: false });\nrl.on('line', (line) => {\n  console.log(isPalindrome(line) ? "true" : "false");\n  rl.close();\n});`,
    PYTHON: `import sys, re\ndef isPalindrome(s):\n    s = re.sub(r'[^a-zA-Z0-9]', '', s).lower()\n    return s == s[::-1]\nif __name__ == "__main__":\n    s = sys.stdin.readline().strip()\n    print(str(isPalindrome(s)).lower())`,
    JAVA: `import java.util.Scanner;\nclass Main {\n    public boolean isPalindrome(String s) {\n        String f = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n        return f.equals(new StringBuilder(f).reverse().toString());\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String input = sc.hasNextLine() ? sc.nextLine() : "";\n        System.out.println(new Main().isPalindrome(input) ? "true" : "false");\n    }\n}`,
    CPP: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        string f = "";\n        for (char c : s) if (isalnum(c)) f += tolower(c);\n        string r = f; reverse(r.begin(), r.end());\n        return f == r;\n    }\n};\nint main() {\n    string s; getline(cin, s);\n    cout << (Solution().isPalindrome(s) ? "true" : "false") << endl;\n    return 0;\n}`,
    TYPESCRIPT: `function isPalindrome(s: string): boolean {\n  const f = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return f === f.split('').reverse().join('');\n}\nimport * as fs from "fs";\nconst input = fs.readFileSync(0, "utf8").trim();\nconsole.log(isPalindrome(input) ? "true" : "false");`,
    C: `#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n#include <stdbool.h>\nbool isPalindrome(char* s) {\n    int l = 0, r = strlen(s) - 1;\n    while (l < r) {\n        if (!isalnum(s[l])) l++;\n        else if (!isalnum(s[r])) r--;\n        else if (tolower(s[l++]) != tolower(s[r--])) return false;\n    }\n    return true;\n}\nint main() {\n    char s[1024]; if(fgets(s, 1024, stdin)) { s[strcspn(s, "\\n")] = 0; }\n    printf("%s\\n", isPalindrome(s) ? "true" : "false");\n    return 0;\n}`,
    GO: `package main\nimport ("fmt"; "bufio"; "os"; "strings"; "unicode")\nfunc isPalindrome(s string) bool {\n    f := ""\n    for _, r := range s {\n        if unicode.IsLetter(r) || unicode.IsDigit(r) {\n            f += strings.ToLower(string(r))\n        }\n    }\n    for i := 0; i < len(f)/2; i++ {\n        if f[i] != f[len(f)-1-i] { return false }\n    }\n    return true\n}\nfunc main() {\n    reader := bufio.NewReader(os.Stdin)\n    input, _ := reader.ReadString('\\n')\n    fmt.Println(isPalindrome(strings.TrimSpace(input)))\n}`,
    RUST: `use std::io::{self, BufRead};\nfn is_palindrome(s: String) -> bool {\n    let f: Vec<char> = s.chars().filter(|c| c.is_alphanumeric()).map(|c| c.to_ascii_lowercase()).collect();\n    f.iter().eq(f.iter().rev())\n}\nfn main() {\n    let s = io::stdin().lock().lines().next().unwrap().or(Ok("".to_string())).unwrap();\n    println!("{}", is_palindrome(s));\n}`,
    RUBY: `def is_palindrome(s)\n  f = s.downcase.gsub(/[^a-z0-9]/, "")\n  f == f.reverse\nend\nputs is_palindrome(gets.to_s.chomp) ? "true" : "false"`,
    PHP: `<?php\nfunction isPalindrome($s) {\n    $f = preg_replace("/[^a-z0-9]/", "", strtolower($s));\n    return $f == strrev($f);\n}\necho isPalindrome(fgets(STDIN)) ? "true" : "false";`,
    SWIFT: `import Foundation\nfunc isPalindrome(_ s: String) -> Bool {\n    let f = s.lowercased().filter { $0.isLetter || $0.isNumber }\n    return f == String(f.reversed())\n}\nprint(isPalindrome(readLine() ?? "") ? "true" : "false")`,
    CSHARP: `using System; using System.Linq; using System.Text.RegularExpressions;\nclass Program {\n    static bool IsPalindrome(string s) {\n        string f = Regex.Replace(s.ToLower(), "[^a-z0-9]", "");\n        return f == new string(f.Reverse().ToArray());\n    }\n    static void Main() {\n        Console.WriteLine(IsPalindrome(Console.ReadLine() ?? "") ? "true" : "false");\n    }\n}`,
    KOTLIN: `import java.util.Scanner\nfun isPalindrome(s: String): Boolean {\n    val f = s.lowercase().filter { it.isLetterOrDigit() }\n    return f == f.reversed()\n}\nfun main() {\n    val sc = Scanner(System.\`in\`)\n    val s = if (sc.hasNextLine()) sc.nextLine() else ""\n    println(if (isPalindrome(s)) "true" else "false")\n}`,
    SCALA: `import scala.io.StdIn\nobject Main {\n    def isPalindrome(s: String): Boolean = {\n        val f = s.toLowerCase.filter(_.isLetterOrDigit)\n        f == f.reverse\n    }\n    def main(args: Array[String]): Unit = {\n        println(if (isPalindrome(StdIn.readLine())) "true" else "false")\n    }\n}`,
  },
};

const CreateProblemForm = () => {
    const [sampleType , setSampleType] = useState("DP")
    const navigation = useNavigate();
    const {register , control , handleSubmit , reset , formState:{errors}} = useForm(
        {
            resolver:zodResolver(problemSchema),
            defaultValues:{
                 testCases: [{ input: "", output: "" }],
      tags: [""],
      examples: SUPPORTED_LANGUAGES.reduce((acc, lang) => {
        acc[lang] = { input: "", output: "", explanation: "" };
        return acc;
      }, {}),
      codeSnippets: SUPPORTED_LANGUAGES.reduce((acc, lang) => {
        acc[lang] = `// Starter code for ${lang}\n`;
        return acc;
      }, {}),
      referenceSolutions: SUPPORTED_LANGUAGES.reduce((acc, lang) => {
        acc[lang] = `// Reference solution for ${lang}\n`;
        return acc;
      }, {}),
            }
        }
    )

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestCases,
  } = useFieldArray({
    control,
    name: "testCases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const [isLoading , setIsLoading] = useState(false);

  const onSubmit = async (value)=>{
   try {
    setIsLoading(true)
    const res = await axiosInstance.post("/problems/create-problem", value)
    console.log(res.data.data);
    toast.success(res.data.message || "Problem Created successfully⚡");
    navigation("/");
   } catch (error) {
    console.log(error);
    toast.error("Error creating problem")
   }
   finally{
      setIsLoading(false);
   }
  }

  const loadSampleData=()=>{
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem
  
   replaceTags(sampleData.tags.map((tag) => tag));
    replacetestCases(sampleData.testCases.map((tc) => tc));

   // Reset the form with sample data
    reset(sampleData);
}

  return (
    <div className='container mx-auto py-8 px-4 max-w-7xl'>
  <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b">
            <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              Create Problem
            </h2>

            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
              <div className="join">
                <button
                  type="button"
                  className={`btn join-item ${
                    sampleType === "DP" ? "btn-active" : ""
                  }`}
                  onClick={() => setSampleType("array")}
                >
                  DP Problem
                </button>
                <button
                  type="button"
                  className={`btn join-item ${
                    sampleType === "string" ? "btn-active" : ""
                  }`}
                  onClick={() => setSampleType("string")}
                >
                  String Problem
                </button>
              </div>
              <button
                type="button"
                className="btn btn-secondary gap-2"
                onClick={loadSampleData}
              >
                <Download className="w-4 h-4" />
                Load Sample
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text text-base md:text-lg font-semibold">
                    Title
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full text-base md:text-lg"
                  {...register("title")}
                  placeholder="Enter problem title"
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.title.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text text-base md:text-lg font-semibold">
                    Description
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 resize-y"
                  {...register("description")}
                  placeholder="Enter problem description"
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.description.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base md:text-lg font-semibold">
                    Difficulty
                  </span>
                </label>
                <select
                  className="select select-bordered w-full text-base md:text-lg"
                  {...register("difficulty")}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                {errors.difficulty && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.difficulty.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Tags
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendTag("")}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      {...register(`tags.${index}`)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm"
                      onClick={() => removeTag(index)}
                      disabled={tagFields.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.tags.message}
                  </span>
                </div>
              )}
            </div>

            {/* Test Cases */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Test Cases
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendTestCase({ input: "", output: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Test Case
                </button>
              </div>
              <div className="space-y-6">
                {testCaseFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base md:text-lg font-semibold">
                          Test Case #{index + 1}
                        </h4>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => removeTestCase(index)}
                          disabled={testCaseFields.length === 1}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Input
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                            {...register(`testCases.${index}.input`)}
                            placeholder="Enter test case input"
                          />
                          {errors.testCases?.[index]?.input && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.testCases[index].input.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Expected Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                            {...register(`testCases.${index}.output`)}
                            placeholder="Enter expected output"
                          />
                          {errors.testCases?.[index]?.output && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.testCases[index].output.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.testCases && !Array.isArray(errors.testCases) && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.testCases.message}
                  </span>
                </div>
              )}
            </div>

            {/* Code Editor Sections */}
            <div className="space-y-8">
              {SUPPORTED_LANGUAGES.map((language) => (
                <div
                  key={language}
                  className="card bg-base-200 p-4 md:p-6 shadow-md"
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    {language}
                  </h3>

                  <div className="space-y-6">
                    {/* Starter Code */}
                    <div className="card bg-base-100 shadow-md">
                      <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4">
                          Starter Code Template
                        </h4>
                        <div className="border rounded-md overflow-hidden">
                          <Controller
                            name={`codeSnippets.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.codeSnippets?.[language] && (
                          <div className="mt-2">
                            <span className="text-error text-sm">
                              {errors.codeSnippets[language].message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reference Solution */}
                    <div className="card bg-base-100 shadow-md">
                      <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          Reference Solution
                        </h4>
                        <div className="border rounded-md overflow-hidden">
                          <Controller
                            name={`referenceSolutions.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.referenceSolutions?.[language] && (
                          <div className="mt-2">
                            <span className="text-error text-sm">
                              {errors.referenceSolutions[language].message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="card bg-base-100 shadow-md">
                      <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4">
                          Example
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">
                                Input
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                              {...register(`examples.${language}.input`)}
                              placeholder="Example input"
                            />
                            {errors.examples?.[language]?.input && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.examples[language].input.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">
                                Output
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                              {...register(`examples.${language}.output`)}
                              placeholder="Example output"
                            />
                            {errors.examples?.[language]?.output && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.examples[language].output.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control md:col-span-2">
                            <label className="label">
                              <span className="label-text font-medium">
                                Explanation
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                              {...register(`examples.${language}.explanation`)}
                              placeholder="Explain the example"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" />
                Additional Information
              </h3>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Constraints</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                    {...register("constraints")}
                    placeholder="Enter problem constraints"
                  />
                  {errors.constraints && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.constraints.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Hints (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                    {...register("hints")}
                    placeholder="Enter hints for solving the problem"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Editorial (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-32 w-full p-3 resize-y"
                    {...register("editorial")}
                    placeholder="Enter problem editorial/solution explanation"
                  />
                </div>
              </div>
            </div>

            <div className="card-actions justify-end pt-4 border-t">
              <button type="submit" className="btn btn-primary btn-lg gap-2">
                {isLoading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Create Problem
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateProblemForm