"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BiSolidCamera } from "react-icons/bi";

import Left from "@UserFront/components/Left";
import Right from "@UserFront/components/Right";
import Modal from "@UserFront/components/Modal";
import Info from "@UserFront/components/Info";
import checkInternetSpeed from "@UserFront/utils/internetSpeed";
import checkBrowser from "@UserFront/utils/checkBrowser";
import checkMediaDevices from "@UserFront/utils/checkMedia";
import IUserTestState from "@UserFront/types/interfaces/userTest";

export default function UserTest() {
  const router = useRouter();

  const [userTest, setUserTest] = useState<IUserTestState>({
    browser: false,
    camera: false,
    foundCamera: false,
    foundMicrophone: false,
    microphone: false,
    speed: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    checkMediaDevices({
      setUserTest,
      videoRef,
    });
    checkBrowser({
      setUserTest,
    });
    checkInternetSpeed({
      setUserTest,
    });
  }, []);

  return (
    <Modal>
      <Left title="Teste de requisitos técnicos" subtitle="">
        <div className="w-full px-20 flex flex-col items-center gap-2">
          <Info label="Câmera não encontrada." status={userTest.foundCamera} />
          <Info label="Acesso a câmera bloqueado." status={userTest.camera} />
          <Info
            label="Microfone disponível."
            status={userTest.foundMicrophone}
          />
          <Info
            label="Acesso ao microfone disponível."
            status={userTest.microphone}
          />
          <Info
            label="Navegador não compatível - Favor utilizar o Google Chrome"
            status={userTest.browser}
          />
          <Info
            label="Velocidade da internet suficiente."
            status={userTest.speed}
          />
        </div>
      </Left>

      <Right title="" subtitle="">
        <div className="w-full h-full flex flex-col items-center justify-center gap-8">
          <div className="flex items-center w-full gap-4">
            <div className="border-2 rounded-full border-[#FFFFFF54] shadow-white-offset w-[54px] h-[54px] flex items-center justify-center">
              <BiSolidCamera size={32} color="#fff" />
            </div>
            <h1 className="text-2xl text-white font-[400]">Câmera</h1>
          </div>

          <div className="w-full h-1/2 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full"
              autoPlay
              muted
            ></video>
          </div>

          <div className="w-full flex flex-col gap-3 mt-4 items-center">
            <button
              onClick={() => router.push("/")}
              className="bg-white rounded-3xl w-full p-3 text-[#3E9F96] shadow-custom-offset font-[400]"
              type="button"
            >
              Concluído
            </button>
          </div>
        </div>
      </Right>
    </Modal>
  );
}
