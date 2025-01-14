const rulesConfig = [
  "DOMAIN,clash.razord.top,直连",
  "DOMAIN,yacd.haishan.me,直连",
  "DOMAIN-SUFFIX,nuget.org,直连",
  "RULE-SET,applications,直连",
  "RULE-SET,private,直连",
  "RULE-SET,apple@cn,直连",
  "RULE-SET,apple-cn,直连",
  "GEOSITE,steam@cn,直连",
  "RULE-SET,microsoft@cn,直连",
  "RULE-SET,category-games@cn,直连",
  "RULE-SET,direct,直连",
  "DOMAIN-SUFFIX,cn,直连",
  "GEOIP,private,直连",
  "RULE-SET,cnIP,直连",
  "DOMAIN-SUFFIX,esm.run,代理",
  "DOMAIN-SUFFIX,jsdelivr.com,代理",
  "DOMAIN-SUFFIX,jsdelivr.net,代理",
  "RULE-SET,AppleProxy_No_Resolve,代理",
  "GEOSITE,onedrive,代理",
  "GEOSITE,gfw,代理",
  "GEOSITE,tld-!cn,代理",
  "GEOSITE,geolocation-!cn,代理",
  "RULE-SET,adblock_reject,拦截",
  "RULE-SET,category-ads-all,拦截",
  "RULE-SET,OpenAI_No_Resolve,OpenAI",
  "RULE-SET,microsoft,Microsoft",
  "GEOSITE,github,Github",
  "RULE-SET,apple,Apple",
  "RULE-SET,google,Google",
  "RULE-SET,youtube,YouTube",
  "GEOSITE,spotify,代理",
  "RULE-SET,Telegram_No_Resolve,代理",
  "RULE-SET,facebook,代理",
  "GEOSITE,tiktok,TikTok",
  "GEOSITE,whatsapp,代理",
  "GEOSITE,x,代理",
  "GEOSITE,instagram,代理",
  "MATCH,规则外路由选择"
];
const ruleProvidersConfig = {};
const ruleProviderBaseUrl = {
  "MetaCubeX": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/",
  "xixu-me": "https://raw.githubusercontent.com/xixu-me/rulesets-for-META/refs/heads/basic/",
  "blackmatrix7": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/",
};
const ruleProvidersMap = [
  ["adblock_reject", "https://raw.githubusercontent.com/REIJI007/AdBlock_Rule_For_Clash/main/adblock_reject.mrs"],
  ["direct", `${ruleProviderBaseUrl["xixu-me"]}direct.mrs`],
  ["category-ads-all", `${ruleProviderBaseUrl["MetaCubeX"]}category-ads-all.mrs`],
  ["apple@cn", `${ruleProviderBaseUrl["MetaCubeX"]}apple@cn.mrs`],
  ["apple-cn", `${ruleProviderBaseUrl["MetaCubeX"]}apple-cn.mrs`],
  ["apple", `${ruleProviderBaseUrl["MetaCubeX"]}apple.mrs`],
  ["facebook", `${ruleProviderBaseUrl["MetaCubeX"]}facebook.mrs`],
  ["category-games@cn", `${ruleProviderBaseUrl["MetaCubeX"]}category-games@cn.mrs`],
  ["microsoft@cn", `${ruleProviderBaseUrl["MetaCubeX"]}microsoft@cn.mrs`],
  ["microsoft", `${ruleProviderBaseUrl["MetaCubeX"]}microsoft.mrs`],
  ["youtube", `${ruleProviderBaseUrl["MetaCubeX"]}youtube.mrs`],
  ["google", `${ruleProviderBaseUrl["MetaCubeX"]}google.mrs`],
  ["private", `${ruleProviderBaseUrl["MetaCubeX"]}private.mrs`],
  ["cnIP", "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/cn.mrs", "ipcidr"],
  ["AppleProxy_No_Resolve", `${ruleProviderBaseUrl["blackmatrix7"]}AppleProxy/AppleProxy_No_Resolve.yaml`, "classical", "yaml"],
  ["OpenAI_No_Resolve", `${ruleProviderBaseUrl["blackmatrix7"]}OpenAI/OpenAI_No_Resolve.yaml`, "classical", "yaml"],
  ["Telegram_No_Resolve", `${ruleProviderBaseUrl["blackmatrix7"]}Telegram/Telegram_No_Resolve.yaml`, "classical", "yaml"],
  ["applications", `${ruleProviderBaseUrl["xixu-me"]}applications.yaml`, "classical", "yaml"],
];
ruleProvidersMap.forEach(([providerName, url, behavior = "domain", format = "mrs"]) => {
  ruleProvidersConfig[providerName] = {
    "type": "http",
    "format": format,
    "behavior": behavior,
    "interval": 86400,
    "url": url,
    "path": `./ruleset/${providerName}.${format}`
  }
});
function proxyGroupsConfig(config) {
  const subProxies = (config.proxies || []).map(p => p.name); //获取订阅下来的所有节点
  const allProxies = subProxies.filter(name => !/套餐|网址|剩余|到期|更新|重置|使用|流量|订阅|距离|官网|.com/.test(name)); // 所有节点（排除订阅专用节点）
  const proxiesHK = allProxies.filter(name => /香港|HK|Hong Kong/.test(name));
  const proxiesTW = allProxies.filter(name => /台湾|台灣|台北|TW|Taiwan|Taipei/.test(name));
  const proxiesSG = allProxies.filter(name => /新加坡|狮城|SG|Singapore/.test(name));
  const proxiesJP = allProxies.filter(name => /日本|JP|Japan/.test(name));
  const proxiesUS = allProxies.filter(name => /美国|美國|US|USA|United States/.test(name));
  const proxiesTWSG = allProxies.filter(name => [...proxiesTW, ...proxiesSG].includes(name));//台新
  const proxiesHKTWSG = allProxies.filter(name => [...proxiesHK, ...proxiesTW, ...proxiesSG].includes(name));//港台新
  const proxiesHKTWSGJP = allProxies.filter(name => [...proxiesHK, ...proxiesTW, ...proxiesSG, ...proxiesJP].includes(name));//港台新日
  const proxiesOther = allProxies.filter(name => ![...proxiesHK, ...proxiesTW, ...proxiesSG, ...proxiesJP, ...proxiesUS].includes(name));//其他地区
  //节点组通用配置
  const proxyGroupsSetting = {
    "lazy": false,
    "url": "https://www.gstatic.com/generate_204",
    "interval": 300,
    "tolerance": 50,
    "timeout": 500,
    "max-failed-times": 3
  };
  // 创建节点组
  const createProxyGroup = (proxyName, type, proxies, icon, hidden = false) => ({
    "name": proxyName,
    "type": type,
    "proxies": proxies.length > 0 ? proxies : ["❎ Null"],
    ...proxyGroupsSetting,
    "icon": icon,
    "hidden": hidden
  });
  const iconBaseUrl = "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/";
  const proxiesRegion = ["台新-自动", "港台新-自动", "港台新日-自动", "自动选择", "香港", "台湾省", "新加坡", "美国", "日本", "其他地区", "自动回退", "负载均衡"];
  const proxyGroups = [
    createProxyGroup("规则外路由选择", "select", ["代理", "直连", ...proxiesRegion.slice(0, 4)], `${iconBaseUrl}Domestic.png`),
    createProxyGroup("代理", "select", proxiesRegion, `${iconBaseUrl}Proxy.png`),
    createProxyGroup("OpenAI", "select", [...proxiesRegion.slice(0, 3)], `${iconBaseUrl}ChatGPT.png`),
    createProxyGroup("Microsoft", "select", ["直连", ...proxiesRegion], `${iconBaseUrl}Microsoft.png`),
    createProxyGroup("Github", "select", ["代理", ...proxiesRegion], `${iconBaseUrl}GitHub.png`),
    createProxyGroup("Google", "select", ["代理", ...proxiesRegion], `${iconBaseUrl}Google_Search.png`),
    createProxyGroup("YouTube", "select", ["代理", ...proxiesRegion], `${iconBaseUrl}YouTube.png`),
    createProxyGroup("Apple", "select", ["直连", ...proxiesRegion], `${iconBaseUrl}Apple_1.png`),
    createProxyGroup("TikTok", "select", [...proxiesRegion.slice(0, 10)], `${iconBaseUrl}TikTok.png`),
    createProxyGroup(proxiesRegion[0], "url-test", proxiesTWSG, `${iconBaseUrl}Auto.png`, true),
    createProxyGroup(proxiesRegion[1], "url-test", proxiesHKTWSG, `${iconBaseUrl}Auto.png`, true),
    createProxyGroup(proxiesRegion[2], "url-test", proxiesHKTWSGJP, `${iconBaseUrl}Auto.png`, true),
    createProxyGroup(proxiesRegion[3], "url-test", allProxies, `${iconBaseUrl}Auto.png`, true),
    createProxyGroup(proxiesRegion[4], "url-test", proxiesHK, `${iconBaseUrl}Hong_Kong.png`, true),
    createProxyGroup(proxiesRegion[5], "url-test", proxiesUS, `${iconBaseUrl}Taiwan.png`, true),
    createProxyGroup(proxiesRegion[6], "url-test", proxiesSG, `${iconBaseUrl}Singapore.png`, true),
    createProxyGroup(proxiesRegion[7], "url-test", proxiesTW, `${iconBaseUrl}United_States.png`, true),
    createProxyGroup(proxiesRegion[8], "url-test", proxiesJP, `${iconBaseUrl}Japan.png`, true),
    createProxyGroup(proxiesRegion[9], "select", proxiesOther, `${iconBaseUrl}Null_Nation.png`),
    createProxyGroup(proxiesRegion[10], "fallback", allProxies, `${iconBaseUrl}Available.png`, true),
    {
      ...createProxyGroup(proxiesRegion[11], "load-balance", allProxies, `${iconBaseUrl}Round_Robin.png`, true),
      "strategy": "consistent-hashing"
    },

    createProxyGroup("直连", "select", ["DIRECT"], "", true),
    createProxyGroup("拦截", "select", ["REJECT"], "", true),
    createProxyGroup("❎ Null", "select", ["REJECT"], "", true),
  ];
  return proxyGroups;
};
function main(config) {

  config["proxy-groups"] = proxyGroupsConfig(config);
  config["rule-providers"] = ruleProvidersConfig;
  config["rules"] = rulesConfig;
  return config;
}
