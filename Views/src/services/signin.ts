import config from "@UserFront/config";

interface ISignin {
  email: string;
  password: string;
}

export default async function signin({ email, password }: ISignin) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email,
      password,
    });

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      config.baseURL + "/api/auth/login",
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Erro ao realizar chamada");
    }

    return response.json();
  } catch (error) {
    return error;
  }
}
