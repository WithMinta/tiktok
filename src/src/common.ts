export enum TiktokActions {
  CREATIVE_PLUGIN = "creativePlugin",
  ADS_ACCOUNT_REGISTRATION = "adsAccountRegistration",
  UPLOAD_VIDEO_TO_ADS_ACCOUNT = "uploadVideoToAdsAccount",
  GET_ADVERTISERS_ACCOUNT_INFO = "getAdvertisersAccountInfo",
  GET_VIDEOS_INFO = "getVideosInfo",
  GET_CREATIVE_REPORT = "getCreativeReport",
  EXCHANGE_CODE_FOR_ACCESS_TOKEN = "exchangeCodeForAccessToken",
  GET_USER_INFO = "getUserInfo",
  GET_BUSINESS_INFO = "getBusinessInfo",
  REFRESH_USER_ACCESS_TOKEN = "refreshUserAccessToken",
  REFRESH_BUSINESS_ACCESS_TOKEN = "refreshBusinessAccessToken",
  POST_USER_VIDEO = "postUserVideo",
  POST_BUSINESS_VIDEO = "postBusinessVideo",
  GET_BUSINESS_VIDEO_INFO = "getBusinessVideoInfo",
}

export enum TiktokOauthGrantTypes {
  REFRESH_TOKEN = "refresh_token",
  AUTH_CODE = "authorization_code"
}

export enum EMaterialType {
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
  INSTANT_PAGE = "INSTANT_PAGE"
}

export const truncateString = (text: string, limit = 100, endPrefix = "..."): string => {
  try {
    let result = text;
    if (text?.length > limit) {
      if (endPrefix) {
        const endPrefixLength = endPrefix.length;
        result = text.substring(0, limit - endPrefixLength) + endPrefix;
      } else {
        result = text.substring(0, limit);
      }
    }
    return result;
  } catch (e) {
    throw new Error(e);
  }
};
