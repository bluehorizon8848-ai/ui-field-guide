import { createFaqPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/faq', LOCALE);
export default createFaqPage(LOCALE);
