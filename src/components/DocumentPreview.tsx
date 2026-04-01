import { type Block } from "@/lib/projects-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";

interface DocumentPreviewProps {
  blocks: Block[];
  projectName: string;
}

interface TOCEntry {
  text: string;
  level: number;
  page: number;
}

/** Collect headings for table of contents */
function collectTOC(blocks: Block[]): TOCEntry[] {
  const entries: TOCEntry[] = [];
  let pageNum = 2; // page 1 = title, page 2 = TOC, content starts at 3
  // We need to figure out pages — simplified: count H1 as page break
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

/** Split blocks into pages: each H1 heading forces a new page. Title page excluded (rendered separately). */
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

const PAGE_STYLE = "bg-white text-black shadow-lg w-full max-w-[210mm] min-h-[297mm] px-[25mm] py-[20mm] text-[12pt] leading-[1.5] relative";
const FONT_STYLE = { fontFamily: "'Times New Roman', 'Liberation Serif', serif" };

export default function DocumentPreview({ blocks, projectName }: DocumentPreviewProps) {
  const titleBlock = useMemo(() => blocks.find(b => b.type === "title-page"), [blocks]);
  const contentPages = useMemo(() => splitIntoPages(blocks), [blocks]);
  const tocEntries = useMemo(() => collectTOC(blocks), [blocks]);
  const hasTitlePage = !!titleBlock;

  // Page numbering: title=1, toc=2, content starts at 3
  const tocPageNum = hasTitlePage ? 2 : 1;
  const contentStartPage = hasTitlePage ? 3 : 2;

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="px-4 py-2 border-b border-border bg-card shrink-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Предпросмотр</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 flex flex-col items-center gap-8">
          {blocks.length === 0 ? (
            <div className={PAGE_STYLE} style={FONT_STYLE}>
              <p className="text-gray-400 italic text-center mt-20">Документ пуст</p>
            </div>
          ) : (
            <>
              {/* Page 1: Title page */}
              {titleBlock && (
                <div className={PAGE_STYLE} style={FONT_STYLE}>
                  <PreviewBlock block={titleBlock} />
                  <PageNumber num={1} />
                </div>
              )}

              {/* Page 2: Table of Contents */}
              <div className={PAGE_STYLE} style={FONT_STYLE}>
                <h2 className="text-[16pt] font-bold text-center mb-8 uppercase">Содержание</h2>
                {tocEntries.length === 0 ? (
                  <p className="text-gray-400 italic text-center">Добавьте заголовки для генерации содержания</p>
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

              {/* Content pages */}
              {contentPages.map((pageBlocks, pageIdx) => (
                <div key={pageIdx} className={PAGE_STYLE} style={FONT_STYLE}>
                  {pageBlocks.map(block => (
                    <PreviewBlock key={block.id} block={block} />
                  ))}
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
  return (
    <span className="absolute bottom-[10mm] left-0 right-0 text-center text-[10pt] text-gray-400">
      {num}
    </span>
  );
}

function PreviewBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "title-page": {
      const c = block.content;
      return (
        <div className="flex flex-col items-center justify-between min-h-[257mm] text-center py-4">
          <div>
            <p className="text-[14pt] font-bold uppercase">{c.university || "Учебное заведение"}</p>
          </div>
          <div className="space-y-4">
            <p className="text-[16pt] font-bold uppercase">{c.title || "Тема работы"}</p>
          </div>
          <div className="self-end text-right space-y-1 text-[12pt]">
            <p>Выполнил: {c.studentName || "___"}</p>
            <p>Группа: {c.group || "___"}</p>
            <p>Преподаватель: {c.teacherName || "___"}</p>
          </div>
          <div>
            <p>{c.city || "Город"}, {c.year || new Date().getFullYear()}</p>
          </div>
        </div>
      );
    }

    case "heading": {
      const level = block.content.level || 1;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = {
        1: "text-[16pt] font-bold mt-2 mb-3",
        2: "text-[14pt] font-bold mt-5 mb-2",
        3: "text-[13pt] font-semibold mt-4 mb-2",
      };
      return <Tag className={sizes[level] || sizes[1]}>{block.content.text || ""}</Tag>;
    }

    case "text":
      return (
        <div className="mb-3 whitespace-pre-wrap text-justify indent-[1.25cm]">
          {block.content.text || ""}
        </div>
      );

    case "image":
      return (
        <div className="my-4 text-center">
          {block.content.url ? (
            <>
              <img src={block.content.url} alt={block.content.caption} className="max-w-full mx-auto" />
              {block.content.caption && (
                <p className="text-[10pt] italic mt-1">{block.content.caption}</p>
              )}
            </>
          ) : (
            <p className="text-gray-400 italic">[Изображение не указано]</p>
          )}
        </div>
      );

    case "table": {
      const rows = block.content.rows || 3;
      const cols = block.content.cols || 3;
      const data: string[] = block.content.data || [];
      return (
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-[11pt]">
            <tbody>
              {Array.from({ length: rows }).map((_, r) => (
                <tr key={r}>
                  {Array.from({ length: cols }).map((_, c) => (
                    <td key={c} className={`border border-black px-2 py-1 ${r === 0 ? "font-bold bg-gray-100" : ""}`}>
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

    default:
      return null;
  }
}
