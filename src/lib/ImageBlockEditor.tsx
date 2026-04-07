import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, UploadCloud, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageBlockEditorProps {
    content: {
        url?: string;
        caption?: string;
        file?: File;
    };
    onChange: (content: any) => void;
}

export default function ImageBlockEditor({ content, onChange }: ImageBlockEditorProps) {
    const { url, caption, file } = content;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        const localUrl = URL.createObjectURL(selectedFile);
        onChange({ ...content, url: localUrl, file: selectedFile });
        }
    };

    // const source = '';

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange({ ...content, url: "", file: undefined });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="space-y-3">
        {/* Hidden native input */}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            className="hidden"
        />

        <div 
            onClick={triggerFileInput}
            className={cn(
            "relative group flex flex-col items-center justify-center w-full min-h-[160px] rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden",
            !url 
                ? "border-muted-foreground/25 bg-muted/5 hover:border-primary/50 hover:bg-primary/5" 
                : "border-transparent bg-background"
            )}
        >
            {url ? (
            <>
                {/* Preview */}
                <img
                src={url}
                alt="Preview"
                className={cn(
                    "w-full max-h-[300px] object-contain rounded-md transition-all",
                    file && "opacity-60 grayscale-[0.5]"
                )}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <RefreshCw className="w-8 h-8 text-white mb-2" />
                <span className="text-white text-xs font-medium">Нажмите, чтобы заменить</span>
                </div>

                {/* delete */}
                <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeImage}
                >
                <X className="w-4 h-4" />
                </Button>

                {/* autosave status */}
                {file && (
                <div className="absolute bottom-2 left-2 pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1 rounded shadow-sm">
                    Ожидает сохранения...
                    </span>
                </div>
                )}
            </>
            ) : (
            <div className="flex flex-col items-center p-6 text-center">
                <div className="p-4 rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Загрузить изображение</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG до 5MB</p>
            </div>
            )}
        </div>

        <Input
            value={caption || ""}
            onChange={(e) => onChange({ ...content, caption: e.target.value })}
            placeholder="Добавить подпись к рисунку..."
            className="text-sm italic border-none bg-muted/30 focus-visible:ring-1"
        />
        {/* <Input
            value={source || ""}
            onChange={(e) => onChange({ ...content, source: e.target.value })}
            placeholder="Добавьте источник"
            className="text-sm italic border-none bg-muted/30 focus-visible:ring-1"
        /> */}
        </div>
    );
}