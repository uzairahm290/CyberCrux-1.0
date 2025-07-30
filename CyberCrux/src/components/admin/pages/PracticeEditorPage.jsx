import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { FaListOl, FaChevronRight, FaChevronLeft, FaCheckCircle, FaBookOpen, FaPlus, FaMinus, FaRegSave, FaClipboardList, FaRegFileAlt, FaLink, FaTrash } from "react-icons/fa";

const categories = [
  { key: "web", label: "Web", icon: <FaBookOpen className="text-blue-400" /> },
  { key: "forensics", label: "Forensics", icon: <FaClipboardList className="text-green-400" /> },
  { key: "crypto", label: "Crypto", icon: <FaLink className="text-purple-400" /> },
  { key: "reverse", label: "Reverse", icon: <FaRegFileAlt className="text-pink-400" /> },
  { key: "misc", label: "Misc", icon: <FaListOl className="text-yellow-400" /> },
  { key: "osint", label: "OSINT", icon: <FaClipboardList className="text-cyan-400" /> },
];

const steps = [
  { label: "Details", icon: <FaBookOpen /> },
  { label: "Questions", icon: <FaListOl /> },
  { label: "Review", icon: <FaCheckCircle /> },
];

export default function PracticeEditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const practices = location.state?.practices || [];
  const practice = editing ? practices.find(p => p.id === Number(id)) : null;

  // Step 1: Meta info
  const [step, setStep] = useState(1);
  const [meta, setMeta] = useState({
    title: practice?.title || "",
    author: practice?.author || "",
    description: practice?.description || "",
    category: practice?.category || categories[0].key,
    numQuestions: practice?.questions?.length || 1,
  });
  // Step 2: Questions
  const [questions, setQuestions] = useState(
    practice?.questions ||
      Array.from({ length: meta.numQuestions }, () => ({
        text: "",
        options: ["", "", "", ""],
        correct: 0,
        solution: "",
        resources: [""],
      }))
  );
  // Step 2: Resources (global, after all questions)
  const [resources, setResources] = useState(practice?.resources || "");

  // For animated scroll to new question
  const lastQuestionRef = useRef(null);
  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [questions.length]);

  // Handlers
  function handleMetaChange(e) {
    const { name, value } = e.target;
    setMeta(m => ({ ...m, [name]: name === "numQuestions" ? Math.max(1, Number(value)) : value }));
  }

  function handleNextStep(e) {
    e.preventDefault();
    if (step === 1) {
      // If number of questions changed, adjust questions array
      if (questions.length !== meta.numQuestions) {
        setQuestions(qs => {
          const arr = Array.from({ length: meta.numQuestions }, (_, i) =>
            qs[i] || { text: "", options: ["", "", "", ""], correct: 0, solution: "", resources: [""] }
          );
          return arr;
        });
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  }

  function handleBack() {
    setStep(s => Math.max(1, s - 1));
  }

  function handleEditStep(s) {
    setStep(s);
  }

  function handleQuestionChange(idx, field, value) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === idx
          ? field === "options"
            ? { ...q, options: value }
            : { ...q, [field]: value }
          : q
      )
    );
  }

  function handleOptionChange(qIdx, optIdx, value) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, j) => (j === optIdx ? value : opt)) }
          : q
      )
    );
  }

  function handleCorrectChange(qIdx, value) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx ? { ...q, correct: value } : q
      )
    );
  }

  function handleAddResource(qIdx) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx ? { ...q, resources: [...q.resources, ""] } : q
      )
    );
  }

  function handleRemoveResource(qIdx, rIdx) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx ? { ...q, resources: q.resources.filter((_, j) => j !== rIdx) } : q
      )
    );
  }

  function handleResourceChange(qIdx, rIdx, value) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, resources: q.resources.map((res, j) => (j === rIdx ? value : res)) }
          : q
      )
    );
  }

  function handleAddQuestion() {
    setQuestions(qs => [
      ...qs,
      { text: "", options: ["", "", "", ""], correct: 0, solution: "", resources: [""] },
    ]);
    setMeta(m => ({ ...m, numQuestions: qs.length + 1 }));
  }

  function handleRemoveQuestion(idx) {
    if (questions.length === 1) return;
    setQuestions(qs => qs.filter((_, i) => i !== idx));
    setMeta(m => ({ ...m, numQuestions: questions.length - 1 }));
  }

  function handleSave(e) {
    e.preventDefault();
    // For demo: just go back to admin page
    navigate("/admin/practice");
  }

  // UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b2a5b] via-[#0e3a7b] to-[#0a1a3a] py-8 px-2">
      {/* Sticky Stepper */}
      <div className="w-full max-w-4xl sticky top-4 z-30 mb-8">
        <div className="flex items-center justify-center gap-0 md:gap-4 bg-white/10 backdrop-blur-md rounded-2xl shadow border border-white/10 px-2 py-3">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <button
                type="button"
                className={`flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-base transition-all duration-200
                  ${step === i + 1 ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg scale-105" : "text-blue-200 hover:text-white hover:bg-blue-500/20"}
                `}
                onClick={() => handleEditStep(i + 1)}
                disabled={step < i + 1 && step !== 3}
              >
                <span className="text-xl">{s.icon}</span> {s.label}
              </button>
              {i < steps.length - 1 && <FaChevronRight className="text-blue-300 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <form
        onSubmit={step === 3 ? handleSave : handleNextStep}
        className="w-full max-w-4xl bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 md:p-10 flex flex-col gap-8 animate-fade-in"
        style={{ minHeight: 500 }}
      >
        {/* Step 1: Details */}
        {step === 1 && (
          <>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 flex flex-col gap-6">
                <div className="relative">
                  <label className="absolute left-4 top-[-12px] bg-white/80 px-2 text-blue-800 text-xs font-bold rounded shadow">Title</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-300 text-blue-900 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 font-semibold text-lg shadow"
                    placeholder="Practice Set Title"
                    name="title"
                    value={meta.title}
                    onChange={handleMetaChange}
                    required
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 top-[-12px] bg-white/80 px-2 text-blue-800 text-xs font-bold rounded shadow">Author</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-300 text-blue-900 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 font-semibold text-lg shadow"
                    placeholder="Author Name"
                    name="author"
                    value={meta.author}
                    onChange={handleMetaChange}
                    required
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 top-[-12px] bg-white/80 px-2 text-blue-800 text-xs font-bold rounded shadow">Category</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-300 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 font-semibold text-lg shadow"
                    name="category"
                    value={meta.category}
                    onChange={handleMetaChange}
                  >
                    {categories.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute left-4 top-[-12px] bg-white/80 px-2 text-blue-800 text-xs font-bold rounded shadow">Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-300 text-blue-900 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 font-semibold text-base shadow min-h-[80px]"
                    placeholder="Short description of this practice set (supports HTML)"
                    name="description"
                    value={meta.description}
                    onChange={handleMetaChange}
                  />
                </div>
                {/* Number of Questions field only in step 1 */}
                <div className="relative w-48">
                  <label className="absolute left-4 top-[-12px] bg-white/80 px-2 text-blue-800 text-xs font-bold rounded shadow">Number of Questions</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-300 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 font-semibold text-lg shadow"
                    type="number"
                    min={1}
                    max={50}
                    name="numQuestions"
                    value={meta.numQuestions}
                    onChange={e => {
                      const val = Math.max(1, Number(e.target.value));
                      setMeta(m => ({ ...m, numQuestions: val }));
                      setQuestions(qs => {
                        if (val > qs.length) {
                          return [
                            ...qs,
                            ...Array.from({ length: val - qs.length }, () => ({ text: "", options: ["", "", "", ""], correct: 0, solution: "", resources: [""] })),
                          ];
                        } else if (val < qs.length) {
                          return qs.slice(0, val);
                        }
                        return qs;
                      });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all text-lg flex items-center gap-2">
                Next <FaChevronRight />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Questions */}
        {step === 2 && (
          <>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8">
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    ref={idx === questions.length - 1 ? lastQuestionRef : null}
                    className="bg-white rounded-2xl p-6 shadow-xl border border-blue-200/30 relative animate-fade-in"
                  >
                    <div className="absolute -top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold px-4 py-1 rounded-full shadow-lg text-base flex items-center gap-2">
                      Q{idx + 1}
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 flex flex-col gap-4">
                        <textarea
                          className="w-full px-4 py-3 rounded-xl bg-blue-50 border border-blue-300 text-blue-900 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-100 font-semibold text-base shadow min-h-[60px]"
                          placeholder="Question Description (supports HTML)"
                          value={q.text}
                          onChange={e => handleQuestionChange(idx, "text", e.target.value)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="relative">
                              <span className="absolute left-3 top-2 text-blue-400 font-bold">{String.fromCharCode(65 + optIdx)}</span>
                              <textarea
                                className="pl-8 pr-2 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-100 font-semibold text-base shadow min-h-[40px] w-full"
                                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                value={opt}
                                onChange={e => handleOptionChange(idx, optIdx, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-4 items-center mt-2">
                          <span className="font-semibold text-blue-700">Correct Answer:</span>
                          {[0, 1, 2, 3].map(optIdx => (
                            <label key={optIdx} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`correct-${idx}`}
                                checked={q.correct === optIdx}
                                onChange={() => handleCorrectChange(idx, optIdx)}
                                className="accent-blue-500 w-5 h-5"
                              />
                              <span className="font-bold text-blue-700">{String.fromCharCode(65 + optIdx)}</span>
                            </label>
                          ))}
                        </div>
                        <textarea
                          className="w-full px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-100 font-semibold text-base shadow min-h-[40px]"
                          placeholder="Solution (explanation or correct answer)"
                          value={q.solution}
                          onChange={e => handleQuestionChange(idx, "solution", e.target.value)}
                        />
                        <div className="flex flex-col gap-2 mt-2">
                          <span className="font-semibold text-blue-700 mb-1">Resources (optional, links, etc)</span>
                          {q.resources.map((res, rIdx) => (
                            <div key={rIdx} className="flex gap-2 items-center mb-1">
                              <input
                                className="flex-1 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-100 font-semibold text-base shadow"
                                placeholder={`Resource ${rIdx + 1}`}
                                value={res}
                                onChange={e => handleResourceChange(idx, rIdx, e.target.value)}
                              />
                              {q.resources.length > 1 && (
                                <button type="button" className="text-red-500 hover:text-red-700 p-1" onClick={() => handleRemoveResource(idx, rIdx)} title="Remove Resource"><FaTrash /></button>
                              )}
                            </div>
                          ))}
                          <button type="button" className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow flex items-center gap-2 mt-1" onClick={() => handleAddResource(idx)}>
                            <FaPlus /> Add Resource
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end justify-between min-w-[60px]">
                        <button
                          type="button"
                          className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold px-4 py-2 rounded-xl shadow flex items-center gap-2 mb-2"
                          onClick={handleAddQuestion}
                          title="Add Question"
                        >
                          <FaPlus />
                        </button>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white font-bold px-4 py-2 rounded-xl shadow flex items-center gap-2"
                            onClick={() => handleRemoveQuestion(idx)}
                            title="Remove Question"
                          >
                            <FaMinus />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 mt-6">
                <label className="font-semibold text-blue-700">Global Resources (optional, shown after all questions)</label>
                <textarea
                  className="w-full px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-100 font-semibold text-base shadow min-h-[40px]"
                  placeholder="Global Resources (optional, links, etc)"
                  value={resources}
                  onChange={e => setResources(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button type="button" className="bg-gradient-to-r from-gray-200 to-blue-200 text-blue-900 font-bold px-8 py-3 rounded-xl shadow transition-all text-lg flex items-center gap-2" onClick={handleBack}>
                <FaChevronLeft /> Back
              </button>
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all text-lg flex items-center gap-2">
                Next <FaChevronRight />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Review & Save */}
        {step === 3 && (
          <>
            <div className="flex flex-col gap-8">
              <div className="bg-white/30 rounded-2xl p-8 shadow-xl border border-blue-200/30 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <FaBookOpen className="text-blue-400 text-2xl" />
                  <h2 className="text-2xl font-bold text-blue-900">Review & Save</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <div className="font-bold text-blue-700 mb-1">Title</div>
                    <div className="bg-white/60 rounded px-4 py-2 text-blue-900 font-semibold shadow mb-2">{meta.title}</div>
                    <div className="font-bold text-blue-700 mb-1">Author</div>
                    <div className="bg-white/60 rounded px-4 py-2 text-blue-900 font-semibold shadow mb-2">{meta.author}</div>
                    <div className="font-bold text-blue-700 mb-1">Category</div>
                    <div className="bg-white/60 rounded px-4 py-2 text-blue-900 font-semibold shadow mb-2">{categories.find(c => c.key === meta.category)?.label}</div>
                  </div>
                  <div>
                    <div className="font-bold text-blue-700 mb-1">Description</div>
                    <div className="bg-white/60 rounded px-4 py-2 text-blue-900 shadow prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(meta.description) }} />
                  </div>
                </div>
                <div className="font-bold text-blue-700 mb-2">Questions</div>
                <div className="flex flex-col gap-6">
                  {questions.map((q, idx) => (
                    <div key={idx} className="bg-white/50 rounded-xl p-4 border border-blue-200/40 shadow flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-bold text-blue-800 mb-1">Q{idx + 1}:</div>
                      <div className="prose max-w-none text-blue-900" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(q.text) }} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className={`rounded px-3 py-2 text-blue-900 font-semibold flex items-center gap-2 ${q.correct === optIdx ? "bg-green-100 border border-green-400" : "bg-blue-100/60"}`}>
                            <span className={`font-bold ${q.correct === optIdx ? "text-green-700" : "text-blue-500"}`}>{String.fromCharCode(65 + optIdx)}.</span> <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2"><span className="font-bold text-green-700">Solution:</span> <span className="text-blue-900">{q.solution}</span></div>
                      {q.resources && q.resources.length > 0 && (
                        <div className="mt-1 text-blue-700 text-sm flex flex-col gap-1">
                          <span className="font-bold">Resources:</span>
                          {q.resources.map((res, rIdx) => res && <span key={rIdx} className="ml-2">{res}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {resources && <div className="mt-6 text-blue-700"><span className="font-bold">Global Resources:</span> {resources}</div>}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button type="button" className="bg-gradient-to-r from-gray-200 to-blue-200 text-blue-900 font-bold px-8 py-3 rounded-xl shadow transition-all text-lg flex items-center gap-2" onClick={handleBack}>
                <FaChevronLeft /> Back
              </button>
              <button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl transition-all text-xl flex items-center gap-3 animate-pulse">
                <FaRegSave className="text-2xl" /> Save
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
} 