import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Armchair, Users, MousePointer2, Save, Rocket, Trash2, AlertCircle, ZoomIn, ZoomOut, Maximize2, Grid3X3 } from 'lucide-react';
import useLayoutStore from './useLayoutStore';

export default function EditorToolbar({ venueName }) {
    const { t } = useTranslation();

    const TOOLS = useMemo(() => [
        { id: 'select',   Icon: MousePointer2, label: t('admin.venues.editor.tools.select') },
        { id: 'seat',     Icon: Armchair,      label: t('admin.venues.editor.tools.addSeat') },
        { id: 'standing', Icon: Users,         label: t('admin.venues.editor.tools.addZone') },
    ], [t]);

    const selectedTool  = useLayoutStore((s) => s.selectedTool);
    const layoutStatus  = useLayoutStore((s) => s.layoutStatus);
    const isDirty       = useLayoutStore((s) => s.isDirty);
    const isSaving      = useLayoutStore((s) => s.isSaving);
    const isPublishing  = useLayoutStore((s) => s.isPublishing);
    const error         = useLayoutStore((s) => s.error);
    const selectedId    = useLayoutStore((s) => s.selectedId);
    const gridSnap      = useLayoutStore((s) => s.gridSnap);
    const stageScale    = useLayoutStore((s) => s.stageScale);

    const setTool       = useLayoutStore((s) => s.setTool);
    const saveDraft     = useLayoutStore((s) => s.saveDraft);
    const publish       = useLayoutStore((s) => s.publish);
    const deleteSeat    = useLayoutStore((s) => s.deleteSeat);
    const toggleGridSnap = useLayoutStore((s) => s.toggleGridSnap);
    const zoomIn        = useLayoutStore((s) => s.zoomIn);
    const zoomOut       = useLayoutStore((s) => s.zoomOut);
    const zoomReset     = useLayoutStore((s) => s.zoomReset);

    const [publishResult, setPublishResult] = useState(null);

    const handlePublish = async () => {
        setPublishResult(null);
        const result = await publish();
        setPublishResult(result);
        if (result.success) {
            setTimeout(() => setPublishResult(null), 3000);
        }
    };

    const statusBadge = {
        none:      { text: t('admin.venues.editor.noLayout'),  cls: 'bg-gray-700 text-gray-300' },
        draft:     { text: t('admin.venues.editor.draft'),      cls: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50' },
        published: { text: t('admin.venues.editor.published'),  cls: 'bg-green-900/50 text-green-300 border border-green-700/50' },
    }[layoutStatus] ?? { text: layoutStatus, cls: 'bg-gray-700 text-gray-300' };

    return (
        <div className="flex flex-col gap-3">
            {/* Top bar */}
            <div className="flex items-center justify-between bg-[#12122a] border border-purple-900/30 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-white font-semibold text-sm">{venueName ?? t('admin.venues.editor.title')}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge.cls}`}>
                        {statusBadge.text}
                    </span>

                    {/* Active Section Hint */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-purple-900/20 border border-purple-500/20 rounded-lg ml-2">
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{t('admin.venues.editor.targetSection')}:</span>
                        <span className="text-xs text-white font-medium">
                            {useLayoutStore.getState().sections.find(s => s.id === useLayoutStore.getState().activeSectionId)?.label || 'None'}
                        </span>
                    </div>

                    {isDirty && (
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                            {t('admin.venues.editor.unsavedChanges')}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Save Draft */}
                    <button
                        onClick={saveDraft}
                        disabled={isSaving || !isDirty}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Save size={13} />
                        {isSaving ? t('admin.venues.editor.saving') : t('admin.venues.editor.saveDraft')}
                    </button>

                    {/* Publish */}
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg text-xs font-semibold transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50"
                    >
                        <Rocket size={13} />
                        {isPublishing ? t('admin.venues.editor.publishing') : t('admin.venues.editor.publish')}
                    </button>
                </div>
            </div>

            {/* Tool palette */}
            <div className="flex items-center gap-2 bg-[#12122a] border border-purple-900/30 rounded-xl px-3 py-2">
                {TOOLS.map(({ id, Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setTool(id)}
                        title={label}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedTool === id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                                : 'text-gray-400 hover:bg-purple-900/30 hover:text-gray-200'
                        }`}
                    >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}

                <div className="w-px h-5 bg-purple-900/40 mx-1" />

                {/* Delete selected */}
                <button
                    onClick={() => selectedId && deleteSeat(selectedId)}
                    disabled={!selectedId}
                    title={`${t('admin.venues.editor.tools.delete')} (Del)`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-900/25 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">{t('admin.venues.editor.tools.delete')}</span>
                </button>

                <div className="w-px h-5 bg-purple-900/40 mx-1" />

                {/* Grid snap toggle */}
                <button
                    onClick={toggleGridSnap}
                    title={t('admin.venues.editor.tools.grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        gridSnap
                            ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/40'
                            : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                >
                    <Grid3X3 size={14} />
                    <span className="hidden sm:inline">{t('admin.venues.editor.tools.grid')}</span>
                </button>

                <div className="w-px h-5 bg-purple-900/40 mx-1" />

                {/* Zoom controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={zoomOut}
                        title={t('admin.venues.editor.tools.zoomOut')}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-900/30 hover:text-gray-200 transition-colors"
                    >
                        <ZoomOut size={14} />
                    </button>

                    <span className="text-xs text-purple-400 font-mono min-w-[40px] text-center">
                        {Math.round(stageScale * 100)}%
                    </span>

                    <button
                        onClick={zoomIn}
                        title={t('admin.venues.editor.tools.zoomIn')}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-900/30 hover:text-gray-200 transition-colors"
                    >
                        <ZoomIn size={14} />
                    </button>

                    <button
                        onClick={zoomReset}
                        title={t('admin.venues.editor.tools.zoomReset')}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-900/30 hover:text-gray-200 transition-colors"
                    >
                        <Maximize2 size={14} />
                    </button>
                </div>

                <div className="ml-auto text-xs text-gray-600 italic hidden md:block">
                    {t('admin.venues.editor.tools.hint')}
                </div>
            </div>

            {/* Error banner */}
            {(error || (publishResult && !publishResult.success)) && (
                <div className="flex items-center gap-2 bg-red-900/25 border border-red-700/40 text-red-300 px-4 py-2 rounded-xl text-sm">
                    <AlertCircle size={15} className="shrink-0" />
                    {error ?? publishResult?.message}
                </div>
            )}

            {/* Success banner */}
            {publishResult?.success && (
                <div className="bg-green-900/25 border border-green-700/40 text-green-300 px-4 py-2 rounded-xl text-sm">
                    ✓ {t('admin.venues.editor.publishSuccess')}
                </div>
            )}
        </div>
    );
}

