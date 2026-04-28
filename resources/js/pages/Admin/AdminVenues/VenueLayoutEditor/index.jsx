import React, { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import useLayoutStore from './useLayoutStore';
import EditorToolbar from './EditorToolbar';
import KonvaCanvas from './KonvaCanvas';
import SeatNode from './SeatNode'; // used by KonvaCanvas internally
import SectionPanel from './SectionPanel';
import SeatPropertiesPanel from './SeatPropertiesPanel';

export default function VenueLayoutEditor() {
    const { t } = useTranslation();
    const { id: venueId } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const init = useLayoutStore((s) => s.init);
    const saveDraft = useLayoutStore((s) => s.saveDraft);
    const isDirty = useLayoutStore((s) => s.isDirty);
    const selectedId = useLayoutStore((s) => s.selectedId);
    const deleteSeat = useLayoutStore((s) => s.deleteSeat);
    const clearSelection = useLayoutStore((s) => s.clearSelection);

    // Grab venue name from seats store if available, else fall back
    const seats = useLayoutStore((s) => s.seats);

    // Load layout on mount
    useEffect(() => {
        init(venueId);
    }, [venueId, init]);

    // Auto-save every 30s when there are unsaved changes
    useEffect(() => {
        if (!isDirty) return;
        const timer = setInterval(() => saveDraft(), 30_000);
        return () => clearInterval(timer);
    }, [isDirty, saveDraft]);

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedId && document.activeElement.tagName !== 'INPUT') {
                deleteSeat(selectedId);
            }
        }
        if (e.key === 'Escape') clearSelection();
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveDraft();
        }
    }, [selectedId, deleteSeat, clearSelection, saveDraft]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="min-h-screen bg-[#0c0c0c] flex flex-col">
            {/* Page header */}
            <div className="px-6 pt-6 pb-3">
                <button
                    onClick={() => navigate('/admin/venues')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
                >
                    <ArrowLeft size={15} />
                    {t('admin.venues.editor.back')}
                </button>
                <EditorToolbar venueName={`${t('admin.venues.type')} #${venueId}`} />
            </div>

            {/* Main canvas + sidebar */}
            <div className="flex flex-1 gap-4 px-6 pb-6 overflow-hidden">
                {/* Canvas area – horizontally scrollable for large stages */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-auto rounded-xl"
                    style={{ minHeight: 0 }}
                >
                    <KonvaCanvas containerRef={containerRef} />
                </div>

                {/* Right sidebar */}
                <div className="flex flex-col gap-4 w-64 shrink-0 overflow-y-auto">
                    <SectionPanel />
                    {selectedId && <SeatPropertiesPanel />}
                </div>
            </div>

            {/* Bottom hint bar */}
            <div className="px-6 py-2 border-t border-purple-900/20 bg-[#0c0c0c]">
                <p className="text-gray-700 text-xs">
                    <kbd className="bg-gray-800 px-1 rounded text-gray-500">Ctrl+S</kbd> {t('admin.venues.editor.saveDraft')} ·{' '}
                    <kbd className="bg-gray-800 px-1 rounded text-gray-500">Del</kbd> {t('admin.venues.editor.deleteSeat')} ·{' '}
                    <kbd className="bg-gray-800 px-1 rounded text-gray-500">Esc</kbd> {t('admin.venues.editor.deselect')} ·{' '}
                    <kbd className="bg-gray-800 px-1 rounded text-gray-500">Scroll</kbd> {t('admin.venues.editor.zoom')} ·{' '}
                    {t('admin.venues.editor.seats')}: <span className="text-purple-400">{seats.filter(s => s.type === 'seat').length}</span> ·{' '}
                    {t('admin.venues.editor.zones')}: <span className="text-cyan-400">{seats.filter(s => s.type === 'standing').length}</span>
                </p>
            </div>
        </div>
    );
}

