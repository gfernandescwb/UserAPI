"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import Left from "@UserFront/components/Left";
import Modal from "@UserFront/components/Modal";
import Email from "@UserFront/assets/email.png";

export default function SendEmail() {
  const router = useRouter();

  return (
    <Modal oneSide>
      <Left
        title="E-mail enviado!"
        subtitle="Verifique sua caixa de entrada e acesso o link para redefinição de senha."
        oneSide
      >
        <div className="w-full flex flex-col mt-4 items-center gap-8">
          <Image
            src={Email.src}
            width={Email.width * 1.5}
            height={Email.height * 1.5}
            alt=""
          />
          <button
            onClick={() => router.push("/")}
            className="bg-[#3E9F96] rounded-3xl w-1/2 p-3 text-white shadow-custom-offset font-[600]"
            type="button"
          >
            Login
          </button>
        </div>
      </Left>
    </Modal>
  );
}
