import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <LoadingSpinner />
    </div>
  );
}
