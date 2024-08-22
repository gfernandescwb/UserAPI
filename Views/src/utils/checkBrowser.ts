import IUserTestState from "@UserFront/types/interfaces/userTest";

interface ICheckBrowser {
  setUserTest: (value: (prevState: IUserTestState) => IUserTestState) => void;
}

function checkBrowser({ setUserTest }: ICheckBrowser) {
  const isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  setUserTest((prevState: IUserTestState) => ({
    ...prevState,
    browser: isChrome,
  }));
}

export default checkBrowser;
