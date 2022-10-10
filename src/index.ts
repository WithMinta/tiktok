import {
  IAdsAccountInfoData,
  IAdsAccountRegistrationData,
  IGetCreativeReportData,
  IGetVideosInfoData,
  ITiktokBusinessExchangeCodeForAccessToken,
  ITiktokCreativePluginData,
  ITikTokGetBusinessData, ITikTokGetBusinessVideoInfoData,
  ITiktokGetUserInfoData, ITikTokPostBusinessVideoData, ITikTokPostUserVideoData,
  ITikTokRefreshBusinessAccessTokenData,
  ITiktokRefreshUserAccessToken,
  IUploadVideoToAdsAccountData,
  TiktokData
} from "./types";
import { TiktokActions } from "./common";
import TTCreativePlugin from "./ttCreativePlugin";
import TTAdsAPI from "./ttAdsAPI";
import TiktokBusinessAPI from "./ttBusinessAPI";
import TTDeveloperAPI from "./ttDeveloperAPI";

class TikTok {
  constructor(clientKey: string = "", clientSecret: string = "") {
    this.clientKey = clientKey || process.env.tiktok_client_key_business;
    this.clientSecret = clientSecret || process.env.tiktok_client_secret_business;
  }

  private readonly clientKey: string;
  private readonly clientSecret: string;

  async handle(tiktokData: TiktokData) {
    const ttAdsAPI = new TTAdsAPI();
    const ttCreativePlugin = new TTCreativePlugin();
    const ttBusinessAPI = new TiktokBusinessAPI(this.clientKey, this.clientSecret);
    const ttUserAPI = new TTDeveloperAPI(this.clientKey, this.clientSecret);

    switch (tiktokData.actionType) {
      /* Creative Plugin */
      case TiktokActions.CREATIVE_PLUGIN:
        return ttCreativePlugin.getURLReadyToUploadMediaToAdvertizerAccount(tiktokData as ITiktokCreativePluginData);
      /* Ads */
      case TiktokActions.ADS_ACCOUNT_REGISTRATION:
        return await ttAdsAPI.getPermanentAccessToken(tiktokData as IAdsAccountRegistrationData);
      case TiktokActions.GET_ADVERTISERS_ACCOUNT_INFO:
        return await ttAdsAPI.getAdvertisersAccountInfo(tiktokData as IAdsAccountInfoData);
      case TiktokActions.UPLOAD_VIDEO_TO_ADS_ACCOUNT:
        return await ttAdsAPI.uploadVideoToAdsAccount(tiktokData as IUploadVideoToAdsAccountData);
      case TiktokActions.GET_VIDEOS_INFO:
        return await ttAdsAPI.getVideosInfo(tiktokData as IGetVideosInfoData);
      case TiktokActions.GET_CREATIVE_REPORT:
        return await ttAdsAPI.getCreativeReport(tiktokData as IGetCreativeReportData);
      /* Business */
      case TiktokActions.EXCHANGE_CODE_FOR_ACCESS_TOKEN:
        return await ttBusinessAPI.exchangeCodeForAccessToken(tiktokData as ITiktokBusinessExchangeCodeForAccessToken);
      case TiktokActions.GET_BUSINESS_INFO:
        return await ttBusinessAPI.getBusinessInfo(tiktokData as ITikTokGetBusinessData);
      case TiktokActions.REFRESH_BUSINESS_ACCESS_TOKEN:
        return await ttBusinessAPI.refreshAccessToken(tiktokData as ITikTokRefreshBusinessAccessTokenData);
      case TiktokActions.POST_BUSINESS_VIDEO:
        return await ttBusinessAPI.postVideo(tiktokData as ITikTokPostBusinessVideoData);
      case TiktokActions.GET_BUSINESS_VIDEO_INFO:
        return await ttBusinessAPI.getVideoInfo(tiktokData as ITikTokGetBusinessVideoInfoData);
      /* User */
      case TiktokActions.GET_USER_INFO:
        return await ttUserAPI.getUserInfo(tiktokData as ITiktokGetUserInfoData);
      case TiktokActions.REFRESH_USER_ACCESS_TOKEN:
        return await ttUserAPI.refreshAccessToken(tiktokData as ITiktokRefreshUserAccessToken);
      case TiktokActions.POST_USER_VIDEO:
        return await ttUserAPI.postVideo(tiktokData as ITikTokPostUserVideoData);
      default:
        throw new Error("actionType is not supported");
    }
  }
}

export default TikTok;
export * from "./ttAdsAPI";
export * from "./ttBusinessAPI";
export * from "./ttCreativePlugin";
export * from "./ttDeveloperAPI";
export * from "./common";
export * from "./types";
