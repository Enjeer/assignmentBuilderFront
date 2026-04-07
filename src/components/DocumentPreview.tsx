import { type Block } from "@/lib/projects-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState, useEffect, useRef } from "react";

interface DocumentPreviewProps {
  blocks: Block[];
  projectName: string;
  imgNum: number;
}

interface TOCEntry {
  text: string;
  level: number;
  page: number;
}

function collectTOC(blocks: Block[]): TOCEntry[] {
  const entries: TOCEntry[] = [];
  let currentPage = 3;
  for (const block of blocks) {
    if (block.type === "title-page") continue;
    const isH1 = block.type === "heading" && (block.content.level || 1) === 1;
    if (isH1) {
      currentPage++;
      entries.push({ text: block.content.text || "", level: 1, page: currentPage });
    } else if (block.type === "heading") {
      entries.push({ text: block.content.text || "", level: block.content.level || 2, page: currentPage });
    }
  }
  return entries;
}

function splitIntoPages(blocks: Block[]): Block[][] {
  const contentBlocks = blocks.filter(b => b.type !== "title-page");
  if (contentBlocks.length === 0) return [];
  const pages: Block[][] = [];
  let current: Block[] = [];
  for (const block of contentBlocks) {
    const isH1 = block.type === "heading" && (block.content.level || 1) === 1;
    if (isH1 && current.length > 0) {
      pages.push(current);
      current = [];
    }
    current.push(block);
  }
  if (current.length > 0) pages.push(current);
  return pages;
}

// Фиксируем ширину на 210mm, чтобы текст не перепрыгивал
const PAGE_STYLE = "bg-white text-black shadow-lg w-[210mm] px-[25mm] py-[20mm] text-[12pt] leading-[1.5] relative overflow-hidden flex flex-col shrink-0";
const FONT_STYLE = { 
  fontFamily: "'Times New Roman', 'Liberation Serif', serif",
  aspectRatio: "1 / 1.4142",
  height: "297mm" // Фиксированная высота A4
};

export default function DocumentPreview({ blocks, projectName }: DocumentPreviewProps) {
  const titleBlock = useMemo(() => blocks.find(b => b.type === "title-page"), [blocks]);
  const contentPages = useMemo(() => splitIntoPages(blocks), [blocks]);
  const tocEntries = useMemo(() => collectTOC(blocks), [blocks]);
  const allImageBlocks = useMemo(() => blocks.filter(b => b.type === "image"), [blocks]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Следим за шириной контейнера и подгоняем zoom
  useEffect(() => {
    const updateZoom = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.offsetWidth;
      const padding = 48; // p-6 с двух сторон
      const availableWidth = parentWidth - padding;
      const a4WidthPx = 794; // ~210mm при стандартном DPI
      
      const newZoom = availableWidth / a4WidthPx;
      setZoomLevel(Math.min(newZoom, 1)); // Не увеличиваем больше 100%
    };

    const observer = new ResizeObserver(updateZoom);
    if (containerRef.current) observer.observe(containerRef.current);
    updateZoom();

    return () => observer.disconnect();
  }, []);

  const hasTitlePage = !!titleBlock;
  const tocPageNum = hasTitlePage ? 2 : 1;
  const contentStartPage = hasTitlePage ? 3 : 2;

  return (
    <div className="h-full flex flex-col bg-muted/30" ref={containerRef}>
      <div className="px-4 py-2 border-b border-border bg-card shrink-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Предпросмотр</span>
      </div>
      <ScrollArea className="flex-1">
        {/* Применяем zoom к обертке всех страниц */}
        <div 
          className="p-6 flex flex-col items-center gap-8" 
          style={{ zoom: zoomLevel }}
        >
          {blocks.length === 0 ? (
            <div className={PAGE_STYLE} style={FONT_STYLE}>
              <p className="text-gray-400 italic text-center mt-20">Документ пуст</p>
            </div>
          ) : (
            <>
              {titleBlock && (
                <div className={PAGE_STYLE} style={FONT_STYLE}>
                  <PreviewBlock block={titleBlock} imgNum={0}/>
                </div>
              )}

              <div className={PAGE_STYLE} style={FONT_STYLE}>
                <h2 className="text-[16pt] font-bold text-center mb-8 uppercase preview">Содержание</h2>
                {tocEntries.length === 0 ? (
                  <p className="text-gray-400 italic text-center">Добавьте заголовки</p>
                ) : (
                  <div className="space-y-1">
                    {tocEntries.map((entry, i) => (
                      <div key={i} className="flex items-baseline gap-1" style={{ paddingLeft: `${(entry.level - 1) * 1.25}cm` }}>
                        <span className={entry.level === 1 ? "font-bold" : ""}>{entry.text}</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 mx-1 min-w-[2cm] translate-y-[-3px]" />
                        <span className="text-right tabular-nums">{entry.page}</span>
                      </div>
                    ))}
                  </div>
                )}
                <PageNumber num={tocPageNum} />
              </div>

              {contentPages.map((pageBlocks, pageIdx) => (
                <div key={pageIdx} className={PAGE_STYLE} style={FONT_STYLE}>
                  <div className="flex-1">
                    {pageBlocks.map(block => {
                      let currentImgNum = 0;
                      if (block.type === "image") {
                        currentImgNum = allImageBlocks.findIndex(b => b.id === block.id) + 1;
                      }
                      return <PreviewBlock key={block.id} block={block} imgNum={currentImgNum} />;
                    })}
                  </div>
                  <PageNumber num={contentStartPage + pageIdx} />
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
  return <span className="absolute bottom-[10mm] left-0 right-0 text-center text-[10pt] text-gray-400">{num}</span>;
}

function PreviewBlock({ block, imgNum }: { block: Block; imgNum: number }) {
  switch (block.type) {
    case "title-page": {
      const c = block.content;
      return (
        <div className="flex flex-col justify-between h-full text-center py-2 font-serif">
          <div className="space-y-6">
            <div className="text-[12pt] leading-tight">
              <p className="uppercase">Министерство образования Республики Беларусь</p>
              <p className="uppercase">{"УО «" + (c.university || "БЕЛОРУССКИЙ ГОСУДАРСТВЕННЫЙ ЭКОНОМИЧЕСКИЙ УНИВЕРСИТЕТ") + "»"}</p>
            </div>
            
            <div className="text-[14pt] mt-8">
              <p>Кафедра <span className="inline-block border-b border-black min-w-[250px] text-left px-2">
                {c.department || "..."}
              </span></p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-[18pt] font-bold tracking-widest">КУРСОВАЯ РАБОТА</h1>
            <div className="text-[14pt] space-y-2">
              <p>по дисциплине: <span className="font-medium">{c.subject || "Микроэкономика..."}</span></p>
              <p>на тему: <span className="font-bold">{c.title || "Развитие банковской системы..."}</span></p>
            </div>
          </div>

          <div className="self-start w-full text-left text-[11pt] space-y-6 mr-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
              <div>
                <p>Студент</p>
                <p className="text-[10pt] leading-none">{c.group || "Факультет, курс"}</p>
              </div>
              <div className="text-[7pt] text-center px-2">
                <p>(подпись)</p>
                <p>(дата)</p>
              </div>
              <div className="text-right font-medium">
                {c.studentName || "А.Б. Иванов(а)"}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
              <div>
                <p>Руководитель</p>
                <p className="text-[9pt] leading-none italic">{c.teacherRank || "канд. экон. наук, доцент"}</p>
              </div>
              <div className="text-[7pt] text-center px-2">
                <p>(подпись) (оценка)</p>
                <p>(дата)</p>
              </div>
              <div className="text-right font-medium">
                {c.teacherName || "А.Б. Иванов(а)"}
              </div>
            </div>
          </div>

          <div className="text-[12pt] uppercase tracking-wider mt-4">
            {c.city || "МИНСК"} {c.year || new Date().getFullYear()}
          </div>
        </div>
      );
    }
    case "heading": {
      const level = block.content.level || 1;
      const Tag = `h${level}` as any;
      const sizes: Record<number, string> = {
        1: "text-[16pt] font-bold mt-2 mb-3 text-center preview",
        2: "text-[14pt] font-bold mt-5 mb-2 preview",
        3: "text-[13pt] font-semibold mt-4 mb-2 preview",
      };
      return <Tag className={sizes[level]}>{block.content.text || ""}</Tag>;
    }
    case "text":
      return <div className="mb-3 whitespace-pre-wrap text-justify indent-[1.25cm]">{block.content.text || ""}</div>;
    case "image":
      return (
        <div className="my-4 text-center">
          {block.content.url ? (
            <>
              <img src={block.content.url} className="mx-auto max-h-[100mm] object-contain" />
              <p className="text-[10pt] italic mt-1">Рисунок {imgNum}. {block.content.caption}</p>
            </>
          ) : <p className="text-gray-400 italic">[Изображение не указано]</p>}
        </div>
      );
    case "table": {
      const rows = block.content.rows || 3;
      const cols = block.content.cols || 3;
      const data = block.content.data || [];
      return (
        <table className="w-full border-collapse text-[11pt] my-4 border border-black">
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
    }
    default: return null;
  }
}