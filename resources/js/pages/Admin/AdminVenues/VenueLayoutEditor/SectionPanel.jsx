import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import useLayoutStore from './useLayoutStore';

const PRESET_COLORS = [
    '#7C3AED', '#2563EB', '#16A34A', '#DC2626',
    '#D97706', '#0891B2', '#BE185D', '#9333EA',
];

export default function SectionPanel() {
    const { t } = useTranslation();
    const sections       = useLayoutStore((s) => s.sections);
    const activeSectionId = useLayoutStore((s) => s.activeSectionId);
    const seats          = useLayoutStore((s) => s.seats);

    const addSection     = useLayoutStore((s) => s.addSection);
    const updateSection  = useLayoutStore((s) => s.updateSection);
    const deleteSection  = useLayoutStore((s) => s.deleteSection);
    const setActiveSection = useLayoutStore((s) => s.setActiveSection);

    const [expandedId, setExpandedId] = useState(null);

    const seatCountFor = (secId) => seats.filter((s) => s.section_id === secId).length;

    return (
        <div className="w-64 shrink-0 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h3 className="text-white text-sm font-semibold">{t('admin.venues.editor.sections.title')}</h3>
                <button
                    onClick={() => addSection(`${t('admin.venues.editor.sections.sectionName')} ${sections.length + 1}`)}
                    className="flex items-center gap-1 px-2 py-1 bg-purple-700/40 hover:bg-purple-700/70 text-purple-300 rounded-lg text-xs font-medium transition-colors"
                >
                    <Plus size={12} /> {t('admin.venues.editor.sections.add')}
                </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {sections.length === 0 && (
                    <p className="text-gray-600 text-xs italic text-center py-4 whitespace-pre-line">
                        {t('admin.venues.editor.sections.noSections')}
                    </p>
                )}

                {sections.map((sec) => {
                    const isActive   = sec.id === activeSectionId;
                    const isExpanded = expandedId === sec.id;

                    return (
                        <div
                            key={sec.id}
                            className={`rounded-xl border transition-all ${
                                isActive
                                    ? 'border-purple-500/50 bg-purple-900/20'
                                    : 'border-purple-900/20 bg-[#12122a]'
                            }`}
                        >
                            {/* Header row */}
                            <div
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                                onClick={() => setActiveSection(sec.id)}
                            >
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ background: sec.color }}
                                />
                                <span className="text-gray-200 text-xs font-medium flex-1 truncate">
                                    {sec.label}
                                </span>
                                <span className="text-gray-500 text-xs">{seatCountFor(sec.id)}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : sec.id); }}
                                    className="text-gray-500 hover:text-gray-300"
                                >
                                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                </button>
                            </div>

                            {/* Expanded edit panel */}
                            {isExpanded && (
                                <div className="px-3 pb-3 flex flex-col gap-2 border-t border-purple-900/20 pt-2">
                                    {/* Label */}
                                    <input
                                        value={sec.label}
                                        onChange={(e) => updateSection(sec.id, { label: e.target.value })}
                                        className="w-full px-2 py-1 bg-[#0d0d1a] border border-purple-900/30 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-purple-500"
                                        placeholder={t('admin.venues.editor.sections.sectionName')}
                                    />

                                    {/* Color picker */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {PRESET_COLORS.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => updateSection(sec.id, { color: c })}
                                                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                                                    sec.color === c ? 'border-white scale-110' : 'border-transparent'
                                                }`}
                                                style={{ background: c }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={sec.color}
                                            onChange={(e) => updateSection(sec.id, { color: e.target.value })}
                                            className="w-5 h-5 rounded-full bg-transparent border-0 cursor-pointer"
                                            title={t('admin.venues.editor.sections.customColor') ?? 'Custom colour'}
                                        />
                                    </div>

                                     {/* Delete (disabled if last section) */}
                                    <button
                                        onClick={() => deleteSection(sec.id)}
                                        disabled={sections.length <= 1}
                                        className={`flex items-center gap-1 text-xs mt-1 ${
                                            sections.length <= 1
                                                ? 'text-gray-600 cursor-not-allowed'
                                                : 'text-red-400 hover:text-red-300'
                                        }`}
                                        title={sections.length <= 1 ? t('admin.venues.editor.sections.cannotDeleteLast') : t('admin.venues.editor.sections.deleteSection')}
                                    >
                                        <Trash2 size={11} />{sections.length <= 1 ? t('admin.venues.editor.sections.cannotDeleteLast') : t('admin.venues.editor.sections.deleteSection')}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

