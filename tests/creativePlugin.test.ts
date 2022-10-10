
import Tiktok, { ITiktokCreativePluginData } from "../src/index";
import { ITiktokAction } from "../src/common";

describe("tiktok creative plugin", () => {
    describe("tiktok/getCreativePluginShareURL", () => {
        test("When asking for url using correct params, a url is returned successfully", async () => {
            // Arrange
            const tiktokData: ITiktokCreativePluginData = {
                storeId: "62f8f407a9ada32d8ce1dd77",
                actionType: ITiktokAction.creativePlugin,
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
            // Act
            const url = await tiktok.handle(tiktokData);
            // Assert
            expect(url).not.toBe(undefined);
        });
    });
});