import { pdf } from '@react-pdf/renderer';
import DocumentPreviewPDF from './path/to/DocumentPreviewPDF';

self.onmessage = async (e) => {
    const { blocks, projectName } = e.data;
    const doc = <DocumentPreviewPDF blocks={blocks} projectName={projectName} />;
    const blob = await pdf(doc).toBlob();
    self.postMessage(blob, [blob]);
};