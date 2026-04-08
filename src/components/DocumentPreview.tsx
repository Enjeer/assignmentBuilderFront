import { type Block } from "@/lib/projects-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";

const PAGE_HEIGHT_PX = 1122; // ~A4

function estimateHeight(block: Block): number {
  switch (block.type) {
    case "heading": return block.content.level === 1 ? 60 : 40;
    case "text": return Math.max(40, block.content.text.length * 0.5);
    case "image": return 250;
    case "table": return (block.content.rows || 3) * 30 + 40;
    default: return 50;
  }
}

function splitTextBlock(block: Block, remainingHeight: number): [Block, Block] {
  const text = block.content.text || "";
  const approxCharsPerLine = 90;
  const approxLines = Math.max(1, Math.floor(remainingHeight / 18));
  const splitIndex = approxCharsPerLine * approxLines;

  return [
    { ...block, content: { ...block.content, text: text.slice(0, splitIndex) } },
    { ...block, content: { ...block.content, text: text.slice(splitIndex) } }
  ];
}

function paginate(blocks: Block[]): Block[][] {
  const pages: Block[][] = [];
  let current: Block[] = [];
  let height = 0;

  for (const block of blocks) {
    if (block.type === "title-page") continue;

    const isH1 = block.type === "heading" && block.content.level === 1;
    const blockHeight = estimateHeight(block);

    if (isH1 && current.length > 0) {
      pages.push(current);
      current = [];
      height = 0;
    }

    if (height + blockHeight <= PAGE_HEIGHT_PX) {
      current.push(block);
      height += blockHeight;
    } else {
      if (block.type === "text") {
        const [part1, part2] = splitTextBlock(block, PAGE_HEIGHT_PX - height);
        current.push(part1);
        pages.push(current);

        current = [part2];
        height = estimateHeight(part2);
      } else {
        pages.push(current);
        current = [block];
        height = blockHeight;
      }
    }
  }

  if (current.length) pages.push(current);
  return pages;
}

// ✅ NEW: TOC based on paginated result
function buildTOC(pages: Block[][]) {
  const toc: { text: string; level: number; page: number }[] = [];

  pages.forEach((page, pageIndex) => {
    page.forEach(block => {
      if (block.type === "heading") {
        toc.push({
          text: block.content.text || "",
          level: block.content.level || 1,
          page: pageIndex + 1
        });
      }
    });
  });

  return toc;
}

const PAGE_STYLE = "bg-white text-black shadow-lg w-[210mm] px-[25mm] py-[20mm] text-[12pt] leading-[1.5] relative flex flex-col shrink-0";
const FONT_STYLE = {
  fontFamily: "'Times New Roman', serif",
  aspectRatio: "1 / 1.4142",
  height: "297mm"
};

export default function DocumentPreview({ blocks }: { blocks: Block[] }) {
  const titleBlock = useMemo(() => blocks.find(b => b.type === "title-page"), [blocks]);

  const pages = useMemo(() => paginate(blocks), [blocks]);
  const toc = useMemo(() => buildTOC(pages), [pages]);

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="px-4 py-2 border-b bg-card">
        <span className="text-xs">Предпросмотр</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 flex flex-col items-center gap-8">

          {/* TITLE */}
          {titleBlock && (
            <div className={PAGE_STYLE} style={FONT_STYLE}>
              <PreviewBlock block={titleBlock} />
            </div>
          )}

          {/* TOC */}
          <div className={PAGE_STYLE} style={FONT_STYLE}>
            <h2 className="text-[16pt] font-bold text-center mb-8 uppercase">Содержание</h2>

            {toc.length === 0 ? (
              <p className="text-gray-400 italic text-center">Добавьте заголовки</p>
            ) : (
              <div className="space-y-1">
                {toc.map((entry, i) => (
                  <div key={i} className="flex items-baseline gap-1" style={{ paddingLeft: `${(entry.level - 1) * 1.25}cm` }}>
                    <span className={entry.level === 1 ? "font-bold" : ""}>{entry.text}</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 mx-1" />
                    <span>{entry.page}</span>
                  </div>
                ))}
              </div>
            )}

            <PageNumber num={titleBlock ? 2 : 1} />
          </div>

          {/* CONTENT */}
          {pages.map((page, i) => (
            <div key={i} className={PAGE_STYLE} style={FONT_STYLE}>
              <div className="flex-1">
                {page.map(block => (
                  <PreviewBlock key={block.id} block={block} />
                ))}
              </div>
              <PageNumber num={(titleBlock ? 3 : 2) + i} />
            </div>
          ))}

        </div>
      </ScrollArea>
    </div>
  );
}

function PageNumber({ num }: { num: number }) {
  return <span className="absolute bottom-[10mm] left-0 right-0 text-center text-[10pt] text-gray-400">{num}</span>;
}

function PreviewBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const level = block.content.level || 1;
      const Tag = `h${level}` as any;
      return <Tag className="font-bold my-2">{block.content.text}</Tag>;
    }
    case "text":
      return <p className="mb-2">{block.content.text}</p>;
    case "image":
      return block.content.url ? <img src={block.content.url} /> : null;
    case "table":
      return <div>Table</div>;
    case "title-page":
      return <div className="text-center">Title Page</div>;
    default:
      return null;
  }
}
