import { type Block } from "@/lib/projects-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useLayoutEffect } from "react";

interface DocumentPreviewProps {
  blocks: Block[];
  projectName: string;
}

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PADDING_TOP_MM = 20;
const PADDING_BOTTOM_MM = 75;
const CONTENT_MAX_HEIGHT_PX = (PAGE_HEIGHT_MM - PADDING_TOP_MM - PADDING_BOTTOM_MM) * 3.78;

const PAGE_STYLE = "bg-white text-black shadow-lg w-[210mm] px-[25mm] py-[20mm] text-[12pt] leading-[1.5] relative overflow-hidden flex flex-col shrink-0 mb-8";
const FONT_STYLE = { 
  fontFamily: "'Times New Roman', 'Liberation Serif', serif",
  height: `${PAGE_HEIGHT_MM}mm`
};

export default function DocumentPreview({ blocks }: DocumentPreviewProps) {
  const [paginatedPages, setPaginatedPages] = useState<Block[][]>([]);
  const [tocEntries, setTocEntries] = useState<{text: string; level: number; page: number}[]>([]);
  const [isCalculating, setIsCalculating] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const updateZoom = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.offsetWidth;
      const availableWidth = parentWidth - 48; // padding
      const a4WidthPx = PAGE_WIDTH_MM * 3.78; 
      setZoomLevel(Math.min(availableWidth / a4WidthPx, 1));
    };
    const observer = new ResizeObserver(updateZoom);
    if (containerRef.current) observer.observe(containerRef.current);
    updateZoom();
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!measureRef.current || blocks.length === 0) {
      setPaginatedPages([]);
      setIsCalculating(false);
      return;
    }

    setIsCalculating(true);
    
    const queue = JSON.parse(JSON.stringify(blocks.filter(b => b.type !== "title-page")));
    const pages: Block[][] = [];
    let currentPageBlocks: Block[] = [];
    let currentTOC: {text: string; level: number; page: number}[] = [];
    let currentHeight = 0;

    const hasTitle = blocks.some(b => b.type === "title-page");
    const offset = hasTitle ? 2 : 1;

    const measureContainer = measureRef.current;
    measureContainer.innerHTML = '';

    const measureHtml = (html: string) => {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const el = temp.firstElementChild as HTMLElement;
      measureContainer.appendChild(el);
      const h = el.offsetHeight;
      measureContainer.removeChild(el);
      return h;
    };

    while (queue.length > 0) {
      const block = queue.shift()!;

      if (block.type === 'heading') {
        const isH1 = (block.content.level || 1) === 1;
        const h = measureHtml(`<h${block.content.level} class="${isH1 ? 'text-[16pt] font-bold mt-2 mb-3 text-center' : 'text-[14pt] font-bold mt-5 mb-2'}">${block.content.text}</h${block.content.level}>`);

        if ((currentHeight + h > CONTENT_MAX_HEIGHT_PX) || (isH1 && currentPageBlocks.length > 0)) {
          pages.push(currentPageBlocks);
          currentPageBlocks = [block];
          currentHeight = h;
        } else {
          currentPageBlocks.push(block);
          currentHeight += h;
        }

        currentTOC.push({
          text: block.content.text || "",
          level: block.content.level || 1,
          page: pages.length + offset + 1
        });
      } 
      
      else if (block.type === 'text') {
        const paragraphs = (block.content.text || "").split('\n');
        const fits: string[] = [];
        const remaining: string[] = [];
        let tempHeight = currentHeight;

        for (const p of paragraphs) {
          const h = measureHtml(`<p class="indent-[1.25cm] mb-2 text-justify">${p}</p>`);
          if (tempHeight + h <= CONTENT_MAX_HEIGHT_PX) {
            fits.push(p);
            tempHeight += h;
          } else {
            remaining.push(p);
          }
        }

        if (fits.length > 0) {
          currentPageBlocks.push({ ...block, content: { ...block.content, text: fits.join('\n') } });
          currentHeight = tempHeight;
        }

        if (remaining.length > 0) {
          pages.push(currentPageBlocks);
          currentPageBlocks = [];
          currentHeight = 0;
          queue.unshift({ ...block, content: { ...block.content, text: remaining.join('\n') } });
        }
      }

      else if (block.type === 'table') {
        const { rows = 0, cols = 0, data = [] } = block.content;
        let fitsRows = 0;
        let tempHeight = currentHeight;

        for (let r = 0; r < rows; r++) {
          const rowData = data.slice(r * cols, (r + 1) * cols);
          const rowHtml = `<table class="w-full border border-black table-fixed"><tr class="border border-black">${rowData.map(c => `<td class="border border-black px-2 py-1 text-[11pt]">${c}</td>`).join('')}</tr></table>`;
          const h = measureHtml(rowHtml);

          if (tempHeight + h <= CONTENT_MAX_HEIGHT_PX) {
            fitsRows++;
            tempHeight += h;
          } else {
            break;
          }
        }

        if (fitsRows > 0) {
          currentPageBlocks.push({
            ...block,
            content: { ...block.content, rows: fitsRows, data: data.slice(0, fitsRows * cols) }
          });
          currentHeight = tempHeight;
        }

        if (fitsRows < rows) {
          pages.push(currentPageBlocks);
          currentPageBlocks = [];
          currentHeight = 0;
          queue.unshift({
            ...block,
            content: { ...block.content, rows: rows - fitsRows, data: data.slice(fitsRows * cols) }
          });
        }
      }

      else if (block.type === 'image') {
        const h = measureHtml(`<div class="my-4 h-[80mm]"></div>`);
        if (currentHeight + h > CONTENT_MAX_HEIGHT_PX) {
          pages.push(currentPageBlocks);
          currentPageBlocks = [block];
          currentHeight = h;
        } else {
          currentPageBlocks.push(block);
          currentHeight += h;
        }
      }
    }

    if (currentPageBlocks.length > 0) pages.push(currentPageBlocks);

    setPaginatedPages(pages);
    setTocEntries(currentTOC);
    setIsCalculating(false);
  }, [blocks]);

  const titleBlock = blocks.find(b => b.type === "title-page");
  const allImages = blocks.filter(b => b.type === "image");

  return (
    <div className="h-full flex flex-col bg-muted/30" ref={containerRef}>
      <div 
        ref={measureRef} 
        className="absolute opacity-0 pointer-events-none" 
        style={{ width: '160mm', ...FONT_STYLE }} 
      />

      <div className="px-4 py-2 border-b border-border bg-card shrink-0 flex justify-between items-center">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Предпросмотр</span>
        {isCalculating && <span className="text-[10px] animate-pulse">Оптимизация страниц...</span>}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 flex flex-col items-center gap-2" style={{ zoom: zoomLevel }}>
          {blocks.length === 0 ? (
            <div className={PAGE_STYLE} style={FONT_STYLE}>
              <p className="text-gray-400 italic text-center mt-20">Документ пуст</p>
            </div>
          ) : (
            <>
              {titleBlock && (
                <div className={PAGE_STYLE} style={FONT_STYLE}>
                  <PreviewBlock block={titleBlock} imgNum={0} />
                </div>
              )}

              <div className={PAGE_STYLE} style={FONT_STYLE}>
                <h2 className="text-[16pt] font-bold text-center mb-8 uppercase">Содержание</h2>
                <div className="space-y-1">
                  {tocEntries.map((entry, i) => (
                    <div key={i} className="flex items-baseline gap-1" style={{ paddingLeft: `${(entry.level - 1) * 1.25}cm` }}>
                      <span className={entry.level === 1 ? "font-bold" : ""}>{entry.text}</span>
                      <span className="flex-1 border-b border-dotted border-gray-400 mx-1 min-w-[1cm] translate-y-[-4px]" />
                      <span className="text-right tabular-nums">{entry.page}</span>
                    </div>
                  ))}
                </div>
                <PageNumber num={titleBlock ? 2 : 1} />
              </div>

              {paginatedPages.map((pageBlocks, pageIdx) => (
                <div key={pageIdx} className={PAGE_STYLE} style={FONT_STYLE}>
                  <div className="flex-1">
                    {pageBlocks.map((block, bIdx) => (
                      <PreviewBlock 
                        key={`${pageIdx}-${bIdx}`} 
                        block={block} 
                        imgNum={block.type === "image" ? allImages.findIndex(img => img.id === block.id) + 1 : 0} 
                      />
                    ))}
                  </div>
                  <PageNumber num={pageIdx + (titleBlock ? 3 : 2)} />
                </div>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function PageNumber({ num }: { num: number }) {
  return <span className="absolute bottom-[10mm] left-0 right-0 text-center text-[11pt]">{num}</span>;
}

function PreviewBlock({ block, imgNum }: { block: Block; imgNum: number }) {
  switch (block.type) {
    case "title-page": {
      const c = block.content;
      return (
        <div className="flex flex-col justify-between h-full text-center py-2 font-serif">
          <div className="space-y-4">
            <div className="text-[12pt] leading-tight uppercase">
              <p>Министерство образования Республики Беларусь</p>
              <p>УО «{c.university || "БЕЛОРУССКИЙ ГОСУДАРСТВЕННЫЙ ЭКОНОМИЧЕСКИЙ УНИВЕРСИТЕТ"}»</p>
            </div>
            <div className="text-[14pt] mt-8">
              <p>Кафедра <span className="border-b border-black px-4">{c.department || "________________"}</span></p>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-[18pt] font-bold tracking-widest">КУРСОВАЯ РАБОТА</h1>
            <div className="text-[14pt] space-y-2">
              <p>по дисциплине: <span className="font-medium">{c.subject || "..."}</span></p>
              <p>на тему: <span className="font-bold underline">{c.title || "..."}</span></p>
            </div>
          </div>
          <div className="self-end w-2/3 text-left text-[11pt] space-y-4">
            <div className="grid grid-cols-[1fr_auto] gap-x-4">
              <span>Студент {c.group}</span> <span className="font-bold">{c.studentName}</span>
              <span>Руководитель</span> <span className="font-bold">{c.teacherName}</span>
            </div>
          </div>
          <div className="text-[12pt] uppercase mt-4">
            {c.city || "МИНСК"} {c.year || "2024"}
          </div>
        </div>
      );
    }
    case "heading": {
      const level = block.content.level || 1;
      const Tag = `h${level}` as any;
      const styles = level === 1 
        ? "text-[16pt] font-bold mt-2 mb-4 text-center uppercase break-words" 
        : "text-[14pt] font-bold mt-6 mb-3 break-words";
      return <Tag className={styles}>{block.content.text}</Tag>;
    }
    case "text":
      return (
        <div className="mb-2 text-justify break-words">
          {(block.content.text || "").split("\n").map((p, i) => (
            <p key={i} className="indent-[1.25cm] leading-[1.5] mb-2">{p}</p>
          ))}
        </div>
      );
    case "image":
      return (
        <div className="my-6 text-center">
          {block.content.url ? (
            <figure className="inline-block">
              <img src={block.content.url} className="max-h-[100mm] max-w-full object-contain mx-auto border" />
              <figcaption className="text-[11pt] italic mt-2">Рисунок {imgNum} — {block.content.caption}</figcaption>
            </figure>
          ) : <div className="p-4 border border-dashed text-muted-foreground">[Изображение]</div>}
        </div>
      );
    case "table": {
      const { rows = 1, cols = 1, data = [] } = block.content;
      return (
        <div className="my-4">
          <table className="w-full border-collapse border border-black table-fixed text-[11pt]">
            <tbody>
              {Array.from({ length: rows }).map((_, r) => (
                <tr key={r}>
                  {Array.from({ length: cols }).map((_, c) => (
                    <td key={c} className="border border-black px-2 py-1 break-words overflow-hidden">
                      {data[r * cols + c] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    default: return null;
  }
}