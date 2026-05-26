

import { Suspense, lazy } from "react";
import Spinner from "../Components/Spinner";

const ContactPage = lazy(() => import("./ContactClient"));

export default function Contact() {
  return (
    <Suspense fallback={<Spinner />}>
      <ContactPage />
    </Suspense>
  );
}