import { type Block } from "@/lib/projects-context";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentPreviewProps {
  blocks: Block[];
  projectName: string;
}

export default function DocumentPreview({ blocks, projectName }: DocumentPreviewProps) {
  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="px-4 py-2 border-b border-border bg-card shrink-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Предпросмотр</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 flex justify-center">
          <div className="bg-white text-black shadow-lg w-full max-w-[210mm] min-h-[297mm] px-[25mm] py-[20mm] text-[12pt] leading-[1.5] font-serif"
            style={{ fontFamily: "'Times New Roman', 'Liberation Serif', serif" }}>
            {blocks.length === 0 && (
              <p className="text-gray-400 italic text-center mt-20">Документ пуст</p>
            )}
            {blocks.map(block => (
              <PreviewBlock key={block.id} block={block} />
            ))}
          </div>
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
        1: "text-[16pt] font-bold mt-6 mb-3",
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
