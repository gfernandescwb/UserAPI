import IUserTestState from "@UserFront/types/interfaces/userTest";

interface ICheckInternetSpeed {
  setUserTest: (value: (prevState: IUserTestState) => IUserTestState) => void;
}

async function checkInternetSpeed({ setUserTest }: ICheckInternetSpeed) {
  const imageUrl =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Edsger_Wybe_Dijkstra.jpg/800px-Edsger_Wybe_Dijkstra.jpg";
  const startTime = Date.now();

  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const endTime = Date.now();

  const duration = (endTime - startTime) / 1000;
  const fileSizeInBits = blob.size * 8;
  const speedBps = fileSizeInBits / duration;
  const speedKbps = speedBps / 1024;
  const speedMbps = speedKbps / 1024;

  setUserTest((prevState: IUserTestState) => ({
    ...prevState,
    speed: speedMbps > 2,
  }));
}

export default checkInternetSpeed;