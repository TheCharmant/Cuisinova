import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

type Pos = { x: number; y: number };

type FloatingWidgetProps = {
  /** Unique key for localStorage persistence */
  storageKey: string;
  /** Default position (bottom/right offset are not used; absolute x/y in viewport) */
  defaultPos: Pos;
  /** Optional default size */
  defaultSize?: { width: number; height: number };
  /** Drag handle area (keeps inner controls clickable) */
  header: ReactNode;
  children: ReactNode;
  className?: string;
  minWidth?: number;
  minHeight?: number;
  bodyOverflow?: 'auto' | 'hidden';
  bodyClassName?: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const FloatingWidget = ({
  storageKey,
  defaultPos,
  defaultSize,
  header,
  children,
  className = '',
  minWidth = 280,
  minHeight = 140,
  bodyOverflow = 'auto',
  bodyClassName = '',
}: FloatingWidgetProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<Pos>(defaultPos);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    defaultSize ?? null
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { pos?: Pos; size?: { width: number; height: number } };
      if (parsed?.pos) setPos(parsed.pos);
      if (parsed?.size) setSize(parsed.size);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ pos, size }));
    } catch {
      // ignore
    }
  }, [pos, size, storageKey]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Drag only when clicking the header area
    const el = ref.current;
    if (!el) return;

    // Don't start drag when clicking interactive controls inside the header
    const target = e.target as HTMLElement | null;
    if (target?.closest('button,a,input,textarea,select,label,svg,path')) {
      return;
    }
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    const start = { x: e.clientX, y: e.clientY };
    const startPos = pos;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      const nextX = startPos.x + dx;
      const nextY = startPos.y + dy;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      setPos({
        x: clamp(nextX, 8, vw - w - 8),
        y: clamp(nextY, 8, vh - h - 8),
      });
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, [pos]);

  const onResize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
  }, []);

  return (
    <div
      ref={ref}
      className={`fixed z-50 flex flex-col ${className}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: size?.width,
        height: size?.height,
        minWidth,
        minHeight,
        maxWidth: 'calc(100vw - 16px)',
        maxHeight: 'calc(100vh - 16px)',
        resize: 'both',
        overflow: 'hidden',
      }}
      onMouseUp={onResize}
      onTouchEnd={onResize}
    >
      <div
        className="cursor-move select-none"
        onPointerDown={onPointerDown}
        role="button"
        tabIndex={0}
        aria-label="Drag widget"
      >
        {header}
      </div>
      <div className={`flex-1 ${bodyOverflow === 'auto' ? 'overflow-auto' : 'overflow-hidden'} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default FloatingWidget;

