export type Promotion = {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  code?: string;
  discount?: string;
  icon: string; // Emoji character or image URL
};

export const PROMOTIONS: Promotion[] = [
  {
    id: "zeabur-mojito",
    name: "Zeabur (Mojito)",
    category: "云服务 (Cloud)",
    description: "在 Zeabur 上轻松部署各种应用服务，零痛点上线您的下一个想法。",
    url: "https://zeabur.com?referralCode=mojitogirlforme",
    code: "mojitogirlforme",
    discount: "10% OFF",
    icon: "☁️",
  },
  //   {
  //     id: "zeabur-houshuai",
  //     name: "Zeabur (Houshuai)",
  //     category: "云服务 (Cloud)",
  //     description: "在 Zeabur 上轻松部署各种应用服务，零痛点上线您的下一个想法。",
  //     url: "https://zeabur.com?referralCode=houshuai0816",
  //     code: "houshuai0816",
  //     discount: "10% OFF",
  //     icon: "☁️",
  //   },
  {
    id: "dog-vpn",
    name: "Dog VPN (狗狗加速器)",
    category: "梯子网络 (VPN)",
    description: "快速、稳定、安全的网络加速服务，突破网络限制，畅游全球网络。",
    url: "https://go.dginv.click/#/register?code=f6w6lunR",
    code: "f6w6lunR",
    discount: "专享折扣",
    icon: "🐶",
  },
];
