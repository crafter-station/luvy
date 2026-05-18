import Image from "next/image";
import loveSitDown from "@/app/public/assets/love-sit-down.png";
import lovy from "@/app/public/assets/lovy.png";
import lovyHi from "@/app/public/assets/lovy-hi.png";
import { cn } from "@/lib/utils";

const mascotImages = {
  default: lovy,
  hi: lovyHi,
  sitting: loveSitDown,
};

export function LuvyMascot({
  className,
  pose = "default",
}: {
  className?: string;
  pose?: keyof typeof mascotImages;
}) {
  return (
    <div className={cn("relative mx-auto h-56 w-48", className)}>
      <Image
        alt="Luvy, the plush bunny love courier"
        className="object-contain"
        fill
        priority={pose === "default"}
        sizes="(min-width: 768px) 240px, 190px"
        src={mascotImages[pose]}
      />
    </div>
  );
}
