import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Send,
  GripVertical,
  GripHorizontal,
  List,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useExecutionStore } from "../store/useExecutionStore";
import SubmissionResults from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Separator } from "../components/Seperator";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      const availableLangs = Object.keys(problem.codeSnippets || {});
      // If the current selectedLanguage isn't in the available snippets,
      // auto-select the first available language
      if (availableLangs.length > 0 && !availableLangs.includes(selectedLanguage)) {
        setSelectedLanguage(availableLangs[0]);
        return; // will re-run with the corrected language
      }

      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = async (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);
      await executeCode(code, language_id, stdin, expected_outputs, id);
      
      // Refresh submission count and list after execution
      getSubmissionCountForProblem(id);
      if (activeTab === "submissions") {
        getSubmissionForProblem(id);
      }
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const handleSubmitCode = (e) => {
    handleRunCode(e);
    // You could add navigation to submissions tab here if desired:
    // setActiveTab("submissions");
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4 p-8 rounded-lg border bg-card">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "hard":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };


  return (
    <div className="h-screen bg-base-100 text-base-content relative flex flex-col overflow-hidden">
      {/* Top Navigation Bar — Slim, LeetCode-style */}
      <nav className="border-b border-base-300 bg-base-100/80 backdrop-blur-md z-50 flex-shrink-0">
        <div className="w-full px-4 py-2 flex items-center justify-between">
          {/* Left — Home / Problem List */}
          <div className="flex items-center gap-3 flex-1">
            <Link
              to={"/"}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <Link
              to={"/"}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <List className="w-4 h-4" />
              <span>Problem List</span>
            </Link>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Center — Run / Submit */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleRunCode}
              disabled={isExecuting}
              className="gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground h-8 px-4 text-sm"
            >
              {isExecuting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run
                </>
              )}
            </Button>
            <Button 
              onClick={handleSubmitCode}
              disabled={isExecuting}
              className="gap-2 bg-success text-success-foreground hover:bg-success/90 h-8 px-4 text-sm"
            >
              <Send className="w-4 h-4" />
              Submit
            </Button>
          </div>

          {/* Right — Language selector, bookmark, share */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <select
              className="h-8 px-3 rounded-lg border border-base-300/50 bg-base-200/50 backdrop-blur-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer hover:bg-base-200/80 shadow-sm"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {Object.keys(problem.codeSnippets || {}).map((lang) => (
                <option key={lang} value={lang} className="bg-base-200 text-foreground">
                  {lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isBookmarked ? "text-warning" : ""}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex-1 overflow-hidden p-4">
        <div className="absolute top-10 left-0 w-1/3 h-1/3 bg-primary opacity-20 blur-3xl rounded-full pointer-events-none z-0"></div>
        <PanelGroup orientation="horizontal" className="h-full w-full relative z-10">
          {/* Left Panel - Problem Description */}
          <Panel defaultSize={50} minSize={20} className="rounded-2xl bg-base-200/50 backdrop-blur-xl shadow-sm border border-base-300/50 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="border-b border-base-300 bg-base-200/80 px-4 flex items-center gap-1">
              {[
                { id: "description", icon: FileText, label: "Description" },
                { id: "submissions", icon: Code2, label: "Submissions" },
                { id: "discussion", icon: MessageSquare, label: "Discussion" },
                { id: "hints", icon: Lightbulb, label: "Hints" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content - always rendered, toggled with CSS */}
            <div className="flex-1 overflow-y-scroll p-6 relative">

              {/* Description Tab */}
              <div style={{ display: activeTab === "description" ? "block" : "none" }}>
                {/* Problem Title & Meta — moved here from navbar */}
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-foreground mb-2">{problem.title}</h1>
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={`${getDifficultyColor(problem.difficulty)} font-medium border`}
                    >
                      {problem.difficulty || "Medium"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(problem.CreatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{submissionCount} Submissions</span>
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>95% Success Rate</span>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Problem Statement */}
                <div className="text-base-content/50 text-xs uppercase tracking-widest font-bold mb-3">Problem</div>
                <p className="text-sm leading-relaxed text-base-content/85 mb-8">{problem.description}</p>

                {/* Examples */}
                {problem.examples && (
                  <div className="mb-8">
                    <div className="text-base-content/50 text-xs uppercase tracking-widest font-bold mb-3">Examples</div>
                    <div className="flex flex-col gap-3">
                      {Object.entries(problem.examples).map(([lang, example], idx) => (
                        <div key={lang} className="rounded-xl border border-base-300/50 bg-base-200/50 backdrop-blur-sm overflow-hidden shadow-sm">
                          <div className="px-4 py-2 border-b border-base-300/40 bg-base-300/20 text-xs font-bold text-base-content/50 uppercase tracking-wider">
                            Example {idx + 1}
                          </div>
                          <div className="px-4 py-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 font-mono text-sm">
                            <span className="text-base-content/40 font-bold uppercase text-xs pt-0.5">Input</span>
                            <span className="text-base-content/90">{example.input}</span>
                            <span className="text-base-content/40 font-bold uppercase text-xs pt-0.5">Output</span>
                            <span className="text-success font-semibold">{example.output}</span>
                            {example.explanation && (
                              <>
                                <span className="text-base-content/40 font-bold uppercase text-xs pt-0.5">Explain</span>
                                <span className="text-base-content/70 font-sans text-xs leading-relaxed">{example.explanation}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div>
                    <div className="text-base-content/50 text-xs uppercase tracking-widest font-bold mb-3">Constraints</div>
                    <div className="rounded-xl border border-base-300/50 bg-base-200/50 backdrop-blur-sm px-4 py-3 font-mono text-sm text-base-content/80 shadow-sm whitespace-pre-wrap overflow-x-auto">
                      {problem.constraints}
                    </div>
                  </div>
                )}
              </div>


              {/* Submissions Tab */}
              <div style={{ display: activeTab === "submissions" ? "block" : "none" }}>
                <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />
              </div>

              {/* Discussion Tab */}
              <div style={{ display: activeTab === "discussion" ? "block" : "none" }}>
                <div className="text-base-content/50 text-xs uppercase tracking-widest font-bold mb-6">Discussion</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-base-content/30" />
                    <span className="text-base font-semibold text-base-content/70">No discussions yet</span>
                  </div>
                  <p className="text-sm text-base-content/50 mb-4">Be the first to start a conversation about this problem! Share your approach, ask questions, or help others.</p>
                  <div>
                    <button className="btn btn-primary btn-sm">Start Discussion</button>
                  </div>
                </div>
              </div>

              {/* Hints Tab */}
              <div style={{ display: activeTab === "hints" ? "block" : "none" }}>
                {problem?.hints ? (
                  <div>
                    <div className="text-base-content/50 text-xs uppercase tracking-widest font-bold mb-6">Hints</div>
                    <div className="rounded-2xl border border-base-300/50 bg-base-200/50 backdrop-blur-sm p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-warning" />
                        <h3 className="text-base font-bold text-base-content">Hint 1</h3>
                      </div>
                      <div className="text-base-content/80 text-sm leading-relaxed">{problem.hints}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-base-content/50 text-xs uppercase tracking-widest font-bold mb-6">Hints</div>
                    <div className="flex items-center gap-3 mb-2">
                      <Lightbulb className="w-5 h-5 text-base-content/30" />
                      <span className="text-base font-semibold text-base-content/70">No hints available</span>
                    </div>
                    <p className="text-sm text-base-content/50">Try to solve it without hints first! Use your logic and problem-solving skills to find the optimal solution.</p>
                  </div>
                )}
              </div>

            </div>
          </Panel>

          <PanelResizeHandle className="w-3 mx-1 flex-shrink-0 bg-transparent hover:bg-base-300/50 transition-colors flex items-center justify-center cursor-col-resize rounded-lg">
            <div className="w-1 h-8 rounded-full bg-base-content/20 flex items-center justify-center">
              <GripVertical className="w-3 h-3 text-base-content/40" />
            </div>
          </PanelResizeHandle>

          {/* Right Panel - Code Editor & Console */}
          <Panel defaultSize={50} minSize={20}>
            <PanelGroup orientation="vertical" className="h-full">
              {/* Top Panel - Editor */}
              <Panel defaultSize={60} minSize={20} className="rounded-2xl bg-base-200/50 backdrop-blur-xl shadow-sm border border-base-300/50 overflow-hidden flex flex-col">
                {/* Editor Header */}
                <div className="border-b border-base-300 bg-base-200/80 px-4 py-3 flex items-center">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Code2 className="w-4 h-4 text-primary" />
                    Code
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden">
                  <Editor
                    height="100%"
                    language={selectedLanguage.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  />
                </div>


              </Panel>

              <PanelResizeHandle className="h-3 my-1 flex-shrink-0 bg-transparent hover:bg-base-300/50 transition-colors flex items-center justify-center cursor-row-resize rounded-lg">
                <div className="h-1 w-8 rounded-full bg-base-content/20 flex items-center justify-center">
                  <GripHorizontal className="w-3 h-3 text-base-content/40" />
                </div>
              </PanelResizeHandle>

              {/* Bottom Panel - Console (Test Cases / Results) */}
              <Panel defaultSize={40} minSize={20} className="rounded-2xl bg-base-200/50 backdrop-blur-xl shadow-sm border border-base-300/50 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  {submission ? (
                    <SubmissionResults submission={submission} />
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                          <Terminal className="w-4 h-4" />
                          Testcases
                        </h3>
                      </div>
                      <div className="rounded-lg border overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Case
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Input
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Expected Output
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {testCases.map((testCase, index) => (
                                <tr key={index} className="hover:bg-hover-accent transition-colors">
                                  <td className="px-4 py-3 text-sm text-muted-foreground">
                                    #{index + 1}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-sm text-foreground">
                                    {testCase.input}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-sm text-foreground">
                                    {testCase.output}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default ProblemPage;