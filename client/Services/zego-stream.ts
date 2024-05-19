import { ILivestream } from "@/types/streams";

export const appID = 1558471318;
export const serverSecret = "1558471318";

export const getStreams = async (where:Partial<ILivestream> = {}) => {
  try {
    const queryParams = new URLSearchParams(where as any).toString();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestream?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error:any) {
    console.log(error.message);
  }
}

export const getStream = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestream/${id}`);
    const data = await response.json();
    return data;
  } catch (error:any) {
    console.log(error.message);
  }
}

export const createStream = async (stream: Partial<ILivestream>) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(stream),
    });
    const data = await response.json();
    return data;
  } catch (error:any) {
    console.log(error.message);
  }
}


export const updateStream = async (id: string, stream: Partial<ILivestream>) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestream/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,

      },
      body: JSON.stringify(stream),
    });
    const data = await response.json();
    return data;
  } catch (error:any) {
    console.log(error.message);
  }
}

export const updateStream_all = async (where: Partial<ILivestream>, stream: Partial<ILivestream>) => {
  try {
    const queryParams = new URLSearchParams(where as any).toString();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestream-conditions?${queryParams}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(stream),
    });
    const data = await response.json();
    return data;
  } catch (error:any) {
    console.log(error.message);
  }
};