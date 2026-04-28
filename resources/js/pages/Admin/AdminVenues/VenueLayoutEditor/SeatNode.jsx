import React from 'react';
import { Group, Shape, Text } from 'react-konva';

const SEAT_SIZE = 30;

const SELECTED_STROKE     = '#a78bfa';
const SELECTED_STROKE_W   = 2.5;
const DEFAULT_STROKE      = 'rgba(255,255,255,0.18)';

/**
 * Draws a chair / armchair icon centered at (0,0) within a SEAT_SIZE box.
 * The shape: rounded backrest at top, seat cushion, two small armrests.
 */
function drawChair(ctx, size, fill, strokeColor, strokeWidth, isSelected) {
    const s = size;
    const half = s / 2;

    // ── Backrest (top rounded rect) ──────────────────────────
    const brX = -half + 3;
    const brY = -half + 1;
    const brW = s - 6;
    const brH = s * 0.38;
    const brR = 5;

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
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // ── Seat cushion (wider rounded rect below backrest) ─────
    const csX = -half + 1;
    const csY = brY + brH + 2;
    const csW = s - 2;
    const csH = s * 0.32;
    const csR = 4;

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
    // Slightly lighter shade for cushion
    ctx.fillStyle = fill;
    ctx.globalAlpha = 0.75;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth * 0.8;
    ctx.stroke();

    // ── Left armrest ─────────────────────────────────────────
    const armW = 3;
    const armH = brH + 2 + csH - 2;
    const armY = brY + 3;

    ctx.beginPath();
    ctx.roundRect(-half, armY, armW, armH, 2);
    ctx.fillStyle = fill;
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Right armrest ────────────────────────────────────────
    ctx.beginPath();
    ctx.roundRect(half - armW, armY, armW, armH, 2);
    ctx.fillStyle = fill;
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Selection glow ───────────────────────────────────────
    if (isSelected) {
        ctx.shadowColor = SELECTED_STROKE;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(-half, -half, s, s, 6);
        ctx.strokeStyle = SELECTED_STROKE;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

export default function SeatNode({ seat, section, isSelected, onSelect, onDragEnd, onMouseEnter, onMouseLeave }) {
    const fill   = section?.color ?? '#7C3AED';
    const sColor = isSelected ? SELECTED_STROKE : DEFAULT_STROKE;
    const sWidth = isSelected ? SELECTED_STROKE_W : 1;

    if (seat.type === 'standing' && seat.width) {
        return null;  // Handled by StandingZoneNode
    }

    return (
        <Group
            x={seat.x}
            y={seat.y}
            rotation={seat.rotation}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Shape
                sceneFunc={(ctx, shape) => {
                    drawChair(ctx, SEAT_SIZE, fill, sColor, sWidth, isSelected);
                    ctx.fillStrokeShape(shape);
                }}
                hitFunc={(ctx, shape) => {
                    // Simple rectangle hit area
                    ctx.beginPath();
                    ctx.rect(-SEAT_SIZE/2, -SEAT_SIZE/2, SEAT_SIZE, SEAT_SIZE);
                    ctx.closePath();
                    ctx.fillStrokeShape(shape);
                }}
            />

            {/* Label */}
            <Text
                text={seat.label}
                x={-SEAT_SIZE / 2}
                y={SEAT_SIZE * 0.15}
                width={SEAT_SIZE}
                fontSize={seat.label.length > 3 ? 7 : 9}
                fill="#fff"
                fontFamily="Inter, sans-serif"
                fontStyle="bold"
                align="center"
                listening={false}
            />
        </Group>
    );
}
