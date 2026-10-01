import { createCompareIndexPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'en' as const;

export const metadata = createStaticMetadata('/compare', LOCALE);
export default createCompareIndexPage(LOCALE);
