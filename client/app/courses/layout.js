<<<<<<< HEAD
'use client';
import Container from '@/components/container';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function CoursesLayout({ children }) {
  const pathname = usePathname();
  if (!pathname.startsWith('/courses/')) {
    return (
      <>
        <Container>{children}</Container>
      </>
    );
  } else {
    return <>{children}</>;
  }
  // return (
  //   <>
  //     <Container >{children}</Container>
  //   </>
  // );
=======
import Container from '@/components/container';

export default function CoachesLayout({ children }) {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
}
