import { Badge, Button, Dialog, Toast } from "antd-mobile";
import classNames from "classnames";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAsyncEffect, useInterval, useRequest } from "ahooks";
import CardIcon from "../wallet/icons/wallet-bg.png";
import Logo from "@/assets/pngs/logo.png";
import SvgIcon from "@/components/svg-icon";
import { useTranslation } from "react-i18next";
import { useAuthNavigate } from "@/hooks/auth-navigate";
import request from "@/helpers/request";
import { $user, syncMessageCount, syncUser } from "@/stores";
import BigNumber from "bignumber.js";
import InviteIcon from "./icons/invite.png";
import GiftIcon from "./icons/gift.png";
import LuckIcon from "./icons/luck.png";
import MsgIcon from "./icons/msg.png";
import numberParse, { decimalNumber } from "@/helpers/number";
import { publicApi } from "@/stores/panel";

export type SwitchWallet = {
  id: string;
  name: string;
  ratioYear: string;
  pawnPowerStep: string;
  pawnPower: string;
  principalMin: string;
};

export default function Fast() {
  const [input, setInput] = useState<number | undefined>();
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState<SwitchWallet | null>(null);
  const [product, setProduct] = useState<Record<string, any> | null>(null);
  const [principal, setPrincipal] = useState<Record<string, string> | null>(
    null
  );
  const [usdtAccumulate, setUsdtAccumulate] = useState<number>(0);
  const [wowAccumulate, setWowAccumulate] = useState<number>(0);
  const { t } = useTranslation();
  const authNavigate = useAuthNavigate();

  const { data } = useRequest(async () => {
    const { result } = await request.get("/mining/product/list");

    return result;
  });

  const { data: balance } = useRequest(async () => {
    const { result } = await request.get("/balance/getUsdtBalance", {
      params: {
        symbol: "TRCUSDT",
        net: "TRX",
      },
    });

    return result;
  });

  const { data: wowBalance } = useRequest(async () => {
    const { result } = await request.get("/balance/getWowBalance");

    return result;
  });

  const calculateAmount: number = +(input || principal?.USDT || 10);
  const basewow: number = BigNumber(principal?.USDT || 10)
    .times(active?.pawnPower || 1)
    .toNumber();

  useInterval(
    async () => {
      setUsdtAccumulate(usdtAccumulate + +product?.secondIncome);
      setWowAccumulate(wowAccumulate + +(active?.pawnPowerStep as string));
    },
    1000,
    {
      immediate: true,
    }
  );

  useEffect(() => {
    setUsdtAccumulate(0);
    setWowAccumulate(0);
    if (active) {
      try {
        setPrincipal(JSON.parse(active.principalMin));
      } catch (error) {
        /* empty */
      }
    }
  }, [active]);

  useEffect(() => {
    syncMessageCount();
  }, []);

  // console.log(wowAccumulate, active)

  const onSample = useCallback(async () => {
    await request.post("/mining/sample");
    authNavigate("/fast", {
      replace: true,
      to: "/fast",
    });
    syncUser();
    Dialog.clear();
    console.log(data);
    const item = data?.[0];
    console.log(item);
    if (item) {
      getPruductInfo(item.id);
      setActive(item);
    }
  }, [data]);

  useEffect(() => {
    if (
      searchParams.get("source") === "sample" &&
      $user.get().data?.sampleFlag === 0
    ) {
      Dialog.confirm({
        content: (
          <>
            <header className="mb-2 p-1 font-semibold text-left flex items-center text-[#b5b5b5] bg-[#010202]/25 w-32 rounded-full text-15">
              <SvgIcon name="usdt" className="w-7 h-7 mr-3" />
              {t("indexPage.askReceive")}
            </header>
            <p className="mt-6 mb-4 text-[1.8125rem] font-semibold tracking-widest">
              {t("indexPage.trailProd")}
            </p>
            <p className="mt-0 mb-6 h-10 leading-10 bg-[#d8d8d8] text-[#010202] text-xl font-semibold text-center rounded-full inline-block px-4">
              {t("indexPage.trailName")}
            </p>
          </>
        ),
        onConfirm: () => {
          publicApi("点击质押界面体验金确认按钮");
          onSample();
          return Promise.reject();
        },
        onCancel: () => {
          publicApi("点击质押界面体验金取消按钮");
          authNavigate("/fast", {
            replace: true,
            to: "/fast",
          });
        },
        confirmText: t("myWowList.confirmTransform"),
        cancelText: t("buyWow.cancel"),
      });

      return () => {
        Dialog.clear();
      };
    }
  }, [data]);

  const onConfirm = async () => {
    await request.post("/mining/infinite", {
      miningId: active?.id,
      principal: calculateAmount,
    });
    // @ts-ignore
    setInput("");
    // setActive(null)
    getPruductInfo(active?.id as string);
    Toast.show(t("indexPage.buySuccess"));
    Dialog.clear();
  };

  const onSubmit = async () => {
    if (!input) {
      return Toast.show(t("index.pleaseInputPrice"));
    }
    if (input > balance?.balance) {
      return Dialog.confirm({
        content: (
          <p
            className="mt-0 mb-8 p-4 text-xl tracking-widest text-left bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(180deg,#c4c4c4,#757575)",
            }}
          >
            {t("indexPage.askRecharge")}
          </p>
        ),
        className: "pbcontent",
        onConfirm: async () => {
          authNavigate("/receive");
        },
        confirmText: t("myWowList.confirmTransform"),
        cancelText: t("buyWow.cancel"),
      });
    }

    Dialog.confirm({
      content: (
        <p
          className="mt-0 mb-8 p-2 text-xl tracking-widest text-left bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(180deg,#c4c4c4,#757575)" }}
        >
          {t("indexPage.askBuyMine")}
        </p>
      ),
      className: "pbcontent",
      onConfirm: () => {
        onConfirm();
      },
      confirmText: t("myWowList.confirmTransform"),
      cancelText: t("buyWow.cancel"),
    });
  };

  const getPruductInfo = async (id: string) => {
    const { result } = await request.get("/mining/product/statistics", {
      hideLoading: true,
      params: {
        productId: id,
      },
    } as any);

    setProduct(result);
  };

  return (
    <div className="w-full px-[18px]">
      <div className=" bg-bg-darkGray17 rounded-[6px]">
        <div className="mt-4 mb-5 w-full h-[12.938rem] rounded-sm bg-bg-gray24 px-[11px] py-[18px] shadow-cardShadow bg-cover p-6 pb-4 flex flex-col justify-between text-text-ordinary font-wow">
          <header className="flex items-center h-6">
            <img src={Logo} className="w-6 h-6 mr-3" />
            <span className="leading-6 pt-1 text-lg font-semibold text-text-textA6 font-poppins">
              {active
                ? numberParse(
                    (wowBalance?.balance ?? 0) +
                      (wowBalance?.currentBalance ?? 0) +
                      wowAccumulate * +calculateAmount
                  ) + " WOW"
                : "WOW EARN"}
            </span>
          </header>

          <p className="text-center text-[23px] font-bold font-poppins text-white mt-[25px]">
            {active
              ? numberParse(
                  BigNumber(Number(product?.calculatedIncome))
                    .plus(usdtAccumulate)
                    .toNumber()
                ) + " USDT"
              : numberParse(
                  BigNumber(+balance?.balance)
                    .plus(Number(balance?.rewardBalance))
                    .toNumber()
                ) + " USDT"}
          </p>

          <footer className="text-right text-xs font-poppins h-12 pr-1">
            {active ? (
              <>
                {product?.infiniteTotalAmount ? (
                  <div>{numberParse(product?.infiniteTotalAmount)} USDT</div>
                ) : null}
                <div className="text-11">{active.ratioYear}% APR</div>
                <div className="text-[0.5625rem]">
                  +
                  {product?.speedHour === "0"
                    ? numberParse(BigNumber(basewow).times(0.003).toNumber(), 6)
                    : numberParse(product?.speedHour, 6)}{" "}
                  WOW/Hr
                </div>
              </>
            ) : null}
          </footer>
        </div>

        <div className=" bg-contain bg-no-repeat rounded-b-[6px]  pb-[19px] px-[13px] bg-bg-darkGray17">
          <div
            className="flex h-[2.25rem] justify-between items-center m-auto text-center gap-[12px]"
            style={{ padding: "0 3px" }}
          >
            {data?.map((item: SwitchWallet) => (
              <SwitchItem
                key={item.name}
                text={item.name}
                active={active?.id === item?.id}
                id={item.id}
                onClick={() => {
                  publicApi(`质押界面点击${item.id}D`);
                  getPruductInfo(item.id);
                  setActive(active === item ? null : item);
                }}
              />
            ))}
          </div>

          <div className="flex justify-center mt-[22px]">
            <span className="relative inline-flex">
              <div
                className={classNames(
                  "absolute flex items-center top-0 left-0 right-0 bottom-0 p-[5px]  ",
                  {
                    hidden: !!active,
                  }
                )}
              ></div>
              <div className="flex items-center w-[10.25rem] bg-[#232323] p-[5px] pr-[11px] rounded-2xl z-10 border-[0.3px] border-[#797979]">
                {/* <img className="w-6 h-6 rounded-full mr-[6px]" /> */}
                <SvgIcon
                  name="usdt"
                  className="w-5 h-[20px] rounded-full mr-[6px]"
                />
                <input
                  className="bg-transparent outline-none !text-xs placeholder:text-slate-50/50 flex-1 w-1"
                  placeholder={active ? (principal?.USDT || 10) + "+" : ""}
                  value={input}
                  type="number"
                  onChange={(e) => {
                    if (e.target.value) {
                      const v = +e.target.value;
                      if (isNaN(v)) return;
                      setInput(decimalNumber(v));
                    } else {
                      setInput(undefined);
                    }
                  }}
                />
                <span
                  onClick={() => {
                    publicApi("点击质押界面MAX按钮");
                    setInput(decimalNumber(balance?.balance) || undefined);
                  }}
                  className="text-[#2FD15B] text-[11px] block text-center rounded-full"
                >
                  {t("index.max")}
                </span>
              </div>
              <Button
                onClick={()=>{onSubmit();publicApi('点击质押界面质押按钮')}}
                className="w-12 h-full text-13 rounded-2xl p-0 m-0 bg-[#39BC5C] text-[#1c1c1c] ml-3 border-none">
                {t('index.buy')}
              </Button>
            </span>
          </div>
        </div>
      </div>

      <div className="flex mt-5 justify-around">
        <img
          onClick={() => {
            publicApi("质押界面邀请按钮跳转至邀请界面");
            authNavigate("/invitation");
          }}
          src={InviteIcon}
          className="w-6 h-6"
        />
        <img
          onClick={() => {
            publicApi("质押界面盲盒按钮跳转至盲盒界面");
            authNavigate("/lucky-box");
          }}
          src={GiftIcon}
          className="w-6 h-6"
        />
        <img
          onClick={() => {
            publicApi("质押界面转盘按钮跳转至转盘界面");
            authNavigate("/lucky-wheel");
          }}
          src={LuckIcon}
          className="w-6 h-6"
        />
        <Badge content={$user.get().messageCount ? Badge.dot : null}>
          <img
            onClick={() => {
              publicApi("质押界面消息按钮跳转至消息界面");
              authNavigate("/information");
            }}
            src={MsgIcon}
            className="w-6 h-6"
          />
        </Badge>
      </div>
    </div>
  );
}

function SwitchItem({
  text,
  active,
  onClick,
  id,
}: {
  text: string;
  active?: boolean;
  onClick?: () => void;
  id: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useAsyncEffect(async () => {
    if (active && ref.current) {
      // ref.current.classList
    }
  }, [active, id]);

  return (
    <span
      ref={ref}
      onClick={onClick}
      className={classNames(
        "cursor-pointer inline-flex justify-center items-center text-sm text-gray74 w-[67px] h-[28px] rounded-md bg-bg-darkGray21 text-text-gray74",
        { "!text-white !ring-transparent": active }
      )}
      style={{
        backgroundImage: active
          ? "linear-gradient(90deg, rgb(181, 181, 181) 0%, rgb(56, 56, 56) 100%)"
          : "#212121",
      }}
    >
      {text.slice(0, text.indexOf("D")) + " " + text.slice(text.indexOf("D"))}
    </span>
  );
}
