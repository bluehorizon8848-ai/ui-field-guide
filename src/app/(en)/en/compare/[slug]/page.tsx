import {
  createCompareDetailPage,
  createCompareDetailMetadata,
  compareStaticParams,
} from '@/app/shared/pages';

const LOCALE = 'en' as const;

export const generateStaticParams = compareStaticParams;
export const generateMetadata = createCompareDetailMetadata(LOCALE);
export default createCompareDetailPage(LOCALE);
