import { Metadata } from 'next';
import MagazineClientPage from './MagazineClientPage';

export const metadata: Metadata = {
  title: 'Our Magazines - TMM India',
  description: 'Explore our collection of digital magazines featuring fashion, lifestyle, and more.',
  keywords: ['magazine', 'digital magazine', 'fashion', 'lifestyle', 'TMM India'],
};

export default function MagazinePage() {
  return <MagazineClientPage />
}