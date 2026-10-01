import {
  createCompareDetailPage,
  createCompareDetailMetadata,
  compareStaticParams,
} from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const generateStaticParams = compareStaticParams;
export const generateMetadata = createCompareDetailMetadata(LOCALE);
export default createCompareDetailPage(LOCALE);
