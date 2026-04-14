import { type Block } from "@/lib/projects-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState, useEffect, useRef } from "react";

interface DocumentPreviewProps {
  blocks: Block[];
  projectName: string;
}

// Стили для печатной области (без полей самой страницы, так как они внутри колонок)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const VERTICAL_MARGIN_MM = 40; // 20mm top + 20mm bottom
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - VERTICAL_MARGIN_MM;

export default function DocumentPreview({ blocks }: DocumentPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const titleBlock = useMemo(() => blocks.find(b => b.type === "title-page"), [blocks]);
  const otherBlocks = useMemo(() => blocks.filter(b => b.type !== "title-page"), [blocks]);
  const allImageBlocks = useMemo(() => blocks.filter(b => b.type === "image"), [blocks]);

  useEffect(() => {
    const updateZoom = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.offsetWidth - 48;
      const a4WidthPx = 794; // 210mm при 96 DPI
      setZoomLevel(Math.min(availableWidth / a4WidthPx, 1));
    };
    const observer = new ResizeObserver(updateZoom);
    if (containerRef.current) observer.observe(containerRef.current);
    updateZoom();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full flex flex-col bg-muted/30" ref={containerRef}>
      <div className="px-4 py-2 border-b bg-card shrink-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          CSS Columns Preview
        </span>
      </div>
      
      <ScrollArea className="flex-1">
        <div 
          className="p-10 origin-top flex flex-col items-center gap-10" 
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Титульник рендерим отдельно, так как у него своя верстка */}
          {titleBlock && (
            <div className="bg-white shadow-xl shrink-0 overflow-hidden" 
                 style={{ width: '210mm', height: '297mm', padding: '20mm 25mm' }}>
              <PreviewBlock block={titleBlock} imgNum={0} />
            </div>
          )}

          {/* Основной контент в режиме колонок */}
          <div className="relative">
            {/* Сетка для визуализации границ страниц (опционально) */}
            <div className="absolute inset-0 pointer-events-none flex gap-[10mm]">
               {/* Здесь можно отрендерить пустые рамки страниц для красоты */}
            </div>

            <div 
              className="bg-white shadow-xl"
              style={{
                width: 'auto',
                height: `${CONTENT_HEIGHT_MM}mm`,
                padding: `20mm 25mm`, // Эти падинги станут полями каждой "колонки"
                columnWidth: '160mm', // 210mm - 25mm - 25mm
                columnGap: '50mm',    // Визуальный разрыв между страницами
                columnFill: 'auto',
                fontFamily: "'Times New Roman', serif",
              }}
            >
              {otherBlocks.map((block) => {
                let currentImgNum = 0;
                if (block.type === "image") {
                  currentImgNum = allImageBlocks.findIndex(b => b.id === block.id) + 1;
                }
                return <PreviewBlock key={block.id} block={block} imgNum={currentImgNum} />;
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function PreviewBlock({ block, imgNum }: { block: Block; imgNum: number }) {
  // Добавляем специфические CSS свойства для разрывов
  const breakStyle: React.CSSProperties = {
    breakInside: 'avoid', // Не разрывать картинки и таблицы посередине
    pageBreakInside: 'avoid'
  };

  switch (block.type) {
    case "heading": {
      const level = block.content.level || 1;
      const Tag = `h${level}` as any;
      return (
        <Tag 
          style={{ 
            breakAfter: 'avoid', // Заголовок не должен быть последней строкой на странице
            breakBefore: level === 1 ? 'column' : 'auto' // H1 всегда с новой страницы (колонки)
          }} 
          className={`font-bold mb-4 ${level === 1 ? "text-[16pt] text-center uppercase" : "text-[14pt]"}`}
        >
          {block.content.text}
        </Tag>
      );
    }
    case "text":
      return (
        <div className="text-[12pt] leading-[1.5] text-justify mb-4">
          {block.content.text?.split("\n").map((p, i) => (
            <p key={i} className="indent-[1.25cm]">{p}</p>
          ))}
        </div>
      );
    case "image":
      return (
        <div style={breakStyle} className="my-6 text-center">
          <img src={block.content.url} className="mx-auto max-h-[80mm] object-contain" />
          <p className="text-[10pt] italic mt-2">Рисунок {imgNum}. {block.content.caption}</p>
        </div>
      );
    case "table":
      const rows = block.content.rows || 3;
      const cols = block.content.cols || 3;
      const data = block.content.data || [];
      return (
        <table style={breakStyle} className="my-4">
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} className={`border border-black px-2 py-1 ${r === 0 ? "font-bold bg-gray-50" : ""}`}>
                    {data[r * cols + c] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    default: return null;
  }
}