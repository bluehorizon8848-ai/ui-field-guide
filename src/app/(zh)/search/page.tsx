import { createSearchPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/search', LOCALE);
export default createSearchPage(LOCALE);
