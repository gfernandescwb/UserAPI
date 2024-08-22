import { RefObject } from "react";

import IUserTestState from "@UserFront/types/interfaces/userTest";

interface ICheckMediaDevices {
  setUserTest: (value: (prevState: IUserTestState) => IUserTestState) => void;
  videoRef: RefObject<HTMLVideoElement>;
}

async function checkMediaDevices({
  setUserTest,
  videoRef,
}: ICheckMediaDevices) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setUserTest((prevState: IUserTestState) => ({
      ...prevState,
      foundCamera: true,
      foundMicrophone: true,
      camera: true,
      microphone: true,
    }));

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      setUserTest((prevState: IUserTestState) => ({
        ...prevState,
        camera: false,
        microphone: false,
      }));
    } else if (error.name === "NotFoundError") {
      setUserTest((prevState: IUserTestState) => ({
        ...prevState,
        foundCamera: false,
        foundMicrophone: false,
      }));
    } else {
      console.log("Erro desconhecido", error);
    }
  }
}

export default checkMediaDevices;
