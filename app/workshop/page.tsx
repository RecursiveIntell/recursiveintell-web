import type { Metadata } from 'next';
import { StudioHeader, StudioFooter } from '../components/StudioChrome';
import { pageMetadata } from '../lib/page-metadata';
import WorkshopExplorer from './workshop-explorer';
export const metadata: Metadata = pageMetadata('/workshop', {
  title: 'Circuit Workshop',
  description: 'ESP32, ESP32-S3 and select Arduino UNO Q projects with real maker photos, printable parts, firmware and practical build guides.',
});
export default function WorkshopPage() {
  return <div className="studio-page"><StudioHeader /><WorkshopExplorer /><StudioFooter /></div>;
}
