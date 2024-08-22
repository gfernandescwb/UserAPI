"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSolidUser, BiSolidLock, BiSolidCamera } from "react-icons/bi";

import signin from "@UserFront/services/signin";
import Left from "@UserFront/components/Left";
import Right from "@UserFront/components/Right";
import Modal from "@UserFront/components/Modal";
import Input from "@UserFront/components/Input";
import Waves from "@UserFront/assets/waves.png";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signin({
        email,
        password,
      });
      if (!response.token) {
        setError("Falha no login. Verifique suas credenciais.");
      }
    } catch (error) {
      setError("Ocorreu um erro. Tente novamente mais tarde.");
    }
  };

  return (
    <Modal>
      <Left title="Bem Vindo," subtitle="Faça o login para continuar.">
        <form onSubmit={handleSubmit} className="flex flex-col w-full px-20 gap-8 items-center">
          <Input
            Icon={() => <BiSolidUser size={26} color="#7C7C7C" />}
            placeholder="Usuário"
            type="text"
            value={email}
            onChange={setEmail}
          />
          <Input
            Icon={() => <BiSolidLock size={26} color="#7C7C7C" />}
            placeholder="Senha"
            type="password"
            value={password}
            onChange={setPassword}
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="w-full flex flex-col gap-3 mt-4 items-center">
            <button
              className="bg-[#3E9F96] rounded-3xl w-1/2 p-3 text-white shadow-custom-offset font-[600]"
              type="submit"
            >
              ENTRAR
            </button>
            <Link href="/forget-password">
              <span className="text-[#3E9F96] text-md font-[300]">
                Esqueceu sua senha?
              </span>
            </Link>
          </div>
        </form>
      </Left>

      <Right
        title="Teste de requisitos"
        subtitle="Teste seus acessos a câmera, microfone e velocidade da internet."
      >
        <div className="flex flex-row items-center gap-3 justify-center my-12">
          <Image
            className="pt-3"
            src={Waves.src}
            width={Waves.width * 2}
            height={Waves.height * 2}
            alt=""
          />
          <div className="border-2 rounded-full border-[#FFFFFF54] shadow-white-offset w-[62px] h-[54px] flex items-center justify-center">
            <BiSolidCamera size={32} color="#fff" />
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => router.push("/user-test")}
            className="bg-white rounded-3xl w-full p-3 text-[#3E9F96] shadow-custom-offset font-[600]"
            type="button"
          >
            Realizar Teste
          </button>
        </div>
      </Right>
    </Modal>
  );
}
