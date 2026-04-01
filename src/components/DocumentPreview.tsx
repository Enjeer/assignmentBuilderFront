import { type Block } from "@/lib/projects-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";

interface DocumentPreviewProps {
  blocks: Block[];
  projectName: string;
}

/** Split blocks into pages: each H1 heading forces a new page */
function splitIntoPages(blocks: Block[]): Block[][] {
  if (blocks.length === 0) return [[]];

  const pages: Block[][] = [];
  let current: Block[] = [];

  for (const block of blocks) {
    const isH1 = block.type === "heading" && (block.content.level || 1) === 1;
    const isTitle = block.type === "title-page";

    if ((isH1 || isTitle) && current.length > 0) {
      pages.push(current);
      current = [];
    }
    current.push(block);
  }

  if (current.length > 0) pages.push(current);
  return pages;
}

export default function DocumentPreview({ blocks, projectName }: DocumentPreviewProps) {
  const pages = useMemo(() => splitIntoPages(blocks), [blocks]);

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="px-4 py-2 border-b border-border bg-card shrink-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Предпросмотр</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 flex flex-col items-center gap-8">
          {blocks.length === 0 ? (
            <div
              className="bg-white text-black shadow-lg w-full max-w-[210mm] min-h-[297mm] px-[25mm] py-[20mm] text-[12pt] leading-[1.5]"
              style={{ fontFamily: "'Times New Roman', 'Liberation Serif', serif" }}
            >
              <p className="text-gray-400 italic text-center mt-20">Документ пуст</p>
            </div>
          ) : (
            pages.map((pageBlocks, pageIdx) => (
              <div
                key={pageIdx}
                className="bg-white text-black shadow-lg w-full max-w-[210mm] min-h-[297mm] px-[25mm] py-[20mm] text-[12pt] leading-[1.5] relative"
                style={{ fontFamily: "'Times New Roman', 'Liberation Serif', serif" }}
              >
                {pageBlocks.map(block => (
                  <PreviewBlock key={block.id} block={block} />
                ))}
                <span className="absolute bottom-[10mm] left-0 right-0 text-center text-[10pt] text-gray-400">
                  {pageIdx + 1}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
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
