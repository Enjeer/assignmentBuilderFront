import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects, type Block } from "@/lib/projects-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Plus, Trash2, GripVertical, Type, Heading, Image, Table, FileText, Save,
  ChevronUp, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const BLOCK_TYPES = [
  { type: "heading", label: "Заголовок", icon: Heading },
  { type: "text", label: "Текст", icon: Type },
  { type: "title-page", label: "Титульный лист", icon: FileText },
  { type: "image", label: "Изображение", icon: Image },
  { type: "table", label: "Таблица", icon: Table },
] as const;

function createBlock(type: Block["type"]): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "heading": return { id, type, content: { text: "Новый заголовок", level: 1 } };
    case "text": return { id, type, content: { text: "" } };
    case "title-page": return { id, type, content: { university: "", title: "", studentName: "", group: "", teacherName: "", city: "Минск", year: new Date().getFullYear().toString() } };
    case "image": return { id, type, content: { url: "", caption: "" } };
    case "table": return { id, type, content: { rows: 3, cols: 3, data: Array(9).fill("") } };
    default: return { id, type: "text", content: { text: "" } };
  }
}

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProject, updateProject, updateBlocks } = useProjects();
  const navigate = useNavigate();
  const project = getProject(projectId || "");

  const [blocks, setBlocks] = useState<Block[]>(project?.blocks || []);
  const [projectName, setProjectName] = useState(project?.name || "");
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const saveBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
    if (projectId) updateBlocks(projectId, newBlocks);
  }, [projectId, updateBlocks]);

  const addBlock = (type: Block["type"]) => {
    saveBlocks([...blocks, createBlock(type)]);
    setAddMenuOpen(false);
  };

  const removeBlock = (id: string) => {
    saveBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, content: Record<string, any>) => {
    saveBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[idx], newBlocks[newIdx]] = [newBlocks[newIdx], newBlocks[idx]];
    saveBlocks(newBlocks);
  };

  const handleSave = () => {
    if (projectId) {
      updateProject(projectId, { name: projectName });
      updateBlocks(projectId, blocks);
    }
    toast({ title: "Сохранено", description: "Проект успешно сохранён" });
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p>Проект не найден</p>
        <Button variant="ghost" onClick={() => navigate("/projects")} className="mt-4">К проектам</Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <header className="border-b border-border bg-card px-4 py-3 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Input
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          className="max-w-md font-display font-semibold border-none bg-transparent text-foreground focus-visible:ring-0 px-2"
        />
        <div className="flex-1" />

        {/* Status */}
        <Select
          value={project.status}
          onValueChange={v => updateProject(projectId!, { status: v as any })}
        >
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Активный</SelectItem>
            <SelectItem value="inProgress">В работе</SelectItem>
            <SelectItem value="done">Завершён</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSave} size="sm" className="gap-2">
          <Save className="w-3.5 h-3.5" /> Сохранить
        </Button>
      </header>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-3">
          {blocks.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Документ пуст</p>
              <p className="text-sm mb-4">Добавьте первый блок, чтобы начать</p>
            </div>
          )}

          {blocks.map((block, idx) => (
            <Card key={block.id} className="group border-border hover:border-primary/20 transition-colors animate-fade-in">
              <CardContent className="p-0">
                {/* Block header */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30">
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex-1">
                    {BLOCK_TYPES.find(bt => bt.type === block.type)?.label || block.type}
                  </span>
                  <button onClick={() => moveBlock(idx, -1)} disabled={idx === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeBlock(block.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Block content */}
                <div className="p-4">
                  <BlockEditor block={block} onChange={content => updateBlock(block.id, content)} />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add block */}
          <div className="relative flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="gap-2 text-muted-foreground"
            >
              <Plus className="w-4 h-4" /> Добавить блок
            </Button>
            {addMenuOpen && (
              <div className="absolute top-full mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-10 flex gap-1 animate-fade-in">
                {BLOCK_TYPES.map(bt => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type as Block["type"])}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs"
                  >
                    <bt.icon className="w-4 h-4" />
                    {bt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockEditor({ block, onChange }: { block: Block; onChange: (c: Record<string, any>) => void }) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          <Select value={String(block.content.level)} onValueChange={v => onChange({ ...block.content, level: Number(v) })}>
            <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1</SelectItem>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={block.content.text}
            onChange={e => onChange({ ...block.content, text: e.target.value })}
            className={cn(
              "border-none bg-transparent px-0 focus-visible:ring-0 font-display font-bold",
              block.content.level === 1 && "text-2xl",
              block.content.level === 2 && "text-xl",
              block.content.level === 3 && "text-lg",
            )}
            placeholder="Введите заголовок..."
          />
        </div>
      );

    case "text":
      return (
        <Textarea
          value={block.content.text}
          onChange={e => onChange({ ...block.content, text: e.target.value })}
          placeholder="Введите текст..."
          className="min-h-[100px] border-none bg-transparent px-0 focus-visible:ring-0 resize-none leading-relaxed"
        />
      );

    case "title-page":
      return (
        <div className="space-y-3">
          {[
            { key: "university", label: "Учебное заведение" },
            { key: "title", label: "Тема работы" },
            { key: "studentName", label: "ФИО студента" },
            { key: "group", label: "Группа" },
            { key: "teacherName", label: "ФИО преподавателя" },
            { key: "city", label: "Город" },
            { key: "year", label: "Год" },
          ].map(f => (
            <div key={f.key} className="grid grid-cols-[140px_1fr] items-center gap-2">
              <label className="text-xs text-muted-foreground font-medium">{f.label}</label>
              <Input
                value={block.content[f.key] || ""}
                onChange={e => onChange({ ...block.content, [f.key]: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <Input
            value={block.content.url || ""}
            onChange={e => onChange({ ...block.content, url: e.target.value })}
            placeholder="URL изображения..."
            className="text-sm"
          />
          <Input
            value={block.content.caption || ""}
            onChange={e => onChange({ ...block.content, caption: e.target.value })}
            placeholder="Подпись к изображению..."
            className="text-sm"
          />
          {block.content.url && (
            <img src={block.content.url} alt={block.content.caption} className="max-w-full rounded-md border border-border" />
          )}
        </div>
      );

    case "table": {
      const rows = block.content.rows || 3;
      const cols = block.content.cols || 3;
      const data: string[] = block.content.data || Array(rows * cols).fill("");
      return (
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <label className="text-xs text-muted-foreground">Строки</label>
            <Input type="number" min={1} max={20} value={rows}
              onChange={e => {
                const newRows = Number(e.target.value);
                const newData = Array(newRows * cols).fill("").map((_, i) => data[i] || "");
                onChange({ ...block.content, rows: newRows, data: newData });
              }}
              className="w-16 h-7 text-xs" />
            <label className="text-xs text-muted-foreground">Столбцы</label>
            <Input type="number" min={1} max={10} value={cols}
              onChange={e => {
                const newCols = Number(e.target.value);
                const newData = Array(rows * newCols).fill("").map((_, i) => data[i] || "");
                onChange({ ...block.content, cols: newCols, data: newData });
              }}
              className="w-16 h-7 text-xs" />
          </div>
          <div className="overflow-x-auto border border-border rounded-md">
            <table className="w-full text-sm">
              <tbody>
                {Array.from({ length: rows }).map((_, r) => (
                  <tr key={r} className={r === 0 ? "bg-muted/50" : ""}>
                    {Array.from({ length: cols }).map((_, c) => (
                      <td key={c} className="border border-border p-0">
                        <input
                          value={data[r * cols + c] || ""}
                          onChange={e => {
                            const newData = [...data];
                            newData[r * cols + c] = e.target.value;
                            onChange({ ...block.content, data: newData });
                          }}
                          className="w-full px-2 py-1.5 bg-transparent text-foreground outline-none text-xs"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    default:
      return <p className="text-sm text-muted-foreground">Неизвестный тип блока</p>;
  }
}
