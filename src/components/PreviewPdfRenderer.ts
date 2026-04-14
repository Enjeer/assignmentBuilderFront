import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

// --- Типы контента (no `any`) ---

interface TitlePageContent {
  university?: string;
  department?: string;
  subject?: string;
  title?: string;
  studentName?: string;
  group?: string;
  teacherName?: string;
  teacherRank?: string;
  city?: string;
  year?: string;
}

interface HeadingContent {
  text: string;
  level: 1 | 2 | 3;
}

interface TextContent {
  text: string;
}

interface ImageContent {
  url?: string;
  caption?: string;
}

interface TableContent {
  rows: number;
  cols: number;
  data: string[];
}

type BlockContent =
  | TitlePageContent
  | HeadingContent
  | TextContent
  | ImageContent
  | TableContent;

interface Block {
  id: string;
  type: 'title-page' | 'heading' | 'text' | 'image' | 'table';
  content: BlockContent;
}

// --- Стили ---

// Font.register({...}) — оставь закомментированным, если шрифты не нужны сейчас.

const stylesheet = StyleSheet.create({
  // Общие стили страницы
  page: {
    backgroundColor: 'white',
    paddingTop: '20mm',
    paddingBottom: '20mm',
    paddingLeft: '25mm',
    paddingRight: '25mm',
    fontFamily: 'Times New Roman',
    fontSize: 12,
    lineHeight: 1.5,
    position: 'relative',
  },

  // Номер страницы
  pageNumber: {
    position: 'absolute',
    bottom: '10mm',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
  },

  // Титульный лист
  titlePageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  ministryText: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  departmentRow: {
    fontSize: 14,
    marginTop: 32,
    marginBottom: 8,
  },
  courseWorkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
  },
  subjectText: {
    fontSize: 14,
    marginBottom: 8,
  },
  signatureGrid: {
    marginTop: 24,
    width: '100%',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  signatureLabel: {
    fontSize: 11,
  },
  signaturePlaceholder: {
    fontSize: 7,
    textAlign: 'center',
  },
  signatureName: {
    fontSize: 11,
    fontWeight: 'medium',
    textAlign: 'right',
  },
  groupText: {
    fontSize: 10,
  },
  teacherRankText: {
    fontSize: 9,
    fontStyle: 'italic',
  },
  cityYear: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
  },

  // Содержание
  tocTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'uppercase',
  },
  tocEntry: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  tocText: {
    fontSize: 12,
  },
  tocTextBold: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tocDots: {
    flex: 1,
    borderBottom: '1px dotted #9CA3AF',
    marginHorizontal: 4,
    marginBottom: 2,
  },
  tocPage: {
    fontSize: 12,
  },

  // Заголовки
  heading1: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  heading2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  heading3: {
    fontSize: 13,
    fontWeight: 'semibold',
    marginTop: 16,
    marginBottom: 8,
  },

  // Текст
  paragraph: {
    marginBottom: 12,
    textAlign: 'justify',
    textIndent: '1.25cm',
  },

  // Изображения
  imageContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  image: {
    maxHeight: '100mm',
    objectFit: 'contain',
  },
  imageCaption: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },

  // Таблицы
  table: {
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'black',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 4,
    fontSize: 11,
  },
  tableCellHeader: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },

  // Пустой документ
  emptyDocument: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 80,
  },
});

// --- Оглавление ---

interface TOCEntry {
  text: string;
  level: number;
}

function collectTOC(blocks: Block[]): TOCEntry[] {
  const entries: TOCEntry[] = [];
  for (const block of blocks) {
    if (block.type === 'title-page') continue;
    if (block.type === 'heading') {
      const { text, level } = block.content as HeadingContent;
      entries.push({
        text: text || '',
        level: level || 1,
      });
    }
  }
  return entries;
}

// --- TitlePage --- Тут раньше была строка 235

const TitlePage: React.FC<{ block: Block }> = ({ block }) => {
  const c = block.content as TitlePageContent;
  return (
    <View style={stylesheet.titlePageContainer}>
      <View>
        <Text style={stylesheet.ministryText}>
          Министерство образования Республики Беларусь
        </Text>
        <Text style={stylesheet.ministryText}>
          УО «
          {c.university || 'БЕЛОРУССКИЙ ГОСУДАРСТВЕННЫЙ ЭКОНОМИЧЕСКИЙ УНИВЕРСИТЕТ'}
          »
        </Text>

        <View style={stylesheet.departmentRow}>
          <Text>Кафедра {c.department || '...'}</Text>
        </View>
      </View>

      <View>
        <Text style={stylesheet.courseWorkTitle}>КУРСОВАЯ РАБОТА</Text>
        <Text style={stylesheet.subjectText}>
          по дисциплине: {c.subject || 'Микроэкономика...'}
        </Text>
        <Text style={stylesheet.subjectText}>
          на тему: {c.title || 'Развитие банковской системы...'}
        </Text>
      </View>

      <View style={stylesheet.signatureGrid}>
        <View style={stylesheet.signatureRow}>
          <View>
            <Text style={stylesheet.signatureLabel}>Студент</Text>
            <Text style={stylesheet.groupText}>{c.group || 'Факультет, курс'}</Text>
          </View>
          <View>
            <Text style={stylesheet.signaturePlaceholder}>(подпись)</Text>
            <Text style={stylesheet.signaturePlaceholder}>(дата)</Text>
          </View>
          <Text style={stylesheet.signatureName}>{c.studentName || 'А.Б. Иванов(а)'}</Text>
        </View>

        <View style={stylesheet.signatureRow}>
          <View>
            <Text style={stylesheet.signatureLabel}>Руководитель</Text>
            <Text style={stylesheet.teacherRankText}>
              {c.teacherRank || 'канд. экон. наук, доцент'}
            </Text>
          </View>
          <View>
            <Text style={stylesheet.signaturePlaceholder}>(подпись) (оценка)</Text>
            <Text style={stylesheet.signaturePlaceholder}>(дата)</Text>
          </View>
          <Text style={stylesheet.signatureName}>{c.teacherName || 'А.Б. Иванов(а)'}</Text>
        </View>
      </View>

      <Text style={stylesheet.cityYear}>
        {c.city || 'МИНСК'} {c.year || new Date().getFullYear()}
      </Text>
    </View>
  );
};

// --- TableOfContents --- (фикс в стилях не нужен)

const TableOfContents: React.FC<{ entries: TOCEntry[]; hasTitlePage: boolean }> = ({
  entries,
  hasTitlePage,
}) => {
  return (
    <View>
      <Text style={stylesheet.tocTitle}>Содержание</Text>
      {entries.length === 0 ? (
        <Text style={stylesheet.emptyDocument}>Добавьте заголовки</Text>
      ) : (
        entries.map((entry, index) => (
          <View
            key={index}
            style={[
              stylesheet.tocEntry,
              { paddingLeft: `${(entry.level - 1) * 35}px` },
            ]}
          >
            <Text
              style={entry.level === 1 ? stylesheet.tocTextBold : stylesheet.tocText}
            >
              {entry.text}
            </Text>
            <View style={stylesheet.tocDots} />
            <Text
              style={stylesheet.tocPage}
              render={(props: { pageNumber: number }) => {
                const baseOffset = hasTitlePage ? 3 : 2;
                return `${baseOffset + index}`;
              }}
            />
          </View>
        ))
      )}
    </View>
  );
};

// --- ContentBlock --- (основное исправление)

const ContentBlock: React.FC<{ block: Block; imageIndex?: number }> = ({ block, imageIndex }) => {
  switch (block.type) {
    case 'heading': {
      const { text, level } = block.content as HeadingContent;
      const safeLevel = level === 2 || level === 3 ? level : 1;
      const styleMap: Record<number, any> = {
        1: stylesheet.heading1,
        2: stylesheet.heading2,
        3: stylesheet.heading3,
      };
      return <Text style={styleMap[safeLevel]}>{text || ''}</Text>;
    }

    case 'text': {
      const rawText = typeof block.content.text === 'string' ? block.content.text : '';
      const paragraphs = rawText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      return (
        <View>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={stylesheet.paragraph}>
              {paragraph || ' '}
            </Text>
          ))}
        </View>
      );
    }

    case 'image': {
      const { url, caption } = block.content as ImageContent;
      const safeUrl = typeof url === 'string' && url.length > 0 ? url : null;

      return (
        <View style={stylesheet.imageContainer}>
          {safeUrl ? (
            <>
              <Image src={safeUrl} style={stylesheet.image} />
              <Text style={stylesheet.imageCaption}>
                Рисунок {imageIndex}. {typeof caption === 'string' ? caption : ''}
              </Text>
            </>
          ) : (
            <Text style={stylesheet.emptyDocument}>[Изображение не указано]</Text>
          )}
        </View>
      );
    }

    case 'table': {
      const t = block.content as TableContent;
      const rows = Number.isFinite(t.rows) ? t.rows : 3;
      const cols = Number.isFinite(t.cols) ? t.cols : 3;
      const data = Array.isArray(t.data) ? t.data : [];

      return (
        <View style={stylesheet.table}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <View key={rowIndex} style={stylesheet.tableRow}>
              {Array.from({ length: cols }).map((_, colIndex) => {
                const cellIndex = rowIndex * cols + colIndex;
                return (
                  <View
                    key={colIndex}
                    style={[
                      stylesheet.tableCell,
                      rowIndex === 0 ? stylesheet.tableCellHeader : undefined,
                      // вместо `rowIndex === 0 && stylesheet.tableCellHeader`
                    ]}
                  >
                    <Text>{data[cellIndex] || ''}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      );
    }

    default:
      return null;
  }
};

// --- DocumentPreviewPDF ---

interface DocumentPreviewPDFProps {
  blocks: Block[];
  projectName: string;
}

const DocumentPreviewPDF: React.FC<DocumentPreviewPDFProps> = ({ blocks }) => {
  const titleBlock = blocks.find((b) => b.type === 'title-page');
  const contentBlocks = blocks.filter((b) => b.type !== 'title-page');
  const tocEntries = collectTOC(blocks);
  const imageBlocks = blocks.filter((b) => b.type === 'image');

  const getImageIndex = (blockId: string): number => {
    const idx = imageBlocks.findIndex((b) => b.id === blockId);
    return idx === -1 ? 0 : idx + 1; // избегаем 0, если блок не найден
  };

  if (blocks.length === 0) {
    return (
      <Document>
        <Page size="A4" style={stylesheet.page}>
          <Text style={stylesheet.emptyDocument}>Документ пуст</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {/* Титульный лист */}
      {titleBlock && (
        <Page size="A4" style={stylesheet.page}>
          <TitlePage block={titleBlock} />
          <Text
            style={stylesheet.pageNumber}
            render={(props: { pageNumber: number }) => `${props.pageNumber}`}
            fixed
          />
        </Page>
      )}

      {/* Страница содержания */}
      <Page size="A4" style={stylesheet.page}>
        <TableOfContents entries={tocEntries} hasTitlePage={!!titleBlock} />
        <Text
          style={stylesheet.pageNumber}
          render={(props: { pageNumber: number }) => `${props.pageNumber}`}
          fixed
        />
      </Page>

      {/* Страницы контента */}
      <Page size="A4" style={stylesheet.page} wrap>
        {contentBlocks.map((block) => (
          <ContentBlock
            key={block.id}
            block={block}
            imageIndex={block.type === 'image' ? getImageIndex(block.id) : undefined}
          />
        ))}
        <Text
          style={stylesheet.pageNumber}
          render={(props: { pageNumber: number }) => `${props.pageNumber}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default DocumentPreviewPDF;