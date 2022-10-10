import axios from "axios";
import { IAdsAccountInfoData, IAdsAccountRegistrationData, IGetCreativeReportData, IGetVideosInfoData, IUploadVideoToAdsAccountData } from "./types";

export const TIKTOK_API_BUSINESS = "https://business-api.tiktok.com/open_api";
export const TIKTOK_ADS_API = "https://ads.tiktok.com/open_api";

const API_VERSION = "v1.3";

export default class TiktokAdsAPI {
    async getPermanentAccessToken(tiktokData: IAdsAccountRegistrationData) {
        const
            auth_code = tiktokData.auth_code,
            app_id = tiktokData.app_id,
            secret = tiktokData.secret;

        const requestUrl = `${TIKTOK_API_BUSINESS}/${API_VERSION}/oauth2/access_token/`;

        const payload = {
            app_id,
            secret,
            auth_code
        };
        const response = await axios.post(requestUrl, payload);
        return response?.data;
    }

    async uploadVideoToAdsAccount(tiktokData: IUploadVideoToAdsAccountData) {
        const payload = {
            material_type: tiktokData.material_type || "SINGLE_VIDEO",
            upload_type: tiktokData.upload_type || "UPLOAD_BY_URL",
            advertiser_id: tiktokData.advertiser_id,
            video_url: tiktokData.video_url
        };

        const response = await axios.post(`${TIKTOK_ADS_API}/${API_VERSION}/file/video/ad/upload/`, payload, { headers: { "Access-Token": tiktokData.access_token } });
        return response?.data;
    }
    async getAdvertisersAuthorized(access_token: string, app_id: string, secret: string) {

        const payload = {
            app_id,
            secret,
            access_token
        };

        const response = await axios.post(`${TIKTOK_API_BUSINESS}/${API_VERSION}/oauth2/advertiser/get/`,
        payload,
        { headers: { "Access-Token": access_token } });

        return response?.data;
    }
    async getAdvertisersAccountInfo(tiktokData: IAdsAccountInfoData) {

        const response = await axios.get(`${TIKTOK_API_BUSINESS}/${API_VERSION}/advertiser/info/?advertiser_ids=${tiktokData.advertiser_ids}`,
            { headers: { "Access-Token": tiktokData.access_token } });

        return response?.data;
    }
    async getVideosInfo(tiktokData: IGetVideosInfoData) {

        const payload = {
            video_ids: tiktokData.video_ids,
            advertiser_id: tiktokData.advertiser_id,
        };

        const response = await axios.get(`${TIKTOK_ADS_API}/${API_VERSION}/file/video/ad/info/?advertiser_id=${payload.advertiser_id}&video_ids=${payload.video_ids}`,
            { headers: { "Access-Token": tiktokData.access_token } });

        return response?.data;
    }
    async getCreativeReport(tiktokData: IGetCreativeReportData) {
        const payload = {
            advertiser_id: tiktokData.advertiser_id,
            material_type: tiktokData.material_type,
            lifetime: true,
            filtering: tiktokData.filtering,
            metrics_fields: tiktokData.metrics_fields ? tiktokData.metrics_fields : ["spend", "cpc", "cpm", "impressions", "clicks", "conversion", "ctr", "video_play_actions", "video_watched_2s", "video_watched_6s", "average_video_play"]
        };

        const response = await axios.get(`${ TIKTOK_ADS_API }/v1.2/creative/reports/get/`,
          { headers: { "Access-Token": tiktokData.access_token }, data: payload });

        return response?.data;
    }
}
