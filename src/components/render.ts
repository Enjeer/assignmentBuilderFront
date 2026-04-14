import { pdf } from '@react-pdf/renderer';
import DocumentPreviewPDF from '@/components/PreviewPdfRenderer';
import type { Block } from '@/lib/projects-context'; // Импортируйте ваш тип Block

interface WorkerData {
    blocks: Block[];
    projectName: string;
}

interface WorkerResponse {
    blob?: Blob;
    error?: string;
}

// Объявляем контекст воркера
const ctx: Worker = self as any;

ctx.onmessage = async (e: MessageEvent<WorkerData>) => {
    try {
        const { blocks, projectName } = e.data;

        if (!blocks || !Array.isArray(blocks)) {
        throw new Error('Invalid blocks data');
        }

        // Создаем React-элемент документа
        const doc = DocumentPreviewPDF({ blocks, projectName });

        // Проверяем, что doc - валидный React элемент
        if (!doc) {
        throw new Error('Failed to create document');
        }

        // Генерируем PDF как blob
        const blob = await pdf(doc).toBlob();

        // Отправляем blob обратно в главный поток
        // @ts-ignore - postMessage с Transferable
        ctx.postMessage({ blob }, [blob]);
        
    } catch (error) {
        console.error('PDF Worker error:', error);
        
        const errorMessage = error instanceof Error 
        ? error.message 
        : 'Неизвестная ошибка при генерации PDF';
        
        ctx.postMessage({ error: errorMessage });
    }
};

// Для обработки ошибок воркера
ctx.onerror = (error) => {
    console.error('Worker runtime error:', error);
    ctx.postMessage({ error: 'Runtime error in worker' });
};

// Экспорт для TypeScript
export {};