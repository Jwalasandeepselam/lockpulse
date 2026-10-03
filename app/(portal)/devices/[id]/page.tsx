import { initialDevices } from '@/lib/store';
import { DeviceDetailClient } from '@/components/devices/DeviceDetailClient';

export function generateStaticParams() {
  if (!initialDevices || initialDevices.length === 0) {
    return [{ id: 'preview' }];
  }
  return initialDevices.map((device) => ({
    id: device.id,
  }));
}

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
  return <DeviceDetailClient deviceId={params.id} />;
}
