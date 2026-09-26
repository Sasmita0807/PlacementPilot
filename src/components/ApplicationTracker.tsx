import React, { useState } from 'react';
import { ApplicationRecord, UserProfile } from '../types';
import {
  CheckSquare,
  Plus,
  Calendar,
  Building,
  Clock,
  Trash2,
  Edit2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface ApplicationTrackerProps {
  user: UserProfile;
  applications: ApplicationRecord[];
  onSaveApplication: (app: Partial<ApplicationRecord>) => Promise<ApplicationRecord[]>;
  onDeleteApplication: (id: string) => Promise<ApplicationRecord[]>;
}

const STATUS_COLUMNS = [
  'Applied',
  'Screening',
  'Technical Round',
  'HR Round',
  'Offered',
  'Rejected',
] as const;

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  user,
  applications,
  onSaveApplication,
  onDeleteApplication,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationRecord | null>(null);

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ApplicationRecord['status']>('Applied');
  const [stipendOrSalary, setStipendOrSalary] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [interviewDate, setInterviewDate] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpReminder, setFollowUpReminder] = useState('');

  const openCreateModal = () => {
    setEditingApp(null);
    setCompany('');
    setRole('');
    setStatus('Applied');
    setStipendOrSalary('');
    setAppliedDate(new Date().toISOString().split('T')[0]);
    setInterviewDate('');
    setNotes('');
    setFollowUpReminder('');
    setShowModal(true);
  };

  const openEditModal = (app: ApplicationRecord) => {
    setEditingApp(app);
    setCompany(app.company);
    setRole(app.role);
    setStatus(app.status);
    setStipendOrSalary(app.stipendOrSalary || '');
    setAppliedDate(app.appliedDate || '');
    setInterviewDate(app.interviewDate || '');
    setNotes(app.notes || '');
    setFollowUpReminder(app.followUpReminder || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    await onSaveApplication({
      ...(editingApp ? { id: editingApp.id } : {}),
      company,
      role,
      status,
      stipendOrSalary,
      appliedDate,
      interviewDate,
      notes,
      followUpReminder,
    });

    setShowModal(false);
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationRecord['status']) => {
    const target = applications.find((a) => a.id === appId);
    if (target) {
      await onSaveApplication({ ...target, status: newStatus });
    }
  };

  const totalCount = applications.length;
  const offeredCount = applications.filter((a) => a.status === 'Offered').length;
  const inInterviewCount = applications.filter(
    (a) => a.status === 'Technical Round' || a.status === 'HR Round'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Pipeline Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Application Tracker</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Track interview rounds, follow-up deadlines, and offer letters. Never miss an assessment link or scheduled technical round.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Applied</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">In Active Rounds</div>
          <div className="text-2xl font-black text-indigo-700 mt-1">{inInterviewCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Offers Received</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{offeredCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Offer Rate</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalCount > 0 ? `${Math.round((offeredCount / totalCount) * 100)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* View: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((col) => {
            const colApps = applications.filter((a) => a.status === col);
            return (
              <div
                key={col}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 flex flex-col min-w-[220px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-800">{col}</span>
                  <span className="w-5 h-5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px] pr-0.5">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs hover:border-indigo-300 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{app.company}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{app.role}</div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteApplication(app.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {app.stipendOrSalary && (
                        <div className="text-[10px] font-semibold text-emerald-700">
                          {app.stipendOrSalary}
                        </div>
                      )}

                      {app.interviewDate && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          <Calendar className="w-3 h-3 text-indigo-600" />
                          Interview: {app.interviewDate}
                        </div>
                      )}

                      {app.followUpReminder && (
                        <div className="text-[10px] text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Reminder: {app.followUpReminder}
                        </div>
                      )}

                      {/* Quick Status Dropdown */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 font-medium"
                        >
                          {STATUS_COLUMNS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs italic">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View: LIST VIEW */
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Key Dates</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{app.company}</td>
                    <td className="py-3 px-4 text-slate-700">{app.role}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          app.status === 'Offered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'Technical Round' || app.status === 'HR Round'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : app.status === 'Rejected'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{app.stipendOrSalary || '—'}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {app.interviewDate ? `Interview: ${app.interviewDate}` : `Applied: ${app.appliedDate}`}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(app)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {editingApp ? 'Edit Application' : 'Log New Application'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Atlassian"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. SDE Intern"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  >
                    {STATUS_COLUMNS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Compensation</label>
                  <input
                    type="text"
                    value={stipendOrSalary}
                    onChange={(e) => setStipendOrSalary(e.target.value)}
                    placeholder="e.g. ₹50,000/mo or ₹18 LPA"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Applied Date</label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Date (if set)</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-Up Reminder Date</label>
                <input
                  type="date"
                  value={followUpReminder}
                  onChange={(e) => setFollowUpReminder(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rounds Notes & Links</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key topics to review before round, portal login URL, recruiter contacts..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
