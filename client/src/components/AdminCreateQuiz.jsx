import { useEffect, useState} from 'react'
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from './Sidebar'
import { IoArrowBackOutline } from 'react-icons/io5'


function AdminCreateQuiz () {
  const {courseId, lessonId} = useParams();
  const navigate = useNavigate();
  const [existingQuizzes, setExistingQuizzes] = useState([]);

  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] = useState(80);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  

  const handleOptionChange = (index, value) => {
    const updateOption = [...options];
    updateOption[index] = value;
    setOptions(updateOption);
  };

  const handlePushQuestionToList = (e) => {
    e.preventDefault();
    if (!questionText.trim() || !correctAnswer) {
      setError("Please write a question and select the correct answer.");
      return;
    }
    const currentQuestion = {
      question: questionText,
      options: [...options],
      correctAnswers: [correctAnswer],
    }
    if (editingQuestionIndex !== null) {
      setQuestions((prev) => 
        prev.map((q, idx) => (idx === editingQuestionIndex ? currentQuestion : q))
    );
    setEditingQuestionIndex(null);
    setStatus("Question updated in the list");
    } else{
      setQuestions((prev) => [...prev, currentQuestion]);
      setStatus("Question added to the temporary list");
    }
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setError("");
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      setError("Please add at least one question before publishing.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setStatus("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/quizzes", {
        title,
        courseId,
        lessonId: lessonId || null,
        passingScore: Number(passingScore),
        questions,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setExistingQuizzes((prev) => [...prev, res.data.quiz]);
      setStatus("Quiz created and published successfully!");
      setTitle("");
      setQuestions([]);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const fetchQuizzes = async() => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/quizzes/lesson/${lessonId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setExistingQuizzes(res.data.quizzes);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching quizzes")
      }
    }
    fetchQuizzes();
  },[lessonId]);

  const handleClickDeleteQuiz = async (quizId) => {
    const windowConferm = window.confirm("Are you sure you want to delete this quiz completely from the server?");
    if (!windowConferm) {
      console.log("Delete operation canceled by Admin");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`/api/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus(res.data.message || "Quiz deleted successfully");
      setExistingQuizzes((prev) => prev.filter((quiz) => quiz._id !==quizId));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete quiz");
    }
  }
  const startEditQuiz = (quiz) => {
    setEditingQuizId(quiz._id);
    setTitle(quiz.title);
    setPassingScore(quiz.passingScore);
    setQuestions(quiz.questions || []); 
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setEditingQuestionIndex(null);


    setStatus(`Editing mode active for: "${quiz.title}" 📝`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleUpdateQuizSubmit = async (e) => {
    e.preventDefault();
    const currentQuestion = {
      question: questionText,
      options: [...options],
      correctAnswers: [correctAnswer],
    };
    let updatedQuestions = [...questions];
    if (editingQuestionIndex !== null) {
      updatedQuestions = updatedQuestions.map((q, idx) => 
        idx === editingQuestionIndex ? currentQuestion : q
      );
    } else if (questionText.trim()) {
      updatedQuestions.push(currentQuestion);
    }

    if (updatedQuestions.length === 0) {
      setError("Please add at least one question before updating.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setStatus("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/quizzes/${editingQuizId}`, {
        title,
        passingScore: Number(passingScore),
        questions: updatedQuestions,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus("Quiz updated successfully");
      setExistingQuizzes((prev) => prev.map((q) => q._id === editingQuizId ? res.data.quiz : q));
      setEditingQuizId(null);
      setEditingQuestionIndex(null);
      setTitle("");
      setPassingScore(80);
      setQuestions([]);
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

 return(
   <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 mb-6 cursor-pointer"
        >
          <IoArrowBackOutline size={18} /> Back
        </button>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              {editingQuizId ? "Update Live Quiz Mode" : "Create New Quiz"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Quiz Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-md font-semibold text-gray-800">
              {editingQuizId ? "Edit Question Content" : "Write a Question"}
            </h3>
            
            <input
              type="text"
              placeholder="Enter question text here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-2 gap-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={correctAnswer === opt && opt !== ""}
                    disabled={opt === ""}
                    onChange={() => setCorrectAnswer(opt)}
                    className="h-4 w-4 text-blue-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="w-full text-xs bg-transparent focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handlePushQuestionToList}
              className="w-full border border-blue-600 text-blue-500 rounded-full text-bule-600 py-2 hover:bg-blue-100 hover:text-blue transition"
            >
              {editingQuestionIndex !== null ? "Update Question inside List" : "Add Question to Quiz List"}
            </button>
            {editingQuizId ? (
            <button
              type="button"
              onClick={handleUpdateQuizSubmit}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {isSubmitting ? "Updating Quiz..." : "Save & Update"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="w-full border border-green-500 rounded-full text-green-600 py-2 hover:bg-green-100 hover:text-green transition"
            >
              {isSubmitting ? "Publishing..." : "Save & Publish Entire Quiz"}
            </button>
          )}
          </div>
          {editingQuizId && questions.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-500 block mb-2">Select a question below to load in the form above:</span>
              <div className="flex flex-wrap gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuestionText(q.question);
                      setOptions([...q.options]);
                      setCorrectAnswer(q.correctAnswers[0]);
                      setEditingQuestionIndex(idx);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                      editingQuestionIndex === idx 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Question {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          {status && <p className="text-green-600 text-sm font-medium text-center bg-green-50 p-2 rounded-full">{status}</p>}
          {error && <p className="text-red-600 text-sm font-medium text-center bg-red-50 p-2 rounded-full">{error}</p>}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Live Quizzes for this Lesson</h3>
  
          {existingQuizzes.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No live quiz active for this lesson yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {existingQuizzes.map((quiz) => (
                <div key={quiz._id} className="bg-grayt-50 border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center mb-2 border-b border-gray-200/ pb-2">
                    <h4 className="text-md font-bold ">{quiz.title}</h4>
                    <span className="bg-gray-200  text-xs px-2.5 py-1 rounded-full font-semibold">
                      Passing Score: {quiz.passingScore}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    {quiz.questions?.map((q, qIdx) => (
                      <div key={q._id || qIdx} className="bg-white/80 p-3 rounded-lg border border-gray-100 space-y-1.5">
                        <p className="text-sm font-semibold text-gray-800">
                          Q{qIdx + 1}: {q.question}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 pl-2">
                          {q.options?.map((opt, oIdx) => {
                            const isCorrect = q.correctAnswers?.includes(opt);
                            return (
                              <div 
                                key={oIdx} 
                                className={`text-xs p-1.5 rounded border transition ${
                                  isCorrect 
                                    ? "bg-green-50 border-green-300 text-green-700 font-medium" 
                                    : "bg-gray-50/50 border-gray-200 text-gray-600"
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}: {opt} {isCorrect && "✔"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                    <button
                      onClick={() => handleClickDeleteQuiz(quiz._id)}
                      className="flex items-center gap-2 border border-red-500 text-red-500 py-1.5 px-4 rounded-lg text-xs font-medium hover:bg-red-600 hover:text-white transition cursor-pointer"
                    >
                      <span>Delete Quiz</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditQuiz(quiz)}
                      className="flex items-center gap-2 border border-blue-500 text-blue-600 py-1.5 px-4 rounded-lg text-xs font-medium hover:bg-blue-600 hover:text-white transition cursor-pointer"
                    >
                      Edit Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
export default AdminCreateQuiz