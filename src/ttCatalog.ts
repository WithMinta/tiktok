import axios from "axios";
import {
    ITiktokCatalogGetProducts,
    ITiktokCatalogUploadProducts,
} from "./types";

export const TIKTOK_API_BUSINESS = "https://business-api.tiktok.com/open_api";
export const TIKTOK_ADS_API = "https://ads.tiktok.com/open_api";

const API_VERSION = "v1.2";

export default class TiktokCatalogueAPI {
    async getProductsOfCatalog(tiktokData: ITiktokCatalogGetProducts) {
        const
            bc_id = tiktokData.bc_id,
            catalog_id = tiktokData.catalog_id,
            access_token = tiktokData.access_token,
            page = tiktokData.page || 1,
            page_size = tiktokData.page_size || 100,
            conditions = tiktokData.conditions || {};

        const requestUrl = `${TIKTOK_API_BUSINESS}/${API_VERSION}/catalog/product/get/`;

        const payload = {
            bc_id,
            catalog_id,
            page,
            page_size,
            conditions,
        };
        const config = {
            method: "get",
            url: requestUrl,
            headers: {
                "access-token": access_token,
            },
            data: payload,
        };
        const response = await axios(config as any);
        return response?.data;
    }
    async uploadProductsOfCatalog(tiktokData: ITiktokCatalogUploadProducts) {
        const
            bc_id = tiktokData.bc_id,
            catalog_id = tiktokData.catalog_id,
            access_token = tiktokData.access_token,
            products = tiktokData.products;

        const requestUrl = `${TIKTOK_API_BUSINESS}/${API_VERSION}/catalog/product/upload/`;

        const payload = {
            bc_id,
            catalog_id,
            access_token,
            dpa_products: products
        };
        const response = await axios.post(
            requestUrl,
            payload,
            { headers: { "Access-Token": access_token } }
        );
        return response?.data;
    }
}
