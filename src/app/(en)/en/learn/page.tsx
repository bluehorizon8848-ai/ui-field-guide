import { createLearnPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'en' as const;

export const metadata = createStaticMetadata('/learn', LOCALE);
export default createLearnPage(LOCALE);
