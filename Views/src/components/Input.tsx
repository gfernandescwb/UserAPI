import { ReactNode } from "react";

interface IInput {
  placeholder: string;
  type: string;
  Icon: () => ReactNode;
  value?: string;
  onChange: (value: string) => void;
}

export default function Input({ placeholder, type, Icon, onChange, value }: IInput) {
  return (
    <div className="w-full flex gap-2 items-center border-b-2 border-[#00000038]">
      <Icon />
      <input
        className="outline-none p-2 w-full text-[#7C7C7C]"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
