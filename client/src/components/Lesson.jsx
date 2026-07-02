import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { IoCreateOutline } from "react-icons/io5";
import ReadMoreParagraph from './ReadMoreParagraph'
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

function Lesson() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [title, setTitle] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [availableFrom, setAvalibleForm] = useState("");
    const [order, setOrder] = useState(0);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [lessons, setLessons] = useState([]);
    const [editingLesson, setEditingLesson] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingLesson) {
            await handleClickEdit(editingLesson);
            return;
        }else{
        setError("");
        setStatus("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`/api/lessons`,
                {
                    title,
                    htmlContent,
                    courseId,
                    availableFrom: availableFrom ? new Date(availableFrom).toISOString() : null,
                    order: Number(order)
                },
                {
                    headers: {
                        Authorization:`Bearer ${token}`
                    },
                },
            );
            setStatus(res.data.message);
            setTitle("");
            setHtmlContent("");
            setAvalibleForm("");
            setOrder(0);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
        }
    }
    useEffect(() => {
        const fetchLesson = async() => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`/api/lessons/course/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLessons(res.data.lessons);
            } catch (error) {
                setError(error.response?.data?.message || "worning in fetch lesson");
            }
        }
        fetchLesson();
    }, [courseId]);
    const handleClickEdit = async(id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(`/api/lessons/${id}`,{
                title,
                htmlContent,
                availableFrom,
                order,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        setStatus("Lesson updated succesfully ✅");
        setLessons((prev) =>
        prev.map((lessons) => lessons._id === id ? res.data.lesson: lessons)
    );
    setTitle("");
    setAvalibleForm("");
        } catch (error) {
            setError(error.response?.data.message || "Failed to update lesson");
        }
    }
    const startEdit = (lesson) => {
        setEditingLesson(lesson._id);
        setTitle(lesson.title);
        setHtmlContent(lesson.htmlContent);
        setAvalibleForm(lesson.availableFrom || "");
        setOrder(lesson.order);

    }
    const handleClickDelete = async(id) => {
        const windowConferm = window.confirm("Are you sure you want the Delete this lesson?");
        if (!windowConferm) {
            console.log("Delete operation canceled by Admin");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`/api/lessons/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res.data.message);
            setStatus("Lesson deleted successfully");
            setLessons((prev) => 
            prev.filter((lesson) => lesson._id !==id));
            
        } catch (error) {
            setError(error.response?.data?.message || "Failed to delete course");
        }
        
    }
    return(
        <div className="flex min-h-screen">
            <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 justify-between items-center ">
        <div className="flex justify-between items-center gap-3">
            <div className="flex">
                <IoCreateOutline className="text-blue-500" size={25} />
                <h1 className="text-2xl font-semibold" >Course Management</h1>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-500">Total Lessons</span>
                <span className="ml-2 bg-blue-100 px-2 py-1 rounded-full text-xs">{lessons.length}</span>
            </div>
        </div>
        <div>
            <form onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto shadow-sm space-y-4 mt-5">
                <input type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <textarea type="text" placeholder="Lesson Content" value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)}
                 className="pb-40 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input type="datetime-local" value={availableFrom} onChange={(e) => setAvalibleForm(e.target.value)} 
                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input type="number" value={order} placeholder="number" onChange={(e) => setOrder(e.target.value)} 
                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button type="submit"
                className="flex items-center gap-3 justify-center w-full border bg-blue-600 border-none text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    <span>{editingLesson ? "Update Lesson" : "Create Lesson"}</span><IoCreateOutline size={22}/></button>
                {status && <p className="text-gray-600 text-sm font-medium">{status}</p>}
                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            </form> 
        </div>
       <div className="grid md:grid-cols-1 gap-6 mt-8">
        {lessons.map((lesson) => (
                <div
                key={lesson._id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition"
                >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                    {lesson.title}
                    </h3>

                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                    Order{lesson.order}
                    </span>
                </div>

                <div className="text-gray-600 text-sm mb-4">
                   <ReadMoreParagraph text={lesson.htmlContent} />
                </div>

                <div className="pt-4 flex justify-between items-center">
                    <div>
                    <p className="text-xs text-gray-500">
                        Available From
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                        {lesson.availableFrom
                        ? new Date(lesson.availableFrom).toLocaleString()
                        : "Immediately"}
                    </p>
                    </div>

                    <div className="flex gap-2">
                    <button onClick={() => startEdit(lesson)}
                         className="flex flex-1 items-center justify-center gap-2 border border-blue-500 text-blue-600 py-2 px-10 rounded-lg hover:bg-blue-600 hover:text-white transition"
                    >
                        <span>Edit</span>
                        <CiEdit className="text-xl"/>
                    </button>

                    <button onClick={() => handleClickDelete(lesson._id)}
                        className="flex-1 flex items-center gap-2 justify-center border border-red-500 text-red-500  py-2 px-10 rounded-lg hover:bg-red-600 hover:text-white transition"
                    >
                        <span>Delete</span>
                        <MdDeleteOutline className="text-xl"/>
                    </button>
                    <button onClick={() => navigate(`/admin/courses/${courseId}/lessons/${lesson._id}/manage-quiz`)}
                    className="flex-1 flex items-center gap-2 justify-center border border-purple-500 text-purple-500 py-2 px-10 rounded-lg hover:bg-purple-600 hover:text-white transition cursor-pointer"
                    >
                        <span>Quiz</span>
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </main>
        </div>
    )
}
export default Lesson;