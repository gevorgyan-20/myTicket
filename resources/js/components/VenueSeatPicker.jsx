import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Group, Text, Shape, Label, Tag } from 'react-konva';
import { getPublishedLayout } from '../api/VenueService';
import { useTranslation } from 'react-i18next';

// ── Seat colours by availability ──────────────

const FILL = {
    available: (sectionColor) => sectionColor ?? '#7C3AED',
    reserved:  () => '#374151',
    selected:  () => '#10B981',
    locked:    () => 'rgba(239, 68, 68, 0.5)',
};

const SEAT_SIZE = 30;
const MIN_SCALE = 0.3;
const MAX_SCALE = 3;

// ── Chair drawing function (same as editor) ──────────────────────────────────

function drawChair(ctx, size, fill, strokeColor, strokeWidth, isSelected, isLocked) {
    const s = size;
    const half = s / 2;

    // Backrest
    const brX = -half + 3, brY = -half + 1, brW = s - 6, brH = s * 0.38, brR = 5;
    ctx.beginPath();
    ctx.moveTo(brX + brR, brY);
    ctx.lineTo(brX + brW - brR, brY);
    ctx.quadraticCurveTo(brX + brW, brY, brX + brW, brY + brR);
    ctx.lineTo(brX + brW, brY + brH);
    ctx.lineTo(brX, brY + brH);
    ctx.lineTo(brX, brY + brR);
    ctx.quadraticCurveTo(brX, brY, brX + brR, brY);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = isLocked ? '#ef4444' : strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Seat cushion
    const csX = -half + 1, csY = brY + brH + 2, csW = s - 2, csH = s * 0.32, csR = 4;
    ctx.beginPath();
    ctx.moveTo(csX + csR, csY);
    ctx.lineTo(csX + csW - csR, csY);
    ctx.quadraticCurveTo(csX + csW, csY, csX + csW, csY + csR);
    ctx.lineTo(csX + csW, csY + csH - csR);
    ctx.quadraticCurveTo(csX + csW, csY + csH, csX + csW - csR, csY + csH);
    ctx.lineTo(csX + csR, csY + csH);
    ctx.quadraticCurveTo(csX, csY + csH, csX, csY + csH - csR);
    ctx.lineTo(csX, csY + csR);
    ctx.quadraticCurveTo(csX, csY, csX + csR, csY);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.globalAlpha = 0.75;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = isLocked ? '#ef4444' : strokeColor;
    ctx.lineWidth = strokeWidth * 0.8;
    ctx.stroke();

    // Armrests
    const armW = 3, armH = brH + 2 + csH - 2, armY = brY + 3;
    ctx.beginPath(); ctx.roundRect(-half, armY, armW, armH, 2);
    ctx.fillStyle = fill; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.roundRect(half - armW, armY, armW, armH, 2);
    ctx.fillStyle = fill; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;

    // Locked X
    if (isLocked) {
        ctx.beginPath();
        ctx.moveTo(-half + 8, -half + 10);
        ctx.lineTo(half - 8, half - 6);
        ctx.moveTo(half - 8, -half + 10);
        ctx.lineTo(-half + 8, half - 6);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Selection glow
    if (isSelected) {
        ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.roundRect(-half, -half, s, s, 6);
        ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2; ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// ── Standing zone (customer) ─────────────────────────────────────────────────

function StandingZoneNode({ zone, section, status, isSelected, onClick, isDisabled, isLocked }) {
    const fill = isSelected ? FILL.selected() : (status === 'reserved' || isLocked) ? (isLocked ? FILL.locked() : FILL.reserved()) : FILL.available(section?.color);

    return (
        <Group
            x={zone.x} y={zone.y}
            onClick={() => status !== 'reserved' && !isDisabled && !isLocked && onClick(zone)}
            onTap={() => status !== 'reserved' && !isDisabled && !isLocked && onClick(zone)}
            opacity={isDisabled ? 0.2 : (status === 'reserved' ? 0.4 : (isLocked ? 0.6 : 0.55))}
        >
            <Rect
                width={zone.width || 120}
                height={zone.height || 80}
                fill={fill}
                stroke={isSelected ? '#a78bfa' : (isLocked ? '#ef4444' : 'rgba(255,255,255,0.2)')}
                strokeWidth={isSelected ? 3 : 1}
                dash={(status === 'reserved' || isDisabled || isLocked) ? [5, 5] : []}
                cornerRadius={4}
            />
            <Text
                text={isDisabled ? 'CLOSED' : (isLocked ? 'LOCKED' : (isSelected ? 'SELECTED' : status === 'reserved' ? 'FULL' : (zone.label || 'G')))}
                width={zone.width || 120}
                height={zone.height || 80}
                align="center"
                verticalAlign="middle"
                fill="#fff"
                fontSize={12}
                fontStyle="bold"
            />
        </Group>
    );
}

// ── Seat node (customer) ─────────────────────────────────────────────────────

function SeatNode({ seat, section, status, isSelected, onClick, isDisabled, isLocked }) {
    const fill = isSelected ? FILL.selected() : (status === 'reserved' || isLocked) ? (isLocked ? FILL.locked() : FILL.reserved()) : FILL.available(section?.color);
    const sColor = isSelected ? '#a78bfa' : (isLocked ? '#ef4444' : 'rgba(255,255,255,0.15)');
    const sWidth = isSelected ? 2.5 : 1;

    return (
        <Group
            x={seat.x} y={seat.y}
            rotation={seat.rotation}
            onClick={() => status !== 'reserved' && !isDisabled && !isLocked && onClick(seat)}
            onTap={() => status !== 'reserved' && !isDisabled && !isLocked && onClick(seat)}
            opacity={isDisabled ? 0.15 : (status === 'reserved' ? 0.45 : 1)}
        >
            <Shape
                sceneFunc={(ctx, shape) => {
                    drawChair(ctx, SEAT_SIZE, fill, sColor, sWidth, isSelected, isLocked);
                    ctx.fillStrokeShape(shape);
                }}
                hitFunc={(ctx, shape) => {
                    ctx.beginPath();
                    ctx.rect(-SEAT_SIZE / 2, -SEAT_SIZE / 2, SEAT_SIZE, SEAT_SIZE);
                    ctx.closePath();
                    ctx.fillStrokeShape(shape);
                }}
            />
            <Text
                text={seat.label}
                x={-SEAT_SIZE / 2}
                y={SEAT_SIZE * 0.15}
                width={SEAT_SIZE}
                fontSize={seat.label?.length > 3 ? 7 : 9}
                fill="#fff"
                fontFamily="Inter, sans-serif"
                fontStyle="bold"
                align="center"
                listening={false}
            />
        </Group>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function VenueSeatPicker({ 
    venueId, 
    showtimeId, 
    reservedSeatIds = [], 
    enrichedSeats = [], 
    onSelectionChange, 
    userBoughtCount = 0,
    lockedByOthers = [],
    onBroadcastLock
}) {
    const { t } = useTranslation();
    const [layout, setLayout]     = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [selected, setSelected] = useState([]); // Array of IDs

    const [activeTooltip, setActiveTooltip] = useState(null);

    // Zoom & pan state
    const stageRef = useRef(null);
    const [scale, setScale]   = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    // Responsive scaling
    const [containerWidth, setContainerWidth] = useState(Math.min(window.innerWidth - 48, 900));

    useEffect(() => {
        const handleResize = () => {
            setContainerWidth(Math.min(window.innerWidth - 48, 900));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setLoading(true);
        getPublishedLayout(venueId, showtimeId)
            .then(({ data }) => {
                setLayout(data);
                // Initial zoom set to 100% (1:1 scale)
                const initialScale = 1;
                setScale(initialScale);
                
                // Center horizontally
                const initialX = (containerWidth - data.canvas_width * initialScale) / 2;
                setStagePos({ x: initialX, y: 0 });
            })
            .catch(() => setError('Seat map not available for this venue.'))
            .finally(() => setLoading(false));
    }, [venueId, showtimeId, containerWidth]);

    const handleSeatClick = (seat) => {
        const enriched = enrichedSeats.find(s => s.id === seat.id);
        if (enriched?.is_disabled) return;

        if (seat.type === 'standing') {
            if (!layout.has_standing) return;

            const availableQty = enriched ? enriched.available_qty : 100;
            const currentQty = selected.filter(id => id === seat.id).length;
            const otherCartCount = selected.length - currentQty;
            const maxAllowed = Math.min(availableQty, 5 - userBoughtCount - otherCartCount);

            if (maxAllowed <= 0 && currentQty === 0) return; // Cannot buy

            const stage = stageRef.current;
            const scale = stage.scaleX();
            const screenX = seat.x * scale + stage.x();
            const screenY = seat.y * scale + stage.y(); // slightly above

            setActiveTooltip({
                seatId: seat.id,
                x: screenX,
                y: screenY,
                maxQty: maxAllowed,
                qty: currentQty || 1,
            });
            return;
        }

        const currentCartCount = selected.length;
        setSelected((prev) => {
            const isSelected = prev.includes(seat.id);
            if (isSelected) {
                const next = prev.filter(id => id !== seat.id);
                onSelectionChange?.(next);
                onBroadcastLock?.(seat.id, false);
                return next;
            } else {
                if (currentCartCount + userBoughtCount >= 5) return prev; // Limit reached
                const next = [...prev, seat.id];
                onSelectionChange?.(next);
                onBroadcastLock?.(seat.id, true);
                return next;
            }
        });
    };

    // Wheel zoom
    const handleWheel = useCallback((e) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const factor = 1.08;
        let newScale = direction > 0 ? oldScale * factor : oldScale / factor;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        setScale(newScale);
        setStagePos({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            Loading seat map…
        </div>
    );

    if (error) return (
        <div className="text-red-400 text-sm text-center py-8">{error}</div>
    );

    const sectionMap = Object.fromEntries(layout.sections.map((s) => [s.id, s]));
    const reservedSet = new Set(reservedSeatIds);

    return (
        <div className="flex flex-col gap-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                {layout.sections.map((sec) => (
                    <span key={sec.id} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ background: sec.color }} />
                        {sec.label}
                        {sec.price != null && (
                            <span className="text-gray-400 font-semibold">{sec.price} ֏</span>
                        )}
                    </span>
                ))}
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block bg-gray-600 opacity-50" />
                    Reserved
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block bg-red-500 opacity-50" />
                    Being selected
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                    Your selection ({selected.length})
                </span>
            </div>

            {/* Hint */}
            <div className="text-xs text-gray-600 italic">
                Scroll to zoom · Drag to pan · Click seat to select
            </div>

            {/* Canvas */}
            <div
                style={{
                    width:        containerWidth,
                    height:       Math.max(500, layout.canvas_height * (containerWidth / layout.canvas_width)),
                    background:   '#0d0d1a',
                    borderRadius: 12,
                    border:       '1px solid rgba(124,58,237,0.2)',
                    overflow:     'hidden',
                    position:     'relative',
                    cursor:       'grab',
                }}
            >
                <Stage
                    ref={stageRef}
                    width={containerWidth}
                    height={Math.max(500, layout.canvas_height * (containerWidth / layout.canvas_width))}
                    scaleX={scale}
                    scaleY={scale}
                    x={stagePos.x}
                    y={stagePos.y}
                    onWheel={handleWheel}
                    draggable
                    onDragEnd={(e) => {
                        if (e.target === stageRef.current) {
                            setStagePos({ x: e.target.x(), y: e.target.y() });
                        }
                    }}
                >
                    <Layer>
                        {/* Stage label */}
                        <Group y={8} x={layout.canvas_width / 2 - 80}>
                            <Rect
                                width={160} height={32}
                                fill="#7C3AED"
                                cornerRadius={[8, 8, 18, 18]}
                                opacity={0.7}
                            />
                            <Text
                                text={t('admin.venues.editor.stage') || 'S T A G E'}
                                width={160} height={32}
                                align="center" verticalAlign="middle"
                                fill="#fff" fontSize={12} fontStyle="bold" fontFamily="Inter, sans-serif"
                            />
                        </Group>

                        {layout.seats.map((seat) => {
                            const enriched = enrichedSeats.find(s => s.id === seat.id);
                            const status = enriched ? enriched.status : (reservedSet.has(seat.id) ? 'reserved' : 'available');
                            const isDisabled = enriched ? enriched.is_disabled : false;
                            const isLocked = lockedByOthers.includes(String(seat.id));

                            if (seat.type === 'standing') {
                                if (!layout.has_standing) return null;
                                
                                return (
                                    <StandingZoneNode
                                        key={seat.id}
                                        zone={seat}
                                        section={sectionMap[seat.section_id] ?? null}
                                        status={status}
                                        isSelected={selected.includes(seat.id)}
                                        onClick={handleSeatClick}
                                        isDisabled={isDisabled}
                                        isLocked={isLocked}
                                    />
                                );
                            }

                            return (
                                <SeatNode
                                    key={seat.id}
                                    seat={seat}
                                    section={sectionMap[seat.section_id] ?? null}
                                    status={status}
                                    isSelected={selected.includes(seat.id)}
                                    onClick={handleSeatClick}
                                    isDisabled={isDisabled}
                                    isLocked={isLocked}
                                />
                            );
                        })}
                    </Layer>
                </Stage>

                {/* Zoom badge */}
                <div
                    style={{
                        position: 'absolute', bottom: 6, right: 8,
                        background: 'rgba(12,12,12,0.8)',
                        border: '1px solid rgba(124,58,237,0.3)',
                        borderRadius: 6, padding: '2px 8px',
                        color: '#a78bfa', fontSize: 10, fontWeight: 600,
                        pointerEvents: 'none',
                    }}
                >
                    {Math.round(scale * 100)}%
                </div>

                {/* Tooltip Overlay */}
                {activeTooltip && (
                    <div
                        style={{
                            position: 'absolute',
                            left: activeTooltip.x,
                            top: activeTooltip.y,
                            transform: 'translate(-50%, -100%)',
                            marginTop: '-10px',
                            background: '#12122a',
                            border: '1px solid rgba(124,58,237,0.5)',
                            borderRadius: '8px',
                            padding: '10px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            color: 'white',
                            width: '240px',
                            minWidth: '240px',
                        }}
                    >
                        <span className="text-xs font-semibold text-gray-300">Ticket Quantity</span>
                        <select 
                            value={activeTooltip.qty} 
                            onChange={(e) => setActiveTooltip({...activeTooltip, qty: parseInt(e.target.value)})}
                            className="bg-[#0c0c1a] border border-purple-500/30 rounded-lg p-2 text-sm outline-none w-full text-white transition-colors focus:border-purple-500"
                        >
                            <option value={0}>0 ({t('common.remove') || 'Remove'})</option>
                            {Array.from({length: activeTooltip.maxQty}).map((_, i) => (
                                <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                        </select>
                        <div className="flex gap-2 mt-1">
                            <button 
                                onClick={() => setActiveTooltip(null)}
                                className="flex-1 py-2 px-3 text-xs text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 rounded-lg transition-all"
                            >
                                {t('common.cancel') || 'Cancel'}
                            </button>
                            <button 
                                onClick={() => {
                                    setSelected(prev => {
                                        const next = prev.filter(id => id !== activeTooltip.seatId);
                                        for(let i=0; i<activeTooltip.qty; i++) next.push(activeTooltip.seatId);
                                        onSelectionChange?.(next);
                                        return next;
                                    });
                                    setActiveTooltip(null);
                                }}
                                className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs text-white font-bold transition-all shadow-lg shadow-purple-900/20"
                            >
                                {t('common.ok') || 'OK'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
