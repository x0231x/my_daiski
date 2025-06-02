import Container from '@/components/container';
import Process from './_components/process';

export default function CartLayout({ children }) {
  return (
    <>
      <Container>
<<<<<<< HEAD
        {/* <h3 className="text-h3-tw text-primary-600 mt-5">CART | 購物車 </h3> */}
        <div className="mb-8">{children}</div>
=======
        <h3 className="text-h3-tw text-primary-600">CART | 購物車 </h3>
        <div className="min-h-dvh">{children}</div>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
      </Container>
    </>
  );
}
