import React, { useRef, useCallback, useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Label, Tag } from 'react-konva';
import { useTranslation } from 'react-i18next';
import useLayoutStore from './useLayoutStore';
import SeatNode from './SeatNode';
import StandingZoneNode from './StandingZoneNode';

const GRID = 30;
const MIN_SCALE = 0.2;
const MAX_SCALE = 3;

// ── Grid lines ────────────────────────────────────────────────────────────────

function GridLines({ width, height }) {
    const lines = [];
    for (let x = 0; x <= width; x += GRID) {
        lines.push(<Line key={`v-${x}`} points={[x, 0, x, height]} stroke="#1e1e3a" strokeWidth={1} />);
    }
    for (let y = 0; y <= height; y += GRID) {
        lines.push(<Line key={`h-${y}`} points={[0, y, width, y]} stroke="#1e1e3a" strokeWidth={1} />);
    }
    return <>{lines}</>;
}

// ── Stage label ───────────────────────────────────────────────────────────────

function StageLabel({ canvasWidth }) {
    const { t } = useTranslation();
    const stageBarH = 36;
    return (
        <Group y={8} x={canvasWidth / 2 - 80}>
            <Rect
                width={160}
                height={stageBarH}
                fill="#7C3AED"
                cornerRadius={[8, 8, 18, 18]}
                opacity={0.85}
                shadowColor="#7C3AED"
                shadowBlur={20}
                shadowOpacity={0.4}
            />
            <Text
                text={t('admin.venues.editor.stage') || 'S T A G E'}
                width={160}
                height={stageBarH}
                align="center"
                verticalAlign="middle"
                fill="#fff"
                fontSize={13}
                fontStyle="bold"
                fontFamily="Inter, sans-serif"
                letterSpacing={3}
            />
        </Group>
    );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function SeatTooltip({ seat, section }) {
    if (!seat) return null;
    const tipText = `${seat.label}${section ? ` · ${section.label}` : ''}`;
    return (
        <Label x={seat.x + 18} y={seat.y - 18}>
            <Tag
                fill="#1a1a2e"
                stroke="#7C3AED"
                strokeWidth={1}
                cornerRadius={5}
                pointerDirection="down"
                pointerWidth={8}
                pointerHeight={5}
                shadowColor="black"
                shadowBlur={6}
                shadowOpacity={0.4}
            />
            <Text
                text={tipText}
                fill="#e2e8f0"
                fontSize={11}
                fontFamily="Inter, sans-serif"
                padding={5}
            />
        </Label>
    );
}

// ── Main canvas ───────────────────────────────────────────────────────────────

export default function KonvaCanvas({ containerRef }) {
    const stageRef = useRef(null);

    const seats = useLayoutStore((s) => s.seats);
    const sections = useLayoutStore((s) => s.sections);
    const selectedId = useLayoutStore((s) => s.selectedId);
    const selectedTool = useLayoutStore((s) => s.selectedTool);
    const canvasWidth = useLayoutStore((s) => s.canvasWidth);
    const canvasHeight = useLayoutStore((s) => s.canvasHeight);
    const gridSnap = useLayoutStore((s) => s.gridSnap);
    const hoveredSeatId = useLayoutStore((s) => s.hoveredSeatId);

    // Zoom & pan state
    const stageScale = useLayoutStore((s) => s.stageScale);
    const stageX = useLayoutStore((s) => s.stageX);
    const stageY = useLayoutStore((s) => s.stageY);

    const addSeat = useLayoutStore((s) => s.addSeat);
    const addZone = useLayoutStore((s) => s.addZone);
    const updateSeat = useLayoutStore((s) => s.updateSeat);
    const moveSeat = useLayoutStore((s) => s.moveSeat);
    const selectSeat = useLayoutStore((s) => s.selectSeat);
    const clearSelection = useLayoutStore((s) => s.clearSelection);
    const setStageScale = useLayoutStore((s) => s.setStageScale);
    const setStagePosition = useLayoutStore((s) => s.setStagePosition);
    const setHoveredSeat = useLayoutStore((s) => s.setHoveredSeat);

    // Section colour lookup
    const sectionMap = React.useMemo(
        () => Object.fromEntries(sections.map((s) => [s.id, s])),
        [sections]
    );

    // Hovered seat data for tooltip
    const hoveredSeat = hoveredSeatId ? seats.find(s => s.id === hoveredSeatId) : null;
    const hoveredSection = hoveredSeat ? sectionMap[hoveredSeat.section_id] ?? null : null;

    // ── Wheel zoom ───────────────────────────────────────────────
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

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        setStageScale(newScale);
        setStagePosition(newPos.x, newPos.y);
    }, [setStageScale, setStagePosition]);

    // ── Click to place / select ──────────────────────────────────
    const handleStageClick = useCallback((e) => {
        if (e.target === e.target.getStage() || e.target.name() === 'grid') {
            if (selectedTool === 'seat') {
                const stage = stageRef.current;
                const pos = stage.getPointerPosition();
                // Convert screen coords to canvas coords (accounting for zoom/pan)
                const canvasPos = {
                    x: (pos.x - stage.x()) / stage.scaleX(),
                    y: (pos.y - stage.y()) / stage.scaleY(),
                };
                addSeat(canvasPos.x, canvasPos.y);
            } else if (selectedTool === 'standing') {
                const stage = stageRef.current;
                const pos = stage.getPointerPosition();
                const canvasPos = {
                    x: (pos.x - stage.x()) / stage.scaleX(),
                    y: (pos.y - stage.y()) / stage.scaleY(),
                };
                addZone(canvasPos.x, canvasPos.y);
            } else {
                clearSelection();
            }
        }
    }, [selectedTool, addSeat, addZone, clearSelection]);

    // ── Drag end for pan ─────────────────────────────────────────
    const handleDragEnd = useCallback((e) => {
        if (e.target === stageRef.current) {
            setStagePosition(e.target.x(), e.target.y());
        }
    }, [setStagePosition]);

    // Container size for the wrapper
    const containerW = canvasWidth;
    const containerH = canvasHeight;

    return (
        <div
            style={{
                width: '100%',
                height: containerH,
                cursor: selectedTool === 'select' ? 'grab' : 'crosshair',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                background: '#0d0d1a',
                position: 'relative',
            }}
        >
            <Stage
                ref={stageRef}
                width={containerW}
                height={containerH}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stageX}
                y={stageY}
                onClick={handleStageClick}
                onWheel={handleWheel}
                draggable={selectedTool === 'select'}
                onDragEnd={handleDragEnd}
            >
                {/* Background grid */}
                <Layer name="grid">
                    <Rect
                        name="grid"
                        x={0} y={0}
                        width={canvasWidth}
                        height={canvasHeight}
                        fill="#0d0d1a"
                    />
                    {gridSnap && <GridLines width={canvasWidth} height={canvasHeight} />}
                </Layer>

                {/* ISSUE 6: Stage label at top */}
                <Layer listening={false}>
                    <StageLabel canvasWidth={canvasWidth} />
                </Layer>

                {/* Seats layer */}
                <Layer>
                    {seats.map((seat) => {
                        const section = sectionMap[seat.section_id] ?? null;
                        const isSelected = seat.id === selectedId;

                        if (seat.type === 'standing') {
                            return (
                                <StandingZoneNode
                                    key={seat.id}
                                    zone={seat}
                                    section={section}
                                    isSelected={isSelected}
                                    onSelect={() => selectSeat(seat.id)}
                                    onChange={updateSeat}
                                />
                            );
                        }

                        return (
                            <SeatNode
                                key={seat.id}
                                seat={seat}
                                section={section}
                                isSelected={isSelected}
                                onSelect={() => {
                                    selectSeat(seat.id);
                                }}
                                onDragEnd={(x, y) => moveSeat(seat.id, x, y)}
                                onMouseEnter={() => setHoveredSeat(seat.id)}
                                onMouseLeave={() => setHoveredSeat(null)}
                            />
                        );
                    })}

                    {/* ISSUE 6: Tooltip on hover */}
                    {hoveredSeat && hoveredSeat.type !== 'standing' && (
                        <SeatTooltip seat={hoveredSeat} section={hoveredSection} />
                    )}
                </Layer>
            </Stage>

            {/* Zoom level badge */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(12,12,12,0.85)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: 8,
                    padding: '3px 10px',
                    color: '#a78bfa',
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    pointerEvents: 'none',
                }}
            >
                {Math.round(stageScale * 100)}%
            </div>
        </div>
    );
}
