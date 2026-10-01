import { createExplorePage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'en' as const;

export const metadata = createStaticMetadata('/explore', LOCALE);
export default createExplorePage(LOCALE);
