import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  HelpCircle, 
  Clock, 
  FileUp, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function DocumentSummarizerPage() {
  const { t } = useLanguage();
  const { updateUser } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('Programming');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents');
      const docs = res.data.documents || [];
      setDocuments(docs);
      if (docs.length > 0 && !selectedDoc) {
        setSelectedDoc(docs[0]);
      }
    } catch (err) {
      console.warn('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);

    try {
      setUploading(true);
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newDoc = res.data.document;
      setDocuments(prev => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
      setFile(null);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      updateUser({ xp: (u => (u?.xp || 0) + 40) });
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed. Ensure file is within 10MB.');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id, e) => {
    e?.stopPropagation();
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <FileText className="w-4 h-4" />
            <span>Document Synthesis Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('docUploadTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('docUploadSubtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form Box */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Upload Educational Material
          </h2>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
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

            {/* Drag Drop Input */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.docx,.doc,.txt,image/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mx-auto">
                  <FileUp className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {file ? file.name : t('dragDropText')}
                </p>
                <p className="text-[10px] text-slate-400">
                  {t('supportedFormats')}
                </p>
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{uploading ? 'Analyzing Document with AI...' : 'Upload & Extract (+40 XP)'}</span>
            </button>
          </form>

          {/* Uploaded Documents List */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t('uploadedDocuments')} ({documents.length})
            </h3>
            <div className="max-h-56 overflow-y-auto space-y-1">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`group p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    selectedDoc?.id === doc.id
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{doc.fileName}</span>
                  </div>
                  <button
                    onClick={(e) => deleteDocument(doc.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Synthesis Details View */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          {selectedDoc ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {selectedDoc.subject} • {(selectedDoc.fileSize / 1024).toFixed(1)} KB
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedDoc.fileName}
                  </h2>
                </div>
              </div>

              {/* Summary Body */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {selectedDoc.summary}
              </div>

              {/* Key Topics extracted */}
              {selectedDoc.keyTopics && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t('keyTakeaways')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.keyTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/50 dark:border-brand-900/50"
                      >
                        ✓ {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Questions */}
              {selectedDoc.suggestedQuestions && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t('suggestedQuestionsDoc')}
                  </h3>
                  <div className="space-y-2">
                    {selectedDoc.suggestedQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-2"
                      >
                        <HelpCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 text-sm">
              Upload or select a document to view AI executive summaries, key takeaways, and suggested questions.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
