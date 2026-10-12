import { createGlossaryPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/glossary', LOCALE);
export default createGlossaryPage(LOCALE);
