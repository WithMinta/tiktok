import axios from "axios";
import FormData from "form-data";
import {
  ITiktokGetUserInfoData,
  ITikTokGetUserInfoResponse, ITikTokPostUserVideoData,
  ITiktokRefreshUserAccessToken,
  ITikTokRefreshUserAccessTokenResponse
} from "./types";

const TIKTOK_URL = "https://open-api.tiktok.com";
const MAX_SIZE = 50 * 1024 * 1024; // 50MB , maximum size to upload.

export default class TTDeveloperAPI {
  constructor(clientKey: string, clientSecret: string) {
    this.clientKey = clientKey || process.env.tiktok_client_key_business;
    this.clientSecret = clientSecret || process.env.tiktok_client_secret_business;
  }

  private readonly clientKey: string;
  private readonly clientSecret: string;

  async postVideo(tiktokData: ITikTokPostUserVideoData): Promise<string | undefined> {
    const fileStream = await axios.get(tiktokData.video_url, { responseType: "stream" });

    const formData = new FormData();
    formData.append("video", fileStream.data);


    const response = await axios.post(`${ TIKTOK_URL }/share/video/upload/?open_id=${ tiktokData.user_id }&access_token=${ tiktokData.access_token }`, formData, {
      headers: formData.getHeaders(),
      maxContentLength: MAX_SIZE,
      maxBodyLength: MAX_SIZE
    });

    return response?.data?.data?.share_id;
  }

  async refreshAccessToken(tiktokData: ITiktokRefreshUserAccessToken): Promise<ITikTokRefreshUserAccessTokenResponse> {
    let requestUrl = "";
    requestUrl = `${ TIKTOK_URL }/oauth/refresh_token`;
    requestUrl += "?client_key=" + this.clientKey;
    requestUrl += "&client_secret=" + this.clientSecret;
    requestUrl += "&refresh_token=" + tiktokData.refresh_token;
    requestUrl += "&grant_type=refresh_token";

    const response = await axios.get(requestUrl);
    return response.data;
  }

  // Documentation for this API - https://developers.tiktok.com/doc/display-api-user-info/
  async getUserInfo(tiktokData: ITiktokGetUserInfoData): Promise<ITikTokGetUserInfoResponse> {
    const defaultFields = ["open_id", "union_id", "avatar_url", "avatar_url_100", "avatar_url_200", "avatar_large_url", "display_name"];
    const requestUrl = `${ TIKTOK_URL }/user/info/`;
    const payload = {
      open_id: tiktokData.open_id,
      access_token: tiktokData.access_token,
      fields: tiktokData.fields ? tiktokData.fields : defaultFields
    };

    const userInfoResponse = await axios.post(requestUrl, payload);
    return userInfoResponse.data;
  }

  async exchangeCodeForAccessToken(code: string) {
    let requestUrl = `${ TIKTOK_URL }/oauth/access_token`;
    requestUrl += "?client_key=" + this.clientKey;
    requestUrl += "&client_secret=" + this.clientSecret;
    requestUrl += "&code=" + code;
    requestUrl += "&grant_type=authorization_code";

    const response = await axios.post(requestUrl);

    return response.data;
  }
}
