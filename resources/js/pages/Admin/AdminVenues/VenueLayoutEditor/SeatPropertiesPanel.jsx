import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Tag, Type } from 'lucide-react';
import useLayoutStore from './useLayoutStore';

const SEAT_TYPES = ['seat', 'standing'];

export default function SeatPropertiesPanel() {
    const { t } = useTranslation();
    const selectedId = useLayoutStore((s) => s.selectedId);
    const seats      = useLayoutStore((s) => s.seats);
    const sections   = useLayoutStore((s) => s.sections);
    const updateSeat = useLayoutStore((s) => s.updateSeat);

    const seat = seats.find((s) => s.id === selectedId);
    if (!seat) return null;

    return (
        <div className="bg-[#12122a] border border-purple-900/30 rounded-xl p-4 flex flex-col gap-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wide">{t('admin.venues.editor.properties.title')}</h4>

            {/* Label */}
            <div>
                <label className="text-gray-500 text-xs mb-1 block flex items-center gap-1">
                    <Type size={10} /> {t('admin.venues.editor.properties.label')}
                </label>
                <input
                    value={seat.label}
                    onChange={(e) => updateSeat(seat.id, { label: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#0d0d1a] border border-purple-900/30 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-purple-500"
                />
            </div>

            {/* Type */}
            <div>
                <label className="text-gray-500 text-xs mb-1 block">{t('admin.venues.editor.properties.type')}</label>
                <div className="flex gap-1">
                    {SEAT_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => updateSeat(seat.id, { type: type })}
                            className={`flex-1 py-1 px-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                                seat.type === type
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-[#0d0d1a] text-gray-400 hover:bg-purple-900/30'
                            }`}
                        >
                            {type === 'seat' ? t('admin.venues.editor.seats') : t('admin.venues.editor.zones')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section */}
            <div>
                <label className="text-gray-500 text-xs mb-1 block flex items-center gap-1">
                    <Tag size={10} /> {t('admin.venues.editor.properties.section')}
                </label>
                <select
                    value={seat.section_id ?? ''}
                    onChange={(e) => updateSeat(seat.id, { section_id: e.target.value || null })}
                    className="w-full px-2 py-1.5 bg-[#0d0d1a] border border-purple-900/30 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-purple-500"
                >
                    {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>{sec.label}</option>
                    ))}
                </select>
            </div>

            {/* Capacity (Standing Only) */}
            {seat.type === 'standing' && (
                <div>
                    <label className="text-gray-500 text-xs mb-1 block flex items-center gap-1">
                        {t('admin.venues.editor.properties.capacity')}
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={seat.capacity || 100}
                        onChange={(e) => updateSeat(seat.id, { capacity: parseInt(e.target.value) || 1 })}
                        className="w-full px-2 py-1.5 bg-[#0d0d1a] border border-purple-900/30 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-purple-500"
                    />
                </div>
            )}

            {/* Rotation */}
            <div>
                <label className="text-gray-500 text-xs mb-1 block flex items-center gap-1">
                    <RotateCcw size={10} /> {t('admin.venues.editor.properties.rotation')} ({seat.rotation}°)
                </label>
                <input
                    type="range"
                    min={0} max={359} step={15}
                    value={seat.rotation}
                    onChange={(e) => updateSeat(seat.id, { rotation: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                />
            </div>

            {/* Coordinates (read-only) */}
            <div className="flex gap-2 text-gray-600 text-xs border-t border-purple-900/20 pt-2">
                <span>x: <span className="text-gray-400">{seat.x}</span></span>
                <span>y: <span className="text-gray-400">{seat.y}</span></span>
            </div>
        </div>
    );
}

