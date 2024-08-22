import { IoMdAlert } from "react-icons/io";
import { PiCheckFat } from "react-icons/pi";

interface IInfo {
  label: string;
  status: boolean;
}

export default function Info({ label, status }: IInfo) {
  const rebBg = "#E23A3A54";
  const redColor = "#991616";
  const greenBg = "#3E9F9663";
  const greenColor = "#28625C";

  return (
    <div
      className={`bg-[${status ? greenBg : rebBg}] p-2 w-full rounded-sm flex items-center gap-2`}
    >
      {status ? (
        <PiCheckFat size={32} color={greenColor} />
      ) : (
        <IoMdAlert size={32} color={redColor} />
      )}

      <span className={`text-[${status ? greenColor : redColor}] text-lg w-[calc(100%-32px)]`}>
        {label}
      </span>
    </div>
  );
}
