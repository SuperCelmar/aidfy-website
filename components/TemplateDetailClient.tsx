'use client';

import { Template, TemplateFile, getPublicFileUrl } from '@/lib/templates';
import Link from 'next/link';
import { useState } from 'react';
import { DownloadCloud, Archive, FileText, X, ChevronDown, ChevronUp } from 'lucide-react';

// Lead capture form component
const ContactForm = ({ 
  onSubmit,
  onCancel,
  templateSlug,
  templateTitle,
  isSubmitting
}: { 
  onSubmit: (formData: any) => void,
  onCancel: () => void,
  templateSlug: string,
  templateTitle: string,
  isSubmitting: boolean
}) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl relative w-11/12 sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 max-w-lg">
      <button onClick={onCancel} className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
      <h2 className="text-xl font-bold mb-6 text-gray-900 text-center">Access Template Files</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        onSubmit({
          ...data,
          template_slug: templateSlug,
          templateTitle: templateTitle,
        });
      }} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" name="firstName" id="firstName" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400" placeholder="Enter first name" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" name="lastName" id="lastName" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400" placeholder="Enter last name" />
          </div>
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input type="text" name="companyName" id="companyName" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400" placeholder="Enter company name" />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input type="text" name="role" id="role" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400" placeholder="Enter your role" />
        </div>
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">Why are you interested?</label>
          <textarea name="interest" id="interest" rows={3} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400" placeholder="Briefly tell us what you hope to achieve with this template..." disabled={isSubmitting}></textarea>
        </div>
        <button 
          type="submit"
          className="mt-6 w-full bg-slate-700 text-white px-4 py-2.5 rounded-md hover:bg-slate-800 transition-colors font-medium shadow-md disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Access Files'}
        </button>
      </form>
    </div>
  );
};

// File download interface component
const DownloadInterface = ({
  files,
  onClose,
  downloadZip,
  isDownloadingZip,
  downloadIndividualFile,
  isDownloadingIndividualFile
}: {
  files: TemplateFile[];
  onClose: () => void;
  downloadZip: () => void;
  isDownloadingZip: boolean;
  downloadIndividualFile: (file: TemplateFile) => void;
  isDownloadingIndividualFile: string | null;
}) => {
  const formatFileSize = (bytes?: number | null): string => {
    if (bytes == null || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl relative w-11/12 sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 max-w-lg max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Download Template Files</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
          <X size={20} />
        </button>
      </div>
      
      <div className="mb-6">
        <button
          onClick={downloadZip}
          disabled={isDownloadingZip}
          className="flex items-center justify-center gap-2 w-full bg-slate-700 text-white px-4 py-3 rounded-md hover:bg-slate-800 transition-colors font-medium shadow-md disabled:opacity-50"
        >
          <Archive size={20} />
          {isDownloadingZip ? 'Preparing ZIP...' : 'Download All Files as ZIP'}
        </button>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Download Individual Files</h3>
        <div className="space-y-3">
          {files.map((file) => (
            <button 
              key={file.id} 
              onClick={() => downloadIndividualFile(file)}
              disabled={isDownloadingIndividualFile === file.id || isDownloadingZip}
              className="flex items-center justify-between p-3 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors group w-full text-left disabled:opacity-50"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-700" />
                <span className="text-slate-700 group-hover:text-slate-900 font-medium">{file.file_name}</span>
              </div>
              {file.file_size != null && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 group-hover:text-slate-700">
                    {formatFileSize(file.file_size)}
                  </span>
                  {isDownloadingIndividualFile === file.id ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <DownloadCloud className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface TemplateDetailClientProps {
  template: Template;
  files: TemplateFile[];
}

export default function TemplateDetailClient({ template, files }: TemplateDetailClientProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showDownloadInterface, setShowDownloadInterface] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isDownloadingIndividualFile, setIsDownloadingIndividualFile] = useState<string | null>(null);
  const [leadData, setLeadData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVideoSectionOpen, setIsVideoSectionOpen] = useState(false);
  
  const formatFileSize = (bytes?: number | null): string => {
    if (bytes == null || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const handleLeadSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);
    setLeadData(formData);
    
    try {
      const response = await fetch('/api/admin-submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Form submission failed');
      }
      
      setShowLeadForm(false);
      setShowDownloadInterface(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const forceDownloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const downloadAllAsZip = async () => {
    if (!files || files.length === 0) {
      setError('No files available to download for ZIP.');
      return;
    }
    setIsDownloadingZip(true);
    setError(null);
    
    try {
      const filePaths = files.map(file => file.file_path).filter(Boolean);
      if (filePaths.length === 0) throw new Error('No valid file paths found for ZIP.');
      
      const downloadResponse = await fetch('/api/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePaths, templateSlug: template.slug, leadInfo: leadData }),
      });
      
      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json();
        throw new Error(errorData.error || 'Failed to generate ZIP file');
      }
      
      const blob = await downloadResponse.blob();
      forceDownloadBlob(blob, `${template.slug}-files.zip`);
    } catch (err: any) {
      setError(err.message || 'Failed to download ZIP file.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const downloadIndividualFile = async (file: TemplateFile) => {
    if (!file || !file.file_path) {
      setError('Invalid file data.');
      return;
    }
    setIsDownloadingIndividualFile(file.id);
    setError(null);

    try {
      const fileUrl = getPublicFileUrl(file.file_path);
      if (!fileUrl) throw new Error('Could not get file URL.');

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const blob = await response.blob();
      forceDownloadBlob(blob, file.file_name);
    } catch (err: any) {
      setError(err.message || `Failed to download ${file.file_name}.`);
    } finally {
      setIsDownloadingIndividualFile(null);
    }
  };
  
  const handleDownloadClick = () => setShowLeadForm(true);
  
  const handleClose = () => {
    setShowLeadForm(false);
    setShowDownloadInterface(false);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full flex flex-col">
      {/* Main card: Use h-full to fill parent's constrained height */}
      <div className="bg-slate-800 dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row h-full">
        {/* Left Column: Content */}
        <div className="w-full md:w-3/5 md:h-full overflow-y-auto p-6 md:p-8 flex flex-col space-y-6 text-slate-100">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{template.title}</h1>
          {template.template_date && (
            <p className="text-sm text-slate-400">
              Published: {new Date(template.template_date + 'T00:00:00').toLocaleDateString()}
            </p>
          )}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-100 mb-2">Description</h2>
            <p className="text-slate-300 leading-relaxed">{template.description}</p>
          </section>
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-100 mb-2">Key Features</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {template.key_features.map((feature, index) => <li key={index}>{feature}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-100 mb-2">Who is this ideal for?</h2>
            <p className="text-slate-300 leading-relaxed">{template.icp}</p>
          </section>
          <div className="flex-grow"></div> 
          <div className="mt-auto pt-6 border-t border-slate-700">
            <Link href="/templates" className="text-sky-400 hover:text-sky-300 hover:underline">&larr; Back to all templates</Link>
          </div>
        </div>
        
        {/* Right Column: Media and Main Download Button */}
        <div className="w-full md:w-2/5 p-4 md:p-8 bg-slate-700/50 dark:bg-slate-800/50 flex flex-col space-y-4">
          {/* Accordion Toggle for Video Section (Mobile Only) */}
          {(template.youtube_url || template.video_description) && (
            <button 
              onClick={() => setIsVideoSectionOpen(!isVideoSectionOpen)}
              className="md:hidden w-full flex justify-between items-center p-3 bg-slate-600 hover:bg-slate-500 rounded-md text-slate-100 font-medium mb-2"
            >
              <span>Video & Highlights</span>
              {isVideoSectionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}

          {/* Collapsible Video Section Wrapper */}
          <div className={`${isVideoSectionOpen ? 'block' : 'hidden'} md:block space-y-4`}>
            {template.youtube_url ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${template.youtube_url.split('v=')[1]?.split('&')[0] || template.youtube_url.split('/').pop()}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-lg bg-slate-600 flex items-center justify-center text-slate-400 flex-shrink-0">
                <p className="p-4 text-center">No video preview available.</p>
              </div>
            )}
            {template.video_description && (
              <div className="bg-slate-600/70 dark:bg-slate-700/70 p-3 md:p-4 rounded-lg shadow-md flex-shrink-0">
                <h3 className="text-md lg:text-lg font-semibold mb-1 text-white">Video Highlights</h3>
                <p className="text-sm text-slate-300 whitespace-pre-line">{template.video_description}</p>
              </div>
            )}
          </div>

          <button onClick={handleDownloadClick} className="w-full bg-sky-500 text-white px-4 py-2.5 rounded-md hover:bg-sky-600 transition-colors text-base font-medium shadow-md flex-shrink-0 flex items-center justify-center gap-2 mt-auto">
            <DownloadCloud size={20} /> Access Template Files
          </button>
          {error && <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-2"><p className="text-red-200 text-sm">{error}</p></div>}
        </div>
      </div>
      
      {/* Overlay for lead form or download interface */}
      {(showLeadForm || showDownloadInterface) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          {showLeadForm && <ContactForm onSubmit={handleLeadSubmit} onCancel={handleClose} templateSlug={template.slug} templateTitle={template.title} isSubmitting={isSubmitting} />}
          {showDownloadInterface && <DownloadInterface files={files} onClose={handleClose} downloadZip={downloadAllAsZip} isDownloadingZip={isDownloadingZip} downloadIndividualFile={downloadIndividualFile} isDownloadingIndividualFile={isDownloadingIndividualFile} />}
        </div>
      )}
    </div>
  );
} 
