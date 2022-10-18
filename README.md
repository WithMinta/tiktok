# Tiktok API
currently this npm supports:
1. ADS
    * Exchange code with  permanent access token
    * Get ads account info
    * Get metrics and performance of uploaded video
    * Upload and publish a video to tiktok ads account
2. BUSINESS ACCOUNT
    * Exchange access token from code (after user accepts the app)
    * Refresh old access token 
    * Upload and publish a video to tiktok business account
    * Get video info (metrics)
3. TIKTOK ACCOUNT
    * Upload and publish a video to tiktok account
    * Get tiktok user info
    * Exchange access token from code (after user accepts the app)
    * Refresh old access token
    * Get video info (metrics)
4. TIKTOK CREATIVE PLUGIN
    * upload videos to ads account using tiktok creative plugin

# how to use 
 ## 1. ads
    ### flow:
    1. client should send the user to tiktok redirect login dialog:
    https://ads.tiktok.com/marketing_api/auth?app_id=3127225303000154115&state=your_custom_params&redirect_uri=https%3A%2F%2Fapp-dev.withminta.com%2Fverify-tiktok-ads&rid=nygbomrcwl
    
![alt text](https://i.imgur.com/CFU8Dqy.png)


    2. After the user approve tiktok redirects the user back to the client with a code
    3. This code should be exchange to get permanent access token 
    4. Then the videos can be  upload to ads account

    ###  Import  tiktok
    ```
    import Tiktok, {
    ITiktokAction,
    IAdsAccountRegistrationData,
    IGetVideosInfoData,
    IUploadVideoToAdsAccountData  } from "@minta/tiktok";
    ```
    ### Exchange code with  permanent access token
    ```
    async createAdsAccountFromCodeToTiktok(auth_code: string, businessAuthId: string) {
        const tiktokData: IAdsAccountRegistrationData = {
        auth_code,
        app_id: process.env.tiktok_client_key_business,
        secret: process.env.tiktok_client_secret_business,
        actionType: ITiktokAction.adsAccountRegistration
        };
        const tiktok = new Tiktok();
        const response = await tiktok.handle(tiktokData);
    }
    ```
    ### Get ads account info
    ```
    async getAdvertisersAccountInfoFromTiktok(advertiser_ids: string[], access_token: string) {
    const tiktok = new Tiktok();

        const tiktokData: IAdsAccountInfoData = {
        advertiser_ids,
        access_token,
        actionType: ITiktokAction.getAdvertisersAccountInfo,
        };
        return await tiktok.handle(tiktokData);
    }
    ```
    ### Upload and publish a video to tiktok ads account
    ```
    async uploadVideoToAdsAccountToTiktok(advertiser_id: string, access_token: string, video_url: string, upload_type: string, material_type: string) {
        const tiktok = new Tiktok();

        const tiktokData: IUploadVideoToAdsAccountData = {
        advertiser_id, // "7124644513892564995"
        access_token, // "3c920af4d33377996ef0d24eb5df7ab93d6a7a333"
        actionType: ITiktokAction.uploadVideoToAdsAccount,
        video_url, // "https://minta.com/dan.mp4" 
        upload_type, // "UPLOAD_BY_URL"
        material_type // "SINGLE_VIDEO"
        };
        return await tiktok.handle(tiktokData);
    }
    ```
    ### Get metrics and performance of uploaded video
    ```
    async getInfoOfVideoUploaded(advertiser_id: string, video_ids: string, access_token: string) {
        const tiktokData: IGetVideosInfoData = {
        video_ids: video_ids.split(","), // u get it after uploading the video "v10033g50000cbjro5jc77u7i4gidha0"
        advertiser_id,
        access_token,
        actionType: ITiktokAction.GetVideosInfo
        };
        const tiktok = new Tiktok();
        const response = await tiktok.handle(tiktokData);
        return response;
    }
    ```
 ## 2. BUSINESS ACCOUNT
    ### flow:
    1. client should send the user to tiktok redirect login dialog: https://open-api.tiktok.com/platform/oauth/connect?client_key=6127225303000154115&scope=user.info.basic%2Cuser.insights%2Cvideo.list%2Cvideo.insights%2Ccomment.list%2Ccomment.list.manage%2Cvideo.publish&response_type=code&redirect_uri=http%3A%2F%2F8d76-31-154-30-222.ngrok.io%2Fverify-tiktok&rid=sidiioyto9k


![alt text]( https://i.imgur.com/SxVhWTy.png)


    2. After the user approve tiktok redirects the user back to the client with a code
    3. This code should be exchange to get temp access token 
    4. Then the videos can be upload to business account
    5. Access token is valid for a few  minutes - refresh access token API should be use before each request make
    
    ### Exchange access token from code (after user accepts the app)
    ```
    async exchangeCodeForAccessToken(code: string) {
        const ttBusinessAPI = new TTBusinessAPI(CLIENT_KEY_BUSINESS, CLIENT_SECRET_BUSINESS);
        return await ttBusinessAPI.exchangeCodeForAccessToken(code);
    }
    ```
    ### Refresh token before each request use
    ```
    async refreshAccessToken(refreshToken: string) {
        const ttBusinessAPI = new TTBusinessAPI(CLIENT_KEY_BUSINESS, CLIENT_SECRET_BUSINESS);
        return await ttBusinessAPI.refreshAccessToken(refreshToken);
    }
    ```
    ### Upload and post video to tiktok business api
    ```
    async postVideoToBusinessTiktokAccount(refreshToken: string) {
        if (caption) {
            // TikTok only can get 150 characters
            if (caption.length > 145) {
                throw new Error("caption length can't be longer than 145 char");
            }
        }

        const payload = {
            business_id: businessId, // the business id you got after exchanged the code 
            video_url: videoUrl, // "https://minta.com/video.mp4"
            post_info: {
                caption: caption,
                disable_comment, // bool
                disable_duet, // bool
                disable_stitch // bool
            }
        };
        const ttBusinessAPI = new TTBusinessAPI();
        return await ttBusinessAPI.refreshAccessToken(refreshToken);
    }
    ```
 ## 3. TIKTOK  ACCOUNT
### flow:
    1. client should send the user to tiktok redirect login dialog: "https://open-api.tiktok.com/oauth/access_token?client_key=<clientKey>&client_secret=<secret>&code=<authCode>&grant_type=authorization_code"
    2. After the user approve tiktok redirects the user back to the client with a code
    3. This code should be exchange to get temp access token 
    4. Then the videos can be upload to a tiktok account
    5. Access token is valid for a few  minutes - refresh access token API should be use before each request
    
    ### Exchange access token from code (after user accepts the app)
    ```
    async exchangeCodeForAccessToken(code: string) {
        const ttDeveloperAPI = new TTDeveloperAPI(TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET);
        return await ttDeveloperAPI.exchangeCodeForAccessToken(code);
    }
    ```
    ### Refresh token before each request use
    ```
    async refreshAccessToken(data: { refresh_token: string }) {
        const ttDeveloperAPI = new TTDeveloperAPI(TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET);
        return await ttDeveloperAPI.refreshAccessToken(data.refreshToken);
    }
    ```
    ### Upload and post video to tiktok api
    ```
    async postVideo(data: { access_token: string, video_url: string, user_id: string }) {

        const payload = {
            video_url: <videoUrl>, // "https://minta.com/video.mp4"
            access_token: string,
            user_id: string,
        };
        const ttDeveloperAPI = new TTDeveloperAPI();
        return await ttDeveloperAPI.postVideo(payload);
    }
    ```

 ## 4. Creative plugin redirect url
note: you must be an official partner of tiktok in order to use the redirect url.

```
import Tiktok, { ITiktokCreativePluginData, ItiktokAction } from "@minta/tiktok";

const tiktokData: ITiktokCreativePluginData = {
                storeId: "62f8f407a9ada32d8ce1dd77",
                actionType: ItiktokAction.creativePlugin,
                timezone: "America/New_York",
                storeName: "coatzy",
                currency: "USD",
                websiteURL: "http://coatzy.com",
                domain: "http://coatzy.com",
                countryCode: "US",
                downloadURLS: ["https://campaigns.withminta.com/2938/0000/kz8302p9usl77n362641q1mc9t1l73g821g3j2.mp4"],
                businessPlatform: "your_predefine_business_platform_agreed_with_tiktok",
                keyForHmac: "your_predefine_key_agreed_with_tiktok",
                phoneNumber: "+97254444444",
                email: "hello@koatzy.com",
                env: "prod",
                closeMethod: "redirect_inside_tiktok",
                isTest: true,
                locale: "EN",
                industryId: "290401"
            };
            const tiktok = new Tiktok();
            const url = await tiktok.handle(tiktokData);
```
the response url is a url which open a tiktok dialog for authentication, then choose ads account then upload media to the chosen ads account.