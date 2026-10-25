import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import {
  HODReportData,
  fetchHODReports,
} from '../utils/api';

export const HODReportsPage: React.FC = () => {
  const [data, setData] = useState<HODReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchHODReports()
      .then((res) => setData(res))
      .catch((err: any) => setErrorMsg(err.message || 'Failed to load report data'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadCSV = () => {
    if (!data) return;
    setDownloading(true);

    try {
      const headers = [
        'Student Name',
        'Register Number',
        'Academic Year',
        'Section',
        'LeetCode Username',
        'Total Solved',
        'Easy Solved',
        'Medium Solved',
        'Hard Solved',
        'Placement Readiness Score',
        'Last Audit Date',
      ];

      const rows = data.records.map((r) => [
        `"${r.name}"`,
        r.registerNumber,
        r.year,
        r.section,
        r.leetcodeUsername || 'None',
        r.totalSolved,
        r.easySolved,
        r.mediumSolved,
        r.hardSolved,
        r.placementReadinessScore,
        r.lastAuditDate || 'N/A',
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `NEXORA_AIDS_Department_Coding_Report_${new Date().toISOString().split('T')[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download CSV error:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-medium">Compiling official department reports...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="neu-card p-6 rounded-2xl text-red-700 bg-red-50/50">
          <p className="text-xs font-semibold">{errorMsg || 'Failed to load reports'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-purple-700" />
            <span>Department Reports & CSV Export</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Download authorized student coding records and performance statistics for accreditation and review
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          disabled={downloading}
          className="neu-btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Downloading...' : 'Download Full Department CSV'}</span>
        </button>
      </div>

      {/* Report Specification Card */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Official Coding Intelligence Report
            </span>
            <span className="text-[11px] text-slate-500">
              Department of {data.department} · SRM RMP Campus
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 neu-inset px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5" />
            <span>Generated: {new Date(data.generatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-xl neu-inset">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Student Records</span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5 block">{data.totalRecords}</span>
          </div>

          <div className="p-3.5 rounded-xl neu-inset">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Export Format</span>
            <span className="text-xl font-bold text-blue-700 font-mono mt-0.5 block">CSV (Spreadsheet)</span>
          </div>

          <div className="p-3.5 rounded-xl neu-inset">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Accreditation Ready</span>
            <span className="text-xl font-bold text-emerald-700 font-mono mt-0.5 block">Verified</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed pt-1">
          This report contains individual problem-solving distributions (Easy, Medium, Hard), total solves, register numbers, and estimated technical placement readiness scores calculated through the department's verified modeling service.
        </p>
      </div>

      {/* Report Records Table Preview */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Export Preview (First 8 Records)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Previewing {Math.min(8, data.records.length)} of {data.totalRecords}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/70 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2 px-3">Student Name</th>
                <th className="py-2 px-3">Register No.</th>
                <th className="py-2 px-3">Cohort</th>
                <th className="py-2 px-3 text-right">Total Solved</th>
                <th className="py-2 px-3 text-right">Readiness Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-slate-700">
              {data.records.slice(0, 8).map((record, i) => (
                <tr key={`${record.registerNumber}-${i}`} className="hover:bg-slate-200/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {record.name}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">
                    {record.registerNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    Y{record.year} Sec {record.section}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {record.totalSolved}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                    {record.placementReadinessScore} / 100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
