import { ReactNode } from "react";

interface IModal {
  children: ReactNode | ReactNode[];
  oneSide?: boolean;
}

export default function Modal({ children, oneSide }: IModal) {
  return (
    <main className={`absolute ${oneSide ? "w-[520px]" : "w-[920px]"} h-screen lg:h-[640px] bg-white flex items-center justify-center rounded-2xl overflow-hidden`}>
      {children}
    </main>
  );
}
