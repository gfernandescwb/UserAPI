"use client";

import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";

import Left from "@UserFront/components/Left";
import Modal from "@UserFront/components/Modal";
import Input from "@UserFront/components/Input";

export default function ForgetPassword() {
  const router = useRouter();

  return (
    <Modal oneSide>
      <Left
        title="Esqueceu sua senha?"
        subtitle="Informe o endereço de e-mail cadastrado para receber o link de redefinição de senha."
        oneSide
      >
        <div className="flex flex-col w-full px-20 gap-8 items-center">
          <Input
            Icon={() => <MdEmail size={32} color="#45454599" />}
            type="email"
            placeholder="Email"
            value=""
            onChange={() => {}}
          />
          <div className="w-full flex flex-col gap-3 mt-4 items-center">
            <button
              onClick={() => router.push("/send-email")}
              className="bg-[#3E9F96] rounded-3xl w-1/2 p-3 text-white shadow-custom-offset font-[600]"
              type="button"
            >
              ENVIAR
            </button>
          </div>
        </div>
      </Left>
    </Modal>
  );
}
