import LessonScreen from '@/components/game/LessonScreen';

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <LessonScreen lessonId={resolvedParams.id} />;
}
