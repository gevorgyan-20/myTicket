import React, { useRef, useEffect } from 'react';
import { Rect, Group, Text, Transformer } from 'react-konva';

export default function StandingZoneNode({ zone, section, isSelected, onSelect, onChange }) {
    const shapeRef = useRef();
    const trRef = useRef();

    const fill   = section?.color ?? '#7C3AED';
    const stroke = isSelected ? '#a78bfa' : 'rgba(255,255,255,0.2)';

    useEffect(() => {
        if (isSelected && trRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Group
                x={zone.x}
                y={zone.y}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={(e) => {
                    onChange(zone.id, { x: e.target.x(), y: e.target.y() });
                }}
            >
                <Rect
                    ref={shapeRef}
                    width={zone.width || 150}
                    height={zone.height || 100}
                    fill={fill}
                    opacity={0.3}
                    stroke={stroke}
                    strokeWidth={2}
                    dash={[10, 5]}
                    cornerRadius={4}
                    onTransformEnd={() => {
                        const node = shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        // reset scale and apply to width/height
                        node.scaleX(1);
                        node.scaleY(1);

                        onChange(zone.id, {
                            width:  Math.max(20, node.width() * scaleX),
                            height: Math.max(20, node.height() * scaleY),
                        });
                    }}
                />
                <Text
                    text={zone.label || 'GA AREA'}
                    width={zone.width || 150}
                    height={zone.height || 100}
                    align="center"
                    verticalAlign="middle"
                    fill="#fff"
                    fontSize={14}
                    fontStyle="bold"
                    listening={false}
                />
            </Group>
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 20 || newBox.height < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    rotateEnabled={false}
                />
            )}
        </React.Fragment>
    );
}
