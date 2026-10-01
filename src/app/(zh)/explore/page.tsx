import { createExplorePage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/explore', LOCALE);
export default createExplorePage(LOCALE);
