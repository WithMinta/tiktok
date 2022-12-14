import { EMaterialType, TiktokActions } from "./common";

export interface IBaseTiktokData {
    actionType: TiktokActions;
}

/* tiktok User (developer) Types */
export interface ITiktokRefreshUserAccessToken extends IBaseTiktokData {
    refresh_token: string;
}

export interface ITiktokGetUserInfoData extends IBaseTiktokData {
    access_token: string;
    open_id: string;
    fields?: string[];
}

export interface ITikTokRefreshUserAccessTokenResponse {
    data: {
        access_token: string;
        refresh_token: string;
        open_id: string;
        error_code?: string;
    };
}

export interface ITikTokGetCreativeReportResponse {
    code: number;
    message: string;
    request_id: string;
    data: {
        page_info: {
            page: number;
            page_size: number;
            total_number: number;
            total_page: number;
        };
        list: {
            info: {
                material_id: string;
                video_id: string;
                image_id: string;
                total_active_days: string;
            } & any;
            metrics: {
                spend: string;
                cpc: string;
                cpm: string;
                impressions: string;
                clicks: string;
                ctr: string;
                conversion: string;
                cost_per_conversion: string;
                conversion_rate: string;
                real_time_conversion: string;
                real_time_cost_per_conversion: string;
                video_play_actions: string;
                video_watched_2s: string;
                video_watched_6s: string;
            } & any;
        }[];
    };
}

export interface ITikTokGetUserInfoResponse {
    data: {
        user: {
            open_id: string;
            union_id: string;
            avatar_url: string;
            avatar_url_100: string;
            avatar_url_200: string;
            avatar_large_url: string;
            display_name: string;
        };
        error?: {
            message: string;
        };
    };
}

export interface ITikTokPostUserVideoData extends IBaseTiktokData {
    access_token: string;
    video_url: string;
    user_id: string;
}


/* tiktok Business Types */
export interface ITikTokGetBusinessVideoInfoData extends IBaseTiktokData {
    post_ids: string[];
    page_id: string;
    fields?: string[];
    access_token?: string;
    should_refresh_token?: boolean;
    refresh_token?: string;
}

export interface ITikTokBusinessVideoInfo {
    video_views: number;
    likes: number;
    comments: number;
    shares: number;
    reach: number;
}


export interface ITikTokPostBusinessVideoData extends IBaseTiktokData {
    access_token: string;
    video_url: string;
    business_id: string;
    disable_comment?: boolean;
    disable_duet?: boolean;
    disable_stitch?: boolean;
    should_refresh_token?: boolean;
    caption?: string;
    refresh_token?: string;
}

export interface ITiktokBusinessAccessTokenResponse {
    access_token: string;
    creator_id: string;
    expires: number;
    refresh_expires: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    error_code?: string;
}

export interface ITiktokBusinessExchangeCodeForAccessToken {
    actionType: TiktokActions;
    code: string;
}

export interface ITikTokGetBusinessData extends IBaseTiktokData {
    business_id: string;
    access_token: string;
    shouldRefreshToken?: boolean;
    refresh_token?: string;
    fields?: string[];
}

export interface ITikTokGetBusinessResponse {
    code: number;
    message: string;
    accessToken: string;
    data: {
        display_name: string;
        profile_image: string;
        username: string;
    };
}

export interface ITikTokRefreshBusinessAccessTokenData extends IBaseTiktokData {
    refresh_token: string;
}


/* tiktok Ads Types */
export interface IAdsAccountRegistrationData extends IBaseTiktokData {
    auth_code: string;
    app_id: string;
    secret: string;
}

export interface IAdsAccountInfoData extends IBaseTiktokData {
    advertiser_ids: Array<string>;
    access_token: string;
}
export interface IUploadVideoToAdsAccountData extends IBaseTiktokData {
    advertiser_id: string;
    access_token: string;
    video_url: string;
    upload_type: string;
    material_type: string;
}
export interface IGetVideosInfoData extends IBaseTiktokData {
    advertiser_id: string;
    access_token: string;
    video_ids: Array<string>;
}

export interface IGetCreativeReportData extends IBaseTiktokData {
    advertiser_id: string;
    access_token: string;
    material_type: EMaterialType;
    metrics_fields?: string[];
    filtering: {
        material_id?: string[];
        ad_id?: string[];
        adgroup_id?: string[];
        campaign_id?: string[];
        country_code?: string[];
        page_id?: string[];
        page_status?: string[];
        page_biz_type?: string[];
        page_template_type?: string[];
        app_profile_country?: string[];
        app_profile_external_app_id?: string[];
        customized_page_external_action?: string[];
        material_name?: string;
        ad_name?: string;
        adgroup_name?: string;
        campaign_name?: string;
        placement?: any[];
        spend?: { min: number; max: number };
        conversion?: { min: number; max: number };
    };
}

/* tiktok Creative Plugin Types */
export interface ITiktokCreativePluginData extends IBaseTiktokData {
    storeId: string;
    timezone: string;
    storeName: string;
    currency: string;
    websiteURL: string;
    domain: string;
    countryCode: string;
    downloadURLS: Array<string>;
    keyForHmac: string;
    businessPlatform: string;
    industryId: string;
    locale: string;
    phoneNumber: string;
    email: string;
    env: string;
    closeMethod: string;
    isTest: boolean;
}

export type TiktokData = ITiktokCreativePluginData
    | IAdsAccountRegistrationData
    | IAdsAccountInfoData
    | IUploadVideoToAdsAccountData
    | IGetVideosInfoData
    | IGetCreativeReportData
    | ITiktokBusinessExchangeCodeForAccessToken
    | ITiktokGetUserInfoData
    | ITikTokRefreshBusinessAccessTokenData
    | ITikTokGetBusinessData
    | ITikTokPostUserVideoData
    | ITikTokPostBusinessVideoData
    | ITikTokGetBusinessVideoInfoData
    | ITiktokRefreshUserAccessToken;
