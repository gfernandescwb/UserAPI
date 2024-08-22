import { ReactNode } from "react";
import Image from "next/image";

import Logo1 from "@UserFront/assets/logo1.png";
import Logo2 from "@UserFront/assets/logo2.png";

interface ILeft {
  title: string;
  subtitle: string;
  children: ReactNode | ReactNode[];
  oneSide?: boolean;
}

export default function Left({ children, subtitle, title, oneSide }: ILeft) {
  return (
    <section className={`${oneSide ? "w-full" : "w-[60%]"} h-full bg-white flex flex-col justify-between`}>
      <div className="w-full flex flex-col p-20 pb-0">
        <h1 className="text-4xl text-black font-[400] mb-2">{title}</h1>
        <h3 className="text-[#5C5959] text-lg font-[400]">{subtitle}</h3>
      </div>

      {children}

      <div className="w-full p-10 flex items-center justify-between">
        <Image src={Logo2.src} width={Logo2.width * 1.25} height={Logo2.height * 1.25} alt="Logo 2" />
        <Image src={Logo1.src} width={Logo1.width * 1.25} height={Logo1.height * 1.25} alt="Logo 1" />
      </div>
    </section>
  );
}
