"use client";

import React, { useState, useRef } from "react";

interface WindowManagerProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  zIndex: number;
  onFocus: () => void;
  children: React.ReactNode;
}

export default function WindowManager({
  title,
  isOpen,
  onClose,
  defaultX = 140,
  defaultY = 80,
  defaultWidth = 600,
  defaultHeight = 400,
  zIndex,
  onFocus,
  children,
}: WindowManagerProps) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size] = useState({ width: defaultWidth, height: defaultHeight });
  const [isMinimized, setIsMinimized] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".ctrl-btn")) return;
    onFocus();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const newY = Math.max(56, initialPos.current.y + dy);
    setPosition({
      x: initialPos.current.x + dx,
      y: newY,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="window"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? "32px" : `${size.height}px`,
        zIndex: zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div
        className="window-header"
        onMouseDown={handleMouseDown}
      >
        <div className="title">
          <span className="dot" />
          {title}
        </div>
        <div className="controls">
          <button
            className="ctrl-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            title={isMinimized ? "Restore" : "Minimize"}
          >
            {isMinimized ? "⤢" : "─"}
          </button>
          <button
            className="ctrl-btn close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
      {!isMinimized && <div className="window-body">{children}</div>}
    </div>
  );
}
