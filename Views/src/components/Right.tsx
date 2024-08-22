import { ReactNode } from "react";

interface IRight {
  title: string;
  subtitle: string;
  children: ReactNode | ReactNode[];
  oneSide?: boolean;
}

export default function Right({ children, subtitle, title, oneSide }: IRight) {
  return oneSide ? null : (
    <section className="w-[40%] h-full bg-[#358C84FA] shadow-custom-inset flex flex-col py-14 px-10">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-4xl text-white font-[400]">{title}</h1>
        <h3 className="text-[#FFFFFF94] text-lg font-[400]">{subtitle}</h3>
      </div>
      {children}
    </section>
  );
}
