import axios, { AxiosResponse } from "axios";
import { TiktokActions, TiktokOauthGrantTypes, truncateString } from "./common";
import {
  ITiktokBusinessAccessTokenResponse,
  ITiktokBusinessExchangeCodeForAccessToken, ITikTokBusinessVideoInfo,
  ITikTokGetBusinessData, ITikTokGetBusinessResponse,
  ITikTokGetBusinessVideoInfoData,
  ITikTokPostBusinessVideoData,
  ITikTokRefreshBusinessAccessTokenData
} from "./types";

const TIKTOK_API_BUSINESS = "https://business-api.tiktok.com/open_api";

const API_VERSION_3 = "v1.3";
const API_VERSION_2 = "v1.2";

export default class TiktokBusinessAPI {
  constructor(clientKey: string, clientSecret: string) {
    this.clientKey = clientKey || process.env.tiktok_client_key_business;
    this.clientSecret = clientSecret || process.env.tiktok_client_secret_business;
  }

  private readonly clientKey: string;
  private readonly clientSecret: string;


  async exchangeCodeForAccessToken(data: ITiktokBusinessExchangeCodeForAccessToken): Promise<ITiktokBusinessAccessTokenResponse> {
    const requestUrl = `${ TIKTOK_API_BUSINESS }/oauth2/token/?business=tt_user`;

    const payload = {
      client_id: this.clientKey,
      client_secret: this.clientSecret,
      grant_type: TiktokOauthGrantTypes.AUTH_CODE,
      auth_code: data.code
    };

    const response: AxiosResponse<ITiktokBusinessAccessTokenResponse> = await axios.post(requestUrl, payload);
    return response.data;
  }

  async refreshAccessToken(tiktokData: ITikTokRefreshBusinessAccessTokenData): Promise<ITiktokBusinessAccessTokenResponse> {
    const requestUrl = `${ TIKTOK_API_BUSINESS }/oauth2/token/?business=tt_user`;
    const payload = {
      client_id: this.clientKey,
      client_secret: this.clientSecret,
      grant_type: TiktokOauthGrantTypes.REFRESH_TOKEN,
      refresh_token: tiktokData.refresh_token,
    };

    const response: AxiosResponse<ITiktokBusinessAccessTokenResponse> = await axios.post(requestUrl, payload);
    return response.data;
  }

  // Documentation for this API - https://ads.tiktok.com/marketing_api/docs?id=1733326495444994
  async getBusinessInfo(tiktokData: ITikTokGetBusinessData): Promise<ITikTokGetBusinessResponse> {
    const { access_token, refresh_token, business_id, fields, shouldRefreshToken = true } = tiktokData;
    const defaultFields = ["display_name", "profile_image", "username"];
    const fieldsToUse = fields?.length ? fields : defaultFields;
    let accessTokenToUse = access_token;
    let businessIdToUse = business_id;
    if (shouldRefreshToken && refresh_token) {
      const tokenRefreshed = await this.refreshTokenInternal(refresh_token);

      accessTokenToUse = tokenRefreshed.access_token;
      businessIdToUse = tokenRefreshed.creator_id;
    }

    const requestUrl = `${ TIKTOK_API_BUSINESS }/${ API_VERSION_3 }/business/get/?business_id=${businessIdToUse}&access_token=${access_token}&fields=${JSON.stringify(fieldsToUse)}`;
    const userInfoResponse = await axios.get(requestUrl, {
      headers: { "Access-Token": accessTokenToUse }
    });

    if (userInfoResponse?.data?.error?.message) {
      throw new Error(`user_tiktok_get_business_user_info_failed_no_user_info_response_from_tiktok ${userInfoResponse?.data?.error?.message}`);
    }

    const response = {
      accessToken: accessTokenToUse,
      ...userInfoResponse.data,
    };
    return response;
  }

  async postVideo(tiktokData: ITikTokPostBusinessVideoData): Promise<string> {

    const { caption, access_token, business_id, refresh_token, video_url, disable_comment, disable_stitch, disable_duet, should_refresh_token = true } = tiktokData;

    let captionText = caption || "";
    if (captionText && captionText.length > 145) {
        // TikTok only can get 150 characters
        captionText = truncateString(caption, 145);
    }

    let accessTokenToUse = access_token;
    let businessIdToUse = business_id;
    if (should_refresh_token && refresh_token) {

        const tokenRefreshed = await this.refreshTokenInternal(refresh_token);
        accessTokenToUse = tokenRefreshed.access_token;
        businessIdToUse = tokenRefreshed.creator_id;
    }

    const payload = {
      business_id: businessIdToUse,
      video_url: video_url,
      post_info: {
        caption: captionText,
        disable_comment: disable_comment,
        disable_duet: disable_duet,
        disable_stitch: disable_stitch
      }
    };

    const response = await axios.post(`${ TIKTOK_API_BUSINESS }/${ API_VERSION_2 }/business/videos/publish/`, payload, { headers: { "Access-Token": accessTokenToUse } });
    return response?.data?.data?.share_id;
  }

  async getVideoInfo(tiktokData: ITikTokGetBusinessVideoInfoData): Promise<ITikTokBusinessVideoInfo[]> {
    const { page_id, post_ids, fields, access_token, refresh_token, should_refresh_token = true } = tiktokData;

    const fieldsForVideoData = fields ? fields : ["audience_countries", "item_id", "likes", "video_views", "shares", "reach", "comments"];
    let accessTokenToUse = access_token;

    if (should_refresh_token && refresh_token) {
      const tokenRefreshed = await this.refreshTokenInternal(refresh_token);

      accessTokenToUse = tokenRefreshed.access_token;
    }

    const response = await axios.post(`x${ TIKTOK_API_BUSINESS }/${ API_VERSION_2 }/business/videos/list/`, {
        business_id: page_id,
        filters: { video_ids: post_ids },
        fields: fieldsForVideoData
      },
      { headers: { "Access-Token": accessTokenToUse } }
    );
    return response?.data?.data?.videos;
  }

  private async refreshTokenInternal(refreshToken: string) {
    const tokenRefreshed = await this.refreshAccessToken({ refresh_token: refreshToken, actionType: TiktokActions.REFRESH_BUSINESS_ACCESS_TOKEN });
    if (tokenRefreshed?.error_code) {
      throw new Error(
        `failed to refresh the access token with error ${ tokenRefreshed?.error_code }`,
      );
    }
    return tokenRefreshed;
  }
}
