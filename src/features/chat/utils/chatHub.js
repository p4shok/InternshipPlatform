import * as signalR from "@microsoft/signalr";
import { CHAT_HUB_ENDPOINT } from "../../../api/endpoints";
import { getAccessToken } from "../../auth/utils/session";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
const appBaseUrl = baseUrl.replace(/\/api\/?$/, "");
const hubUrl = `${appBaseUrl}${CHAT_HUB_ENDPOINT}`;

let connectionPromise = null;

const createConnection = () =>
  new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => getAccessToken(),
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

export const getChatConnection = async () => {
  if (!connectionPromise) {
    const connection = createConnection();
    connectionPromise = connection.start().then(() => connection).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
};
