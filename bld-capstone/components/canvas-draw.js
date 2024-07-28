import React, { useState, useEffect } from 'react';
import { useOnDraw } from '@/hooks/useOnDraw';

export default function CanvasDraw(props) {
    const {onMouseDown, setCanvasRef} = useOnDraw(onDraw);

    function onDraw(ctx, point, prevPoint) {
        drawLine(prevPoint, point, ctx, '#FFFFFF', 5);
    }

    function drawLine(
        start,
        end,
        ctx,
        color,
        width
    ) {
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(start.x, start.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    return (
        <>
            <canvas id='canvas'
                width={props.width}
                height={props.height}
                style={canvasStyle}
                onMouseDown={onMouseDown}
                ref={setCanvasRef}
            />
        </>
    )
}

const canvasStyle = {
    border: "3px solid white"
}