import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const FooterLogo = ({ menu = false }: { menu?: boolean }) => {
  return (
    <>
      <div className="relative xxs:hidden flex justify-center mt-auto text-font  w-full rounded-lg">
        <div
          className={cn(
            "relative bg-background-reverse text-font-header translate-y-[42%] ",
            menu && "bg-background text-font "
          )}
        >
          <Logo size={menu ? "lg" : "xl"} className="" />
          <p
            className={cn(
              "absolute right-[6%]  flex pl-2 text-sm ",
              menu ? "top-[19%]" : "top-[22%]"
            )}
          >
            &copy;
            {new Date().getFullYear()}{" "}
            <span className={menu ? "hidden" : ""}>All rights reserved.</span>
          </p>
        </div>
      </div>
      <div className="relative hidden xxs:flex justify-center translate-y-[38%] mt-auto mx-auto gap-x-2 text-font  w-full rounded-lg">
        <Logo size="xl" className=" " />
        <p className="absolute right-[70px] top-[18px] flex pl-2 text-sm ">
          {new Date().getFullYear()}
        </p>
      </div>
    </>
  );
};
