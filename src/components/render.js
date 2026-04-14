import { pdf } from '@react-pdf/renderer';
import { DocumentPreviewPDF } from '@/components/DocumentPreviewPDF';

self.onmessage = async function (e) {
    const { blocks, projectName } = e.data;

    const doc = DocumentPreviewPDF({ blocks, projectName });

    const blob = await pdf(doc).toBlob();
    self.postMessage(blob, [blob]);
};