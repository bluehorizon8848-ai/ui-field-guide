import { createLearnPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/learn', LOCALE);
export default createLearnPage(LOCALE);
