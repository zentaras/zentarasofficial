

import { Suspense, lazy } from "react";
import Spinner from "../Components/Spinner";

const AboutPage = lazy(() => import("./AboutClient"));

export default function About() {
  return (
    <Suspense fallback={<Spinner />}>
      <AboutPage />
    </Suspense>
  );
}