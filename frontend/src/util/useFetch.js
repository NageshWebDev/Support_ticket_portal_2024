import { useState } from "react";

export default function useFetch() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  async function customFetch(url, payload) {
    setLoading(true);
    try {
      const response = await fetch(url, payload);

      if (!response.ok) throw Error("Request failed");

      const jsonResponse = await response.json();

      const customResponse = {
        success: true,
        data: jsonResponse,
        message: "Request Successed",
      };
      setData(customResponse);
    } catch (error) {
      const customResponse = {
        success: false,
        data: null,
        message: `Request Failed for url : ${url} : ${error.message}`,
      };
      setIsError(true);
      setError(customResponse);
    } finally {
      setLoading(false);
    }
  }

  const customGet = async (url) => {
    return await customFetch(url, { method: "GET" });
  };

  const customPost = async (url, body) => {
    return await customFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  };

  const customPatch = async (url, body) => {
    return await customFetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  };

  const customDelete = async (url) => {
    return await customFetch(url, { method: "DELETE" });
  };

  return {
    loading,
    data,
    error,
    isError,
    customDelete,
    customGet,
    customPost,
    customPatch,
  };
}
