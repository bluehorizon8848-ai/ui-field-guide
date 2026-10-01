import { createCompareIndexPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/compare', LOCALE);
export default createCompareIndexPage(LOCALE);
