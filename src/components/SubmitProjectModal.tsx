// Project Submission Modal for Students in NEXORA
// Department of Artificial Intelligence and Data Science - Easwari Engineering College

import React, { useState } from 'react';
import {
  X,
  FolderPlus,
  UploadCloud,
  FileText,
  CheckCircle,
  Plus,
  Github,
  Globe,
} from 'lucide-react';
import { Student, Project } from '../types';
import { api } from '../services/api';

interface SubmitProjectModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onProjectSubmitted: (newProject: Project) => void;
}

export const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({
  student,
  isOpen,
  onClose,
  onProjectSubmitted,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['Python', 'FastAPI']);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [docFileName, setDocFileName] = useState('Project_Architecture_Spec.pdf');
  const [docNotes, setDocNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFileName(file.name);
      if (!docNotes) {
        setDocNotes(`Uploaded documentation document (${(file.size / 1024).toFixed(1)} KB). Includes module designs, model evaluations, and schema specifications.`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both the project title and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newProj = await api.createProject({
        studentId: student.id,
        studentName: student.name,
        registerNumber: student.registerNumber,
        year: student.year,
        section: student.section,
        title: title.trim(),
        description: description.trim(),
        techStack: techStack.length > 0 ? techStack : ['Python'],
        githubUrl: githubUrl.trim() || `https://github.com/${student.name.toLowerCase().replace(/\s+/g, '')}/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        liveDemoUrl: liveDemoUrl.trim() || undefined,
        docFileName,
        documentation: docNotes.trim() || 'Complete architecture specifications, test logs, and design models submitted via student portal.',
      });

      onProjectSubmitted(newProj);
      onClose();
      alert('Project submitted successfully! It is now visible to faculty reviewers.');
    } catch (err: any) {
      alert(err.message || 'Failed to submit project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonStacks = [
    'Python',
    'Java',
    'React',
    'Node.js',
    'Machine Learning',
    'Data Analytics',
    'SQL',
    'Spring Boot',
    'PyTorch',
    'TensorFlow',
    'OpenCV',
    'FastAPI',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <FolderPlus className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Submit New Project</h3>
              <p className="text-xs text-slate-400">
                Author: <strong>{student.name}</strong> ({student.registerNumber}) &bull; {student.year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Plant Disease Detection using Deep Learning"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Project Description & Abstract *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem statement, dataset, methodology, and key results achieved..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Tech stack */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Technology Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Type tech and hit Enter (e.g. Docker, PyTorch)"
                className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 text-[11px]"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-slate-400 hover:text-white ml-0.5"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-slate-400 mr-1">Quick Select:</span>
              {commonStacks.slice(0, 8).map((stack) => (
                <button
                  key={stack}
                  type="button"
                  onClick={() => {
                    if (!techStack.includes(stack)) setTechStack([...techStack, stack]);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                >
                  +{stack}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">GitHub Repository URL</label>
              <div className="relative">
                <Github className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Live Deployment URL (Optional)</label>
              <div className="relative">
                <Globe className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://myproject.easwari-ai.org"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Documentation Upload Simulator */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <UploadCloud className="h-4 w-4 text-cyan-400" />
                <span>Project Documentation Upload (PDF / Docx / Zip)</span>
              </label>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                Safe Prototype Storage
              </span>
            </div>

            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/50">
              <input
                type="file"
                id="docFile"
                className="hidden"
                accept=".pdf,.docx,.doc,.zip"
                onChange={handleSimulateFileUpload}
              />
              <label htmlFor="docFile" className="cursor-pointer block">
                <FileText className="h-6 w-6 text-indigo-400 mx-auto mb-1.5" />
                <span className="text-slate-200 font-semibold block text-xs">
                  {docFileName ? `Selected: ${docFileName}` : 'Choose Documentation File'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Click to select SRS report, architecture diagrams, or evaluation papers
                </span>
              </label>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Documentation Notes / Specification Summary:
              </label>
              <textarea
                rows={2}
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
                placeholder="Summary of uploaded documentation, algorithms used, and testing methodologies..."
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Project...' : 'Submit for Faculty Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
