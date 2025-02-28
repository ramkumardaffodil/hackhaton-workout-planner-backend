const { randomDelay } = require("../utils/randomDelay");
const { saveFile } = require("../utils/saveJob");

const prompt = require("prompt-sync")();
let pageNo = 1;
let token = "";

const saveJobToFile = saveFile("Naukri-jobs_applied.json");

const login = async () => {
  const resp = await fetch(
    "https://www.naukri.com/central-login-services/v1/login",
    {
      headers: {
        accept: "application/json",
        "accept-language":
          "en-US,en;q=0.9,hi;q=0.8,en-IN;q=0.7,en-AU;q=0.6,en-CA;q=0.5,en-GB;q=0.4,en-ZA;q=0.3,en-NZ;q=0.2",
        appid: "103",
        "cache-control": "no-cache",
        clientid: "d3skt0p",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        systemid: "jobseeker",
        cookie:
          "PHPSESSID=lbffgtggp67ujhkuv8hag0p8ot; _t_ds=31a5a1871730097982-1531a5a187-031a5a187; J=0; _ga=GA1.1.2044754517.1730097983; MYNAUKRI[UNID]=2a6f4d319b114c3fa862e73af94826d3; test=naukri.com; persona=default; _gcl_au=1.1.229534562.1730098625; PS=a0c6a0d3d0082d0cf4e3d66e3c8dacfae73ad992a836f41cb3de3380c7212615; __utmc=266160400; __utmz=266160400.1730100478.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); FFSESS=af6d918ca3243b1f0ffe6018c9274753; _ff_ds=0365992001731264953-C31444D49DD8-106AFBD63D22; tStp=1732716113126; __gads=ID=b5c0ac57606cc653:T=1730098773:RT=1733482712:S=ALNI_MbLVjN2IaFBPCe51czMixri9IE1yQ; __gpi=UID=00000f5927764f71:T=1730098773:RT=1733482712:S=ALNI_MY0Wwt55VTf0YHsPIaVEAn7zfTttg; __eoi=ID=5cb16f0006bdc5e8:T=1730098773:RT=1733482712:S=AA-AfjYdh63D77zj4SSvU-PkqlsQ; _ff_r=2008%2F%2F; promobnr=FASTJOB20; __utma=266160400.2044754517.1730097983.1730100478.1734500099.2; ACTIVE=1734585776; bm_mi=49A4DB165493468CBA5C9A251402B7E4~YAAQjwFAF5UFQriTAQAAvnhe3RrGphSyrt3bqQNv8qKOzs5ue1QbSiPJiU8+DOPkfoL4gEEJQ6/unlgCUwM6bChXX2Ez80rdRoYWt33MrMkJftKuCntaVCMzXjc7bQKybURcHiPnwIs2O2A8kDequAJpm+AEE49wnlw+C7xHdK6wOwfH/WV4l6zS8Qt10q2KEyEkTJiu7lnE3LMIITEKTmiHNw13YROkF05R0r83zvrvhJ2ctc9lrkDeMrwOfu0QtFlxTNK9oRLVpja0lwXyBNoakwz8jDAntqlz6ECnMZrJGV0kdoC6UJqo75ujPNcoWbmZEjkCEuoZ04MBbAAwAmBh/1jDvRl3jWlU/Q==~1; ak_bmsc=33A333638DFD03591F4D8C2711FF7172~000000000000000000000000000000~YAAQjwFAF34GQriTAQAAlXte3RrTi4TCMNNydhxbKMXsABDE7geIzv8wdcjBjubn7kPGF0GAimNAzx7uB//+I9F9Ta3+VpTvTVOMBk5FJfniLwGqBbXVMwwQrKQlWYR+nSiIXtDwgkARPKi1oDfxIvTa9cghPkgCvfx2JXJY9rURdKHKcawGXVBxoGVDwsp8vB/78WP61owL7CzGH0tZZlzJXiHHajfw4wKpaZNSJYYnTJbQrOfZO2N96QczPxGwp7ue9PhCfAmjMwWwr7O3pnQ4k/9GkenjR+VlovlBFq5Q+k9rTIMiQxoXRmhJPk/4z3SNgQC5a+AZyhVpUUE4+TQIj5p7Ljh8Xzu94GEgtXr3V53xIOM7j9UO/7C3EPCNVqbFRsOHAr1C+9W+OZxD4qvNxt3AVa4dj3J4AMzsjMoK0q5NYnNaXVGqbpEpO8YrYJD65DGW+SVFRQ1ns6+I0Bhr+tyZkPtBCXpKWZ37j8WxAI6v3TDGImb6MOcJFy11sWItgx3JhZlCWsiFqJw=; _t_us=6763ADD4; _t_s=direct; _t_r=1030%2F%2F; bm_sv=7E37C3C4B2C8A30686B870F652A3FFE2~YAAQjwFAF3AwQriTAQAAgAxf3Rrqg7DjO8mbjh+mXj+sm0gWG2Dum6L0X3L41RAmHhOINjVGhhyXapXYzQv0NkRORYeU24ohDLeLzVTueTnUsH0IYDCNYZyZ3MlDS1MZM3jCWu6A25cBsY8u7xyLevh3pNXOuucYF9QlFip7WRzN9Uy6Rw5Z/Msa+gUtxnNvVi6wxMY1I/gTzh6cYb9DngxeRoBSdjQ3VFbmhnKrDRk4wQuIydJRBHImvyHJeI4Xpw==~1; HOWTORT=ul=1734585812487&r=https%3A%2F%2Fwww.naukri.com%2F&hd=1734585812616&cl=1734585818960&nu=https%3A%2F%2Flogin.naukri.com%2FnLogin%2FLogin.php; _ga_K2YBNZVRLL=GS1.1.1734585776.24.1.1734585828.8.0.0",
        Referer: "https://www.naukri.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: '{"username":"ramyadav1261@gmail.com","password":"ramyadav3093@\'"}',
      method: "POST",
    }
  );
  const { headers } = resp;
  const setCookie = headers.get("set-cookie");
  token = setCookie.split(";")[0].split("=")[1];
  return resp;
};

const fetchJobs = async (searchQuery) => {
  const response = await fetch(
    `https://www.naukri.com/jobapi/v3/search?noOfResults=20&urlType=search_by_keyword&searchType=adv&keyword=nodejs&pageNo=${pageNo}&k=${encodeURIComponent(
      searchQuery
    )}&nignbevent_src=jobsearchDeskGNB&seoKey=mern-stack-mern-stack-developer-mern-full-stack-developer-jobs&src=directSearch&latLong=`,
    {
      headers: {
        accept: "application/json",
        "accept-language":
          "en-US,en;q=0.9,hi;q=0.8,en-IN;q=0.7,en-AU;q=0.6,en-CA;q=0.5,en-GB;q=0.4,en-ZA;q=0.3,en-NZ;q=0.2",
        appid: "121",
        authorization: "ACCESSTOKEN = " + token,
        "cache-control": "max-age=0",
        clientid: "d3skt0p",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        systemid: "jobseeker",
        cookie:
          "PHPSESSID=lbffgtggp67ujhkuv8hag0p8ot; _t_ds=31a5a1871730097982-1531a5a187-031a5a187; J=0; _ga=GA1.1.2044754517.1730097983; MYNAUKRI[UNID]=2a6f4d319b114c3fa862e73af94826d3; test=naukri.com; persona=default; _gcl_au=1.1.229534562.1730098625; NKWAP=5b5da5dd080e982bc58e327d5f670ee4ab5d50b9205d342ceb3075ae6a08598a08b05ee52a8d9794~a0c6a0d3d0082d0cf4e3d66e3c8dacfae73ad992a836f41cb3de3380c7212615~1~0; PS=a0c6a0d3d0082d0cf4e3d66e3c8dacfae73ad992a836f41cb3de3380c7212615; __utma=266160400.2044754517.1730097983.1730100478.1730100478.1; __utmc=266160400; __utmz=266160400.1730100478.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); nauk_rt=79e7935b55a74b3091f4a07244028738; nauk_sid=79e7935b55a74b3091f4a07244028738; nauk_otl=79e7935b55a74b3091f4a07244028738; nauk_ps=default; FFSESS=af6d918ca3243b1f0ffe6018c9274753; _ff_ds=0365992001731264953-C31444D49DD8-106AFBD63D22; _t_r=1091%2F%2F; tStp=1732716113126; __gads=ID=b5c0ac57606cc653:T=1730098773:RT=1733482712:S=ALNI_MbLVjN2IaFBPCe51czMixri9IE1yQ; __gpi=UID=00000f5927764f71:T=1730098773:RT=1733482712:S=ALNI_MY0Wwt55VTf0YHsPIaVEAn7zfTttg; __eoi=ID=5cb16f0006bdc5e8:T=1730098773:RT=1733482712:S=AA-AfjYdh63D77zj4SSvU-PkqlsQ; _ff_r=2008%2F%2F; promobnr=FASTJOB20; nauk_at=eyJraWQiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlM1MTIifQ.eyJ1ZF9yZXNJZCI6MTg2NjY0ODkwLCJzdWIiOiIxOTIyMzQyNjIiLCJ1ZF91c2VybmFtZSI6ImYxNTk4OTY0NzkuNzc2MSIsInVkX2lzRW1haWwiOnRydWUsImlzcyI6IkluZm9FZGdlIEluZGlhIFB2dC4gTHRkLiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiaXBBZHJlc3MiOiIyNDA5OjQwZDY6Yzo3MmJhOjdjZTE6Njk3ZTo3YmVmOjNmMmEiLCJ1ZF9pc1RlY2hPcHNMb2dpbiI6ZmFsc2UsInVzZXJJZCI6MTkyMjM0MjYyLCJzdWJVc2VyVHlwZSI6IiIsInVzZXJTdGF0ZSI6IkFVVEhFTlRJQ0FURUQiLCJ1ZF9pc1BhaWRDbGllbnQiOmZhbHNlLCJ1ZF9lbWFpbFZlcmlmaWVkIjp0cnVlLCJ1c2VyVHlwZSI6ImpvYnNlZWtlciIsInNlc3Npb25TdGF0VGltZSI6IjIwMjQtMTEtMDNUMTk6MjM6NDciLCJ1ZF9lbWFpbCI6InJpdGVzaHAxMTJAZ21haWwuY29tIiwidXNlclJvbGUiOiJ1c2VyIiwiZXhwIjoxNzM0NTAzNTE2LCJ0b2tlblR5cGUiOiJhY2Nlc3NUb2tlbiIsImlhdCI6MTczNDQ5OTkxNiwianRpIjoiNzllNzkzNWI1NWE3NGIzMDkxZjRhMDcyNDQwMjg3MzgiLCJwb2RJZCI6InByb2QtNzRmOTc3YzY2ZC04anZiOCJ9.AtDy9xPzEQIjdfSFFwEeR7Kem3q39nPgIigmZlUeZaFJQZg-36-TzYIlbHo-PlMxXLknnAdjORIPs9fIqfODWFCHqpx5GhECTnbXPoBoIzye55te0Fx-Co8nqEd2yDqfY-_Bz2RBuV9Gc8xvtYV11gwh7ivwo6rHlWfyauiz6UbLTECDrOT2ASrmyxa1Ws_rZYvAxsuFBaFBdwwWwvOGJQINhNy3gC_XU3KESOQ_faak1LJou-RlACfZnO_IGinaTQu7F1Q_EpOZz1G5wT-JU_Ed-gkYeVWN2wCpCd_K3DL89ApGmloeeiwThCh83mYI6UOlMGVmQGNr8SZNwbqs0g; is_login=1; failLoginCount=0; ACTIVE=1734499917; bm_mi=B08089931DC6177741439A32D30EFE40~YAAQjwFAF0BxjreTAQAAvWBA2BrJGZI1z1xFQ+KK6BxduzTT9gCGkldOt1HGzAlHn+8A3C2B2pln1YRcRnUq2+0nse3sZxat1ElfxJz0LUXUBjTPKSyPvFb9351XtWWwktoWFB53YL2A4gNkaAbX6R3tFHKv/uAZXq+/ajIcc+9b0zbchCO5D5K0S0QLkJE9pkxlFTIpU7ez1bbJ/ADPcaQr3vWOjQHze+jOLM5IpwbsduaKoMjNcmw36GMQ3hAvhjhAFxm9H8rAOe1zhJcXd74uTXbFZN4xoV594WP4z4Uu6xUeacj2RX7nFD/4By288yY3GMUgqrxUDeKGOCe+DzpkweIdUZ1y0p+1WQ==~1; ak_bmsc=23D2A24EDABEF3E23042CC66A3F7F362~000000000000000000000000000000~YAAQjwFAFzJyjreTAQAABGRA2BoNya9RRBJ+hDk5G8nS0E/7OyeaiCr+2V0o5NZurVlaxwYeglVmv4Q6912DqkMYuHbhvWSwVIlMh08Drdx+V4pkfTR5E4edwdm1AEa9B1R2R+P7LtEpoPpwSDdeOQvOedhcGI7JtRRMgM6fMTSHnUqJ/ioET6YliXSBryaLzV/MWkWKPN4IH/UzuJtclfcZkVzW3eicYyVJtNzlC/4swQ3l/I/cA3NfZ2q2i3TouzaXNajLyD6RKbWms4VDJUfL+IP7dFuptEXK6wbnFvTISy1m26na/ZuXMGDtFnuEUnUrPXVy7ANupfsI4Egc9YR6pTRjeMY7Bpm2MUJhLhj0t2nZKGIv/igCQh4nDX3eR5/qzaq1AD52byxOzyYBH8lT2yDdNnPOwtNaBoiUhF7XwNnUrkyoOBpPK4ZX0iBr9y+V5Uy7ckMCleMwUy+KJ7Ka0t/1fQsEJneh8X9byPK74wCNngND7Tv7jXcT9dAfx4efev0iKNGNqj9ZQ6s=; HOWTORT=ul=1734499921144&r=https%3A%2F%2Fwww.naukri.com%2Fmnjuser%2Fsettings%2Fcommunication%3Futm_campaign%3Drr_ReadReviews-NewSingle%26utm_medium%3Demail%26utm_source%3Dunsubscribe&hd=1734499921797&cl=1734499921133&nu=https%3A%2F%2Fwww.naukri.com%2Fmnjuser%2Frecommendedjobs; _ga_K2YBNZVRLL=GS1.1.1734499917.23.1.1734499924.53.0.0; bm_sv=ADB3A3F3A502A88AB87A699AABFA8306~YAAQjwFAF8p5jreTAQAAv39A2BrlJaRi6EnFKpiRLF9ot9lcmLxTM+FnMPmBB8REOUKu5fPmsguwneP+W4+5o6HGvXxrZoVC0ItwzE6aNwsbvNwSMB1eNWzI5pPYUqYYSLRTCwZFhhh80opq7JmSm0kVJMaOAX1AtiSefDaYvNDQS67JcldgsDvSS41fKIBHBTMDv7f/5ikJHV2HAdzBc2S39zXNn1yFvofY9YHpR01HA6Bpkmt5zEyqaB6vAdm1nw==~1",
        Referer:
          "https://www.naukri.com/job-listings-senior-frontend-developer-react-angular-wfh-available-dreamroots-entertainment-and-technology-private-li-mited-hyderabad-bengaluru-delhi-ncr-3-to-8-years-070822000240?src=drecomm_apply&sid=17344999225451192&xp=1&px=1",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );
  const data = await response.json();
  return data.jobDetails;
};

const submitJobApplication = async (job) => {
  try {
    const resp = await fetch(
      "https://www.naukri.com/cloudgateway-workflow/workflow-services/apply-workflow/v1/apply",
      {
        headers: {
          accept: "application/json",
          "accept-language":
            "en-US,en;q=0.9,hi;q=0.8,en-IN;q=0.7,en-AU;q=0.6,en-CA;q=0.5,en-GB;q=0.4,en-ZA;q=0.3,en-NZ;q=0.2",
          appid: "121",
          authorization: "ACCESSTOKEN = " + token,
          "cache-control": "max-age=0",
          clientid: "d3skt0p",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          systemid: "jobseeker",
          cookie:
            "PHPSESSID=lbffgtggp67ujhkuv8hag0p8ot; _t_ds=31a5a1871730097982-1531a5a187-031a5a187; J=0; _ga=GA1.1.2044754517.1730097983; MYNAUKRI[UNID]=2a6f4d319b114c3fa862e73af94826d3; test=naukri.com; persona=default; _gcl_au=1.1.229534562.1730098625; NKWAP=5b5da5dd080e982bc58e327d5f670ee4ab5d50b9205d342ceb3075ae6a08598a08b05ee52a8d9794~a0c6a0d3d0082d0cf4e3d66e3c8dacfae73ad992a836f41cb3de3380c7212615~1~0; PS=a0c6a0d3d0082d0cf4e3d66e3c8dacfae73ad992a836f41cb3de3380c7212615; __utma=266160400.2044754517.1730097983.1730100478.1730100478.1; __utmc=266160400; __utmz=266160400.1730100478.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); nauk_rt=79e7935b55a74b3091f4a07244028738; nauk_sid=79e7935b55a74b3091f4a07244028738; nauk_otl=79e7935b55a74b3091f4a07244028738; nauk_ps=default; FFSESS=af6d918ca3243b1f0ffe6018c9274753; _ff_ds=0365992001731264953-C31444D49DD8-106AFBD63D22; _t_r=1091%2F%2F; tStp=1732716113126; __gads=ID=b5c0ac57606cc653:T=1730098773:RT=1733482712:S=ALNI_MbLVjN2IaFBPCe51czMixri9IE1yQ; __gpi=UID=00000f5927764f71:T=1730098773:RT=1733482712:S=ALNI_MY0Wwt55VTf0YHsPIaVEAn7zfTttg; __eoi=ID=5cb16f0006bdc5e8:T=1730098773:RT=1733482712:S=AA-AfjYdh63D77zj4SSvU-PkqlsQ; _ff_r=2008%2F%2F; promobnr=FASTJOB20; nauk_at=eyJraWQiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlM1MTIifQ.eyJ1ZF9yZXNJZCI6MTg2NjY0ODkwLCJzdWIiOiIxOTIyMzQyNjIiLCJ1ZF91c2VybmFtZSI6ImYxNTk4OTY0NzkuNzc2MSIsInVkX2lzRW1haWwiOnRydWUsImlzcyI6IkluZm9FZGdlIEluZGlhIFB2dC4gTHRkLiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiaXBBZHJlc3MiOiIyNDA5OjQwZDY6Yzo3MmJhOjdjZTE6Njk3ZTo3YmVmOjNmMmEiLCJ1ZF9pc1RlY2hPcHNMb2dpbiI6ZmFsc2UsInVzZXJJZCI6MTkyMjM0MjYyLCJzdWJVc2VyVHlwZSI6IiIsInVzZXJTdGF0ZSI6IkFVVEhFTlRJQ0FURUQiLCJ1ZF9pc1BhaWRDbGllbnQiOmZhbHNlLCJ1ZF9lbWFpbFZlcmlmaWVkIjp0cnVlLCJ1c2VyVHlwZSI6ImpvYnNlZWtlciIsInNlc3Npb25TdGF0VGltZSI6IjIwMjQtMTEtMDNUMTk6MjM6NDciLCJ1ZF9lbWFpbCI6InJpdGVzaHAxMTJAZ21haWwuY29tIiwidXNlclJvbGUiOiJ1c2VyIiwiZXhwIjoxNzM0NTAzNTE2LCJ0b2tlblR5cGUiOiJhY2Nlc3NUb2tlbiIsImlhdCI6MTczNDQ5OTkxNiwianRpIjoiNzllNzkzNWI1NWE3NGIzMDkxZjRhMDcyNDQwMjg3MzgiLCJwb2RJZCI6InByb2QtNzRmOTc3YzY2ZC04anZiOCJ9.AtDy9xPzEQIjdfSFFwEeR7Kem3q39nPgIigmZlUeZaFJQZg-36-TzYIlbHo-PlMxXLknnAdjORIPs9fIqfODWFCHqpx5GhECTnbXPoBoIzye55te0Fx-Co8nqEd2yDqfY-_Bz2RBuV9Gc8xvtYV11gwh7ivwo6rHlWfyauiz6UbLTECDrOT2ASrmyxa1Ws_rZYvAxsuFBaFBdwwWwvOGJQINhNy3gC_XU3KESOQ_faak1LJou-RlACfZnO_IGinaTQu7F1Q_EpOZz1G5wT-JU_Ed-gkYeVWN2wCpCd_K3DL89ApGmloeeiwThCh83mYI6UOlMGVmQGNr8SZNwbqs0g; is_login=1; failLoginCount=0; ACTIVE=1734499917; bm_mi=B08089931DC6177741439A32D30EFE40~YAAQjwFAF0BxjreTAQAAvWBA2BrJGZI1z1xFQ+KK6BxduzTT9gCGkldOt1HGzAlHn+8A3C2B2pln1YRcRnUq2+0nse3sZxat1ElfxJz0LUXUBjTPKSyPvFb9351XtWWwktoWFB53YL2A4gNkaAbX6R3tFHKv/uAZXq+/ajIcc+9b0zbchCO5D5K0S0QLkJE9pkxlFTIpU7ez1bbJ/ADPcaQr3vWOjQHze+jOLM5IpwbsduaKoMjNcmw36GMQ3hAvhjhAFxm9H8rAOe1zhJcXd74uTXbFZN4xoV594WP4z4Uu6xUeacj2RX7nFD/4By288yY3GMUgqrxUDeKGOCe+DzpkweIdUZ1y0p+1WQ==~1; ak_bmsc=23D2A24EDABEF3E23042CC66A3F7F362~000000000000000000000000000000~YAAQjwFAFzJyjreTAQAABGRA2BoNya9RRBJ+hDk5G8nS0E/7OyeaiCr+2V0o5NZurVlaxwYeglVmv4Q6912DqkMYuHbhvWSwVIlMh08Drdx+V4pkfTR5E4edwdm1AEa9B1R2R+P7LtEpoPpwSDdeOQvOedhcGI7JtRRMgM6fMTSHnUqJ/ioET6YliXSBryaLzV/MWkWKPN4IH/UzuJtclfcZkVzW3eicYyVJtNzlC/4swQ3l/I/cA3NfZ2q2i3TouzaXNajLyD6RKbWms4VDJUfL+IP7dFuptEXK6wbnFvTISy1m26na/ZuXMGDtFnuEUnUrPXVy7ANupfsI4Egc9YR6pTRjeMY7Bpm2MUJhLhj0t2nZKGIv/igCQh4nDX3eR5/qzaq1AD52byxOzyYBH8lT2yDdNnPOwtNaBoiUhF7XwNnUrkyoOBpPK4ZX0iBr9y+V5Uy7ckMCleMwUy+KJ7Ka0t/1fQsEJneh8X9byPK74wCNngND7Tv7jXcT9dAfx4efev0iKNGNqj9ZQ6s=; HOWTORT=ul=1734499921144&r=https%3A%2F%2Fwww.naukri.com%2Fmnjuser%2Fsettings%2Fcommunication%3Futm_campaign%3Drr_ReadReviews-NewSingle%26utm_medium%3Demail%26utm_source%3Dunsubscribe&hd=1734499921797&cl=1734499921133&nu=https%3A%2F%2Fwww.naukri.com%2Fmnjuser%2Frecommendedjobs; _ga_K2YBNZVRLL=GS1.1.1734499917.23.1.1734499924.53.0.0; bm_sv=ADB3A3F3A502A88AB87A699AABFA8306~YAAQjwFAF8p5jreTAQAAv39A2BrlJaRi6EnFKpiRLF9ot9lcmLxTM+FnMPmBB8REOUKu5fPmsguwneP+W4+5o6HGvXxrZoVC0ItwzE6aNwsbvNwSMB1eNWzI5pPYUqYYSLRTCwZFhhh80opq7JmSm0kVJMaOAX1AtiSefDaYvNDQS67JcldgsDvSS41fKIBHBTMDv7f/5ikJHV2HAdzBc2S39zXNn1yFvofY9YHpR01HA6Bpkmt5zEyqaB6vAdm1nw==~1",
          Referer:
            "https://www.naukri.com/job-listings-senior-frontend-developer-react-angular-wfh-available-dreamroots-entertainment-and-technology-private-li-mited-hyderabad-bengaluru-delhi-ncr-3-to-8-years-070822000240?src=drecomm_apply&sid=17344999225451192&xp=1&px=1",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        method: "POST",
        body: JSON.stringify({
          strJobsarr: [job.jobId],
          logstr: "--drecomm_apply-2-F-0-1--17332073324634110-",
          flowtype: "show",
          crossdomain: true,
          jquery: 1,
          rdxMsgId: "",
          chatBotSDK: true,
          mandatory_skills: ["Nodejs"],
          optional_skills: [
            "Vue.Js",
            "css",
            "Javascript",
            "Spring Boot",
            "html",
            "React.Js",
          ],
          applyTypeId: "107",
          closebtn: "y",
          applySrc: "drecomm_apply",
          sid: "17332073324634110",
          mid: "",
        }),
      }
    );
    const data = await resp.json();
    // console.log('data', data);
    if (resp.status == 401) {
      const loginresp = await login();
      console.log("loginresp", loginresp);
      const retryresp = await fetch(
        "https://www.naukri.com/cloudgateway-workflow/workflow-services/apply-workflow/v1/apply",
        {
          headers: {
            accept: "application/json",
            "accept-language":
              "en-US,en;q=0.9,hi;q=0.8,en-IN;q=0.7,en-AU;q=0.6,en-CA;q=0.5,en-GB;q=0.4,en-ZA;q=0.3,en-NZ;q=0.2",
            appid: "121",
            authorization: "ACCESSTOKEN = " + token,
            clientid: "d3skt0p",
            "content-type": "application/json",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            systemid: "jobseeker",
            cookie:
              "PHPSESSID=lbffgtggp67ujhkuv8hag0p8ot; _t_ds=31a5a1871730097982-1531a5a187-031a5a187; J=0; _ga=GA1.1.2044754517.1730097983; MYNAUKRI[UNID]=2a6f4d319b114c3fa862e73af94826d3; test=naukri.com; persona=default; _gcl_au=1.1.229534562.1730098625; NKWAP=5b5da5dd080e982bc58e327d5f670ee4ab5d50b9205d342ceb3075ae6a08598a08b05ee52a8d9794~a0c6a0d3d0082d0cf4e3d66e3c8dacfae73ad992a836f41cb3de3380c7212615~1~0; PS=a0c6a0d3d0082d0cf4e3d66e3c8dacfae73ad992a836f41cb3de3380c7212615; __utma=266160400.2044754517.1730097983.1730100478.1730100478.1; __utmc=266160400; __utmz=266160400.1730100478.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); nauk_rt=79e7935b55a74b3091f4a07244028738; nauk_sid=79e7935b55a74b3091f4a07244028738; nauk_otl=79e7935b55a74b3091f4a07244028738; nauk_ps=default; FFSESS=af6d918ca3243b1f0ffe6018c9274753; _ff_ds=0365992001731264953-C31444D49DD8-106AFBD63D22; _t_r=1091%2F%2F; tStp=1732716113126; __gads=ID=b5c0ac57606cc653:T=1730098773:RT=1733482712:S=ALNI_MbLVjN2IaFBPCe51czMixri9IE1yQ; __gpi=UID=00000f5927764f71:T=1730098773:RT=1733482712:S=ALNI_MY0Wwt55VTf0YHsPIaVEAn7zfTttg; __eoi=ID=5cb16f0006bdc5e8:T=1730098773:RT=1733482712:S=AA-AfjYdh63D77zj4SSvU-PkqlsQ; _ff_r=2008%2F%2F; promobnr=FASTJOB20; nauk_at=eyJraWQiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlM1MTIifQ.eyJ1ZF9yZXNJZCI6MTg2NjY0ODkwLCJzdWIiOiIxOTIyMzQyNjIiLCJ1ZF91c2VybmFtZSI6ImYxNTk4OTY0NzkuNzc2MSIsInVkX2lzRW1haWwiOnRydWUsImlzcyI6IkluZm9FZGdlIEluZGlhIFB2dC4gTHRkLiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiaXBBZHJlc3MiOiIyNDA5OjQwZDY6Yzo3MmJhOjdjZTE6Njk3ZTo3YmVmOjNmMmEiLCJ1ZF9pc1RlY2hPcHNMb2dpbiI6ZmFsc2UsInVzZXJJZCI6MTkyMjM0MjYyLCJzdWJVc2VyVHlwZSI6IiIsInVzZXJTdGF0ZSI6IkFVVEhFTlRJQ0FURUQiLCJ1ZF9pc1BhaWRDbGllbnQiOmZhbHNlLCJ1ZF9lbWFpbFZlcmlmaWVkIjp0cnVlLCJ1c2VyVHlwZSI6ImpvYnNlZWtlciIsInNlc3Npb25TdGF0VGltZSI6IjIwMjQtMTEtMDNUMTk6MjM6NDciLCJ1ZF9lbWFpbCI6InJpdGVzaHAxMTJAZ21haWwuY29tIiwidXNlclJvbGUiOiJ1c2VyIiwiZXhwIjoxNzM0NTAzNTE2LCJ0b2tlblR5cGUiOiJhY2Nlc3NUb2tlbiIsImlhdCI6MTczNDQ5OTkxNiwianRpIjoiNzllNzkzNWI1NWE3NGIzMDkxZjRhMDcyNDQwMjg3MzgiLCJwb2RJZCI6InByb2QtNzRmOTc3YzY2ZC04anZiOCJ9.AtDy9xPzEQIjdfSFFwEeR7Kem3q39nPgIigmZlUeZaFJQZg-36-TzYIlbHo-PlMxXLknnAdjORIPs9fIqfODWFCHqpx5GhECTnbXPoBoIzye55te0Fx-Co8nqEd2yDqfY-_Bz2RBuV9Gc8xvtYV11gwh7ivwo6rHlWfyauiz6UbLTECDrOT2ASrmyxa1Ws_rZYvAxsuFBaFBdwwWwvOGJQINhNy3gC_XU3KESOQ_faak1LJou-RlACfZnO_IGinaTQu7F1Q_EpOZz1G5wT-JU_Ed-gkYeVWN2wCpCd_K3DL89ApGmloeeiwThCh83mYI6UOlMGVmQGNr8SZNwbqs0g; is_login=1; failLoginCount=0; ACTIVE=1734499917; bm_mi=B08089931DC6177741439A32D30EFE40~YAAQjwFAF0BxjreTAQAAvWBA2BrJGZI1z1xFQ+KK6BxduzTT9gCGkldOt1HGzAlHn+8A3C2B2pln1YRcRnUq2+0nse3sZxat1ElfxJz0LUXUBjTPKSyPvFb9351XtWWwktoWFB53YL2A4gNkaAbX6R3tFHKv/uAZXq+/ajIcc+9b0zbchCO5D5K0S0QLkJE9pkxlFTIpU7ez1bbJ/ADPcaQr3vWOjQHze+jOLM5IpwbsduaKoMjNcmw36GMQ3hAvhjhAFxm9H8rAOe1zhJcXd74uTXbFZN4xoV594WP4z4Uu6xUeacj2RX7nFD/4By288yY3GMUgqrxUDeKGOCe+DzpkweIdUZ1y0p+1WQ==~1; ak_bmsc=23D2A24EDABEF3E23042CC66A3F7F362~000000000000000000000000000000~YAAQjwFAFzJyjreTAQAABGRA2BoNya9RRBJ+hDk5G8nS0E/7OyeaiCr+2V0o5NZurVlaxwYeglVmv4Q6912DqkMYuHbhvWSwVIlMh08Drdx+V4pkfTR5E4edwdm1AEa9B1R2R+P7LtEpoPpwSDdeOQvOedhcGI7JtRRMgM6fMTSHnUqJ/ioET6YliXSBryaLzV/MWkWKPN4IH/UzuJtclfcZkVzW3eicYyVJtNzlC/4swQ3l/I/cA3NfZ2q2i3TouzaXNajLyD6RKbWms4VDJUfL+IP7dFuptEXK6wbnFvTISy1m26na/ZuXMGDtFnuEUnUrPXVy7ANupfsI4Egc9YR6pTRjeMY7Bpm2MUJhLhj0t2nZKGIv/igCQh4nDX3eR5/qzaq1AD52byxOzyYBH8lT2yDdNnPOwtNaBoiUhF7XwNnUrkyoOBpPK4ZX0iBr9y+V5Uy7ckMCleMwUy+KJ7Ka0t/1fQsEJneh8X9byPK74wCNngND7Tv7jXcT9dAfx4efev0iKNGNqj9ZQ6s=; HOWTORT=ul=1734499921144&r=https%3A%2F%2Fwww.naukri.com%2Fmnjuser%2Fsettings%2Fcommunication%3Futm_campaign%3Drr_ReadReviews-NewSingle%26utm_medium%3Demail%26utm_source%3Dunsubscribe&hd=1734499921797&cl=1734499921133&nu=https%3A%2F%2Fwww.naukri.com%2Fmnjuser%2Frecommendedjobs; _ga_K2YBNZVRLL=GS1.1.1734499917.23.1.1734499924.53.0.0; bm_sv=ADB3A3F3A502A88AB87A699AABFA8306~YAAQjwFAF8p5jreTAQAAv39A2BrlJaRi6EnFKpiRLF9ot9lcmLxTM+FnMPmBB8REOUKu5fPmsguwneP+W4+5o6HGvXxrZoVC0ItwzE6aNwsbvNwSMB1eNWzI5pPYUqYYSLRTCwZFhhh80opq7JmSm0kVJMaOAX1AtiSefDaYvNDQS67JcldgsDvSS41fKIBHBTMDv7f/5ikJHV2HAdzBc2S39zXNn1yFvofY9YHpR01HA6Bpkmt5zEyqaB6vAdm1nw==~1",
            Referer:
              "https://www.naukri.com/job-listings-senior-frontend-developer-react-angular-wfh-available-dreamroots-entertainment-and-technology-private-li-mited-hyderabad-bengaluru-delhi-ncr-3-to-8-years-070822000240?src=drecomm_apply&sid=17344999225451192&xp=1&px=1",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          method: "POST",
          body: JSON.stringify({
            strJobsarr: [job.jobId],
            logstr: "--drecomm_apply-2-F-0-1--17332073324634110-",
            flowtype: "show",
            crossdomain: true,
            jquery: 1,
            rdxMsgId: "",
            chatBotSDK: true,
            mandatory_skills: ["Java"],
            optional_skills: [
              "Vue.Js",
              "css",
              "Javascript",
              "Spring Boot",
              "html",
              "React.Js",
            ],
            applyTypeId: "107",
            closebtn: "y",
            applySrc: "drecomm_apply",
            sid: "17332073324634110",
            mid: "",
          }),
        }
      );
      console.log("retry response", retryresp);
    }

    saveJobToFile({
      companyName: job.companyName,
      jobId: job.jobId,
      title: job.title,
    });
    console.log(`Successfully applied to ${job.title} at ${job.companyName}`);
    await randomDelay();
  } catch (error) {
    console.error(
      `Error applying to ${job.title} at ${job.companyName}:`,
      error
    );
  }
};

const main = async () => {
  await login();
  console.log(">>>> Runnning naukri script");
  // const searchQuery = prompt("Enter the job title: ");
  const searchQuery = "MERN";
  // pageNo = parseInt(prompt("Enter the page number: "));
  pageNo = 1;
  for (; pageNo < 100; pageNo++) {
    const jobList = await fetchJobs(searchQuery);
    for (const job of jobList) {
      try {
        console.log(`Applying to ${job.title} at ${job.companyName}`);
        await submitJobApplication(job);
        await randomDelay();
      } catch (Err) {
        console.log(">>>> breaking through naukri script...");
        return;
      }
    }
  }
};

main();
