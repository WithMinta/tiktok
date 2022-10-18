import * as crypto from "crypto";
import { ITiktokCreativePluginData } from "./types";

const RedirectURL = "https://ads.tiktok.com/business-extension/creative_plugin/upload";
export default class ttCreativePlugin {
  async getURLReadyToUploadMediaToAdvertizerAccount(tiktokData: ITiktokCreativePluginData ): Promise<string> {
    try {
      if (!validateData(tiktokData)) throw new Error("Params are missing");
      const params = {
        version: "1.0",
        timestamp: Date.now().toString(),
        locale: tiktokData.locale,
        business_platform: tiktokData.businessPlatform,
        external_business_id: tiktokData.storeId,
      };
      const stringToHmac = new URLSearchParams(params).toString();
      const hmac = getHmac(stringToHmac, tiktokData.keyForHmac);

      const moreData = {
        ...params,
        "industry_id": tiktokData.industryId,
        "timezone": tiktokData.timezone,
        "country_region": tiktokData.countryCode,
        "store_name": tiktokData.storeName,
        "phone_number": tiktokData.phoneNumber,
        "email": tiktokData.email,
        "currency": tiktokData.currency,
        "website_url": tiktokData.websiteURL,
        "domain": tiktokData.domain,
        "env": tiktokData.env,
        "hmac": hmac,
        "close_method": tiktokData.closeMethod,
        "is_test": tiktokData.isTest,
        "download_urls": tiktokData.downloadURLS
      };
      const externalData = convertToBase64(JSON.stringify(moreData));
      const finalRedirectUrl = `${RedirectURL}?external_data=${externalData}`;
      return finalRedirectUrl;
    } catch (error) {
      throw error;
    }
  }
}

function getHmac(str: string, key: string) {
  return crypto.createHmac("sha256", key).update(str).digest("hex");
}

function convertToBase64(str: string) {
  return Buffer.from(str).toString("base64");
}

function validateData(params: ITiktokCreativePluginData): boolean {
  if (params.businessPlatform && params.storeId && params.locale && params.downloadURLS) {
    return true;
  } else {
    return false;
  }
}

