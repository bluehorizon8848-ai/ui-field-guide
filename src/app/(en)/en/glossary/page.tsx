import { createGlossaryPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'en' as const;

export const metadata = createStaticMetadata('/glossary', LOCALE);
export default createGlossaryPage(LOCALE);
