import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  BookOpen, 
  Users, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [overview, setOverview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Course Modal
  const [createCourseModal, setCreateCourseModal] = useState(false);
  const [cTitle, setCTitle] = useState('');
  const [cSubject, setCSubject] = useState('Programming');
  const [cDifficulty, setCDifficulty] = useState('Intermediate');
  const [cDuration, setCDuration] = useState('12 hours');
  const [cDesc, setCDesc] = useState('');

  // Add Lesson Modal
  const [addLessonModal, setAddLessonModal] = useState(false);
  const [targetCourseId, setTargetCourseId] = useState('');
  const [lTitle, setLTitle] = useState('');
  const [lDuration, setLDuration] = useState('30 min');
  const [lVideoUrl, setLVideoUrl] = useState('');
  const [lContent, setLContent] = useState('');

  // Create Assignment Modal
  const [assignModal, setAssignModal] = useState(false);
  const [assignCourseId, setAssignCourseId] = useState('');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/overview');
      setOverview(res.data);
      setCourses(res.data.courses || []);
      if (res.data.courses?.length > 0) {
        loadCourseStudents(res.data.courses[0].id);
      }
    } catch (err) {
      console.warn('Teacher overview load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseStudents = async (cId) => {
    setSelectedCourse(cId);
    try {
      const res = await api.get(`/teacher/courses/${cId}/students`);
      setCourseStudents(res.data.students || []);
    } catch (err) {}
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/teacher/courses', {
        title: cTitle,
        subject: cSubject,
        difficulty: cDifficulty,
        duration: cDuration,
        description: cDesc
      });
      setCourses(prev => [res.data.course, ...prev]);
      setCreateCourseModal(false);
      setCTitle('');
      setCDesc('');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (err) {}
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/teacher/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {}
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!targetCourseId) return;
    try {
      await api.post(`/teacher/courses/${targetCourseId}/lessons`, {
        title: lTitle,
        duration: lDuration,
        videoUrl: lVideoUrl,
        content: lContent
      });
      setAddLessonModal(false);
      setLTitle('');
      setLContent('');
      loadOverview();
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    } catch (err) {}
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignCourseId) return;
    try {
      await api.post('/teacher/assignments', {
        courseId: assignCourseId,
        title: assignTitle,
        description: assignDesc,
        dueDate: assignDate
      });
      setAssignModal(false);
      setAssignTitle('');
      setAssignDesc('');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    } catch (err) {}
  };

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Briefcase className="w-4 h-4" />
            <span>Faculty Instruction Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('teacherTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('teacherSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setCreateCourseModal(true)}
            className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createNewCourse')}</span>
          </button>
          <button
            onClick={() => {
              setTargetCourseId(courses[0]?.id || '');
              setAddLessonModal(true);
            }}
            className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('addLesson')}</span>
          </button>
          <button
            onClick={() => {
              setAssignCourseId(courses[0]?.id || '');
              setAssignModal(true);
            }}
            className="px-4 py-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs transition-colors flex items-center space-x-1.5"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-xs font-semibold text-slate-400">Your Courses</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {overview?.totalCourses || courses.length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-xs font-semibold text-slate-400">{t('enrolledStudents')}</span>
          <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">
            {overview?.totalStudents || 14}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-xs font-semibold text-slate-400">{t('activeQuizzes')}</span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {overview?.totalQuizzes || 4}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-xs font-semibold text-slate-400">Published Assignments</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {overview?.totalAssignments || 2}
          </p>
        </div>
      </div>

      {/* Course Management Roster */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Curriculum Authoring & Course Registry
          </h2>
          <span className="text-xs text-slate-400">{courses.length} courses total</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {courses.map((course) => (
            <div key={course.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {course.subject} • {course.difficulty} • {course.duration} • {course.lessonsCount || 0} Lessons
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => loadCourseStudents(course.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCourse === course.id
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  View Students
                </button>
                <button
                  onClick={() => {
                    setTargetCourseId(course.id);
                    setAddLessonModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  + Lesson
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Progress Roster */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('studentProgressTitle')}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Selected Course: <strong>{courses.find(c => c.id === selectedCourse)?.title || 'First Course'}</strong>
          </span>
        </div>

        {courseStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5">Student</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Lessons Done</th>
                  <th className="py-2.5">Progress</th>
                  <th className="py-2.5">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courseStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/40">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                    <td className="py-3 text-slate-500">{s.email}</td>
                    <td className="py-3 font-bold">{s.completedLessonsCount}</td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${s.progressPercentage}%` }} />
                        </div>
                        <span className="font-bold text-emerald-600">{s.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400">{new Date(s.lastAccessedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No students currently enrolled in this course.
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {createCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('createNewCourse')}</h3>
              <button onClick={() => setCreateCourseModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={cTitle}
                  onChange={e => setCTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems & Microservices"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={cSubject}
                    onChange={e => setCSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="History">History</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={cDifficulty}
                    onChange={e => setCDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  value={cDesc}
                  onChange={e => setCDesc(e.target.value)}
                  placeholder="Brief syllabus overview and pedagogical goals..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Publish Course
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {addLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('addLesson')}</h3>
              <button onClick={() => setAddLessonModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Course</label>
                <select
                  value={targetCourseId}
                  onChange={e => setTargetCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lTitle}
                  onChange={e => setLTitle(e.target.value)}
                  placeholder="e.g. Asynchronous Middleware Pipelines"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Video Embed URL (YouTube embed or MP4)</label>
                <input
                  type="url"
                  value={lVideoUrl}
                  onChange={e => setLVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Lesson Content (Markdown Supported)</label>
                <textarea
                  rows={4}
                  required
                  value={lContent}
                  onChange={e => setLContent(e.target.value)}
                  placeholder="Detailed lecture notes, formulas, code snippets..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Add Lesson to Curriculum
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish New Assignment</h3>
              <button onClick={() => setAssignModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course</label>
                <select
                  value={assignCourseId}
                  onChange={e => setAssignCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={e => setAssignTitle(e.target.value)}
                  placeholder="e.g. Implement Vectorized Matrix Multiply"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={assignDate}
                  onChange={e => setAssignDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={assignDesc}
                  onChange={e => setAssignDesc(e.target.value)}
                  placeholder="Submission guidelines..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Publish Assignment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
