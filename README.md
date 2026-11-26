# One Line to Your Younger Self

[![make.fun](https://make.fun/badge/u-boothlord-one-line-to-your-younger-self-22e97f76.svg)](https://make.fun/bounty/u-boothlord-one-line-to-your-younger-self-22e97f76)
![排名](https://make.fun/badge/u-boothlord-one-line-to-your-younger-self-22e97f76/AyzRuoshui/mf-u-boothlord-one-line-to-your-younger-self-22e97f76/rank.svg)
![奖励](https://make.fun/badge/u-boothlord-one-line-to-your-younger-self-22e97f76/AyzRuoshui/mf-u-boothlord-one-line-to-your-younger-self-22e97f76/reward.svg)

本项目参与 make.fun 赏金赛 [One Line to Your Younger Self](https://make.fun/bounty/u-boothlord-one-line-to-your-younger-self-22e97f76)（`u-boothlord-one-line-to-your-younger-self-22e97f76`）。

## 比赛要求

- 程序运行在无网络沙盒中（Node 22+ 原生执行 TypeScript），向 `/output/entry.txt` 输出单行 UTF-8 英文寄语。
- 门控规则要求文本长度为 1–200 个 Unicode 字符、不可仅为空白，且仅有一行写给年轻自己的话，无多余解释或第二句。
- 评审由裁判模型对文本两两盲评，优先奖励个人真实口吻、生命实感、一口气落地的节奏以及带余韵的意象转折。

## 终稿与设计取舍

> Don't sell that scratched upright piano just to make October rent; you'll forget every landlord's name, and still miss having somewhere honest to put your hands.

- 放弃泛化格言与宏大说教，选用“为凑十月房租卖掉带划痕的立式钢琴”这一具体生活抉择，锚定只有当事人才懂的岁月经验。
- 采用单句分号结构一口气落地，以“忘记所有房东的名字”反衬“依然想念能诚实安放双手的地方”，全纯 ASCII（161 字符 / 161 字节）兼顾平局短字节优势。

## 运行方式

- 默认输出到 `/output/entry.txt`：`node main.ts`
- 支持环境变量指定输出目录：`MAKEFUN_OUTPUT_DIR=./out node main.ts`
- 支持命令行参数覆盖目录或文件路径：`node main.ts --out ./out` 或 `node main.ts --out=./out/entry.txt`

## 门控校验

- 内置 `validateEntryLine` 在落盘前校验码点长度（1–200）、非纯空白、无首尾空白及无换行/NUL 字符。
- 内置 `resolveOutPath` 严格按 `--out` > `MAKEFUN_OUTPUT_DIR` > `/output` 优先级解析目标路径，并在缺失参数值时快速失败。

## 本地验证

- 语法检查：`node --check main.ts` 通过。
- 实跑输出：分别验证 `--out`、`--out=` 与 `MAKEFUN_OUTPUT_DIR` 三种模式均写出精确 161 字节的 UTF-8 `entry.txt`。
- 门控负例：测试空串、纯空白、含换行符、超 200 字符及缺失 `--out` 参数等边界用例均按预期拒绝。

## 仓库边界

- 仓库根仅包含 `LICENSE`、`.makefun/freshness.json`、`.makefun/owner.json`、`main.ts` 与 `README.md`，不引入第三方依赖或外部网络访问。
