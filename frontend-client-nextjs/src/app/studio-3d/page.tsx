import { Metadata } from 'next';
import { Studio3DClientView } from '@/components/studio/Studio3DClientView';

export const metadata: Metadata = {
  title: '3D Studio | Pet Zone',
  description:
    'Không gian 3D tương tác thời gian thực ứng dụng Unity WebGL, cho phép quan sát mô hình 360 độ và ướm thử phụ kiện thú cưng trực tiếp trên trình duyệt.',
  keywords: [
    'pet 3d studio',
    'unity webgl',
    'cửa hàng thú cưng 3d',
    'mô hình 3d thú cưng',
    'pet zone 3d',
  ],
  openGraph: {
    title: '3D Studio — Trải Nghiệm & Ướm Thử Đồ Thú Cưng 3D | Pet Zone',
    description:
      'Không gian tương tác 3D đa chiều với công nghệ Unity WebGL. Quan sát toàn diện 360°, phóng to chi tiết sản phẩm và ướm thử phụ kiện trực tiếp.',
    type: 'website',
  },
};

export default function Studio3DPage() {
  return <Studio3DClientView />;
}
