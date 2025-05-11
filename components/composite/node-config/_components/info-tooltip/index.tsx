import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const InfoTooltip: React.FC<{
  infoTooltip: string;
  className?: string;
}> = ({ infoTooltip, className }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button">
          <div className={className}>
            <Image src="/info-thin.svg" alt="Info" width={20} height={20} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-[14rem]">
            <p>{infoTooltip}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
