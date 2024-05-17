import Lottie, { useLottie } from "lottie-react";
import loader1 from "@/assets/loader-1.json";
import loader2 from "@/assets/loader-2.json";
import loader3 from "@/assets/loader-3.json";

export default function Multiloader({ run }: { run: boolean}) {
  const loaders = [
    loader1,
    loader2,
    loader3,
    // loader4,
  ];

  return (
    <div>
      <Lottie animationData={loaders[Math.round(Math.random() * loaders.length)]} loop={run} />
    </div>
  );
}
