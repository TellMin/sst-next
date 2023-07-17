## SST-NEXT プロジェクト

SST と Next.js を用いてサーバーレスアプリケーションを構築するサンプルプロジェクト

### [SST](https://sst.dev/) とは

SST(Serverless Stack Toolkit) とは、AWS でサーバーレスアプリケーションを構築するためのフレームワーク
open-next ライブラリを用いることで Next.js をサーバーレスで構築可能

当リポジトリでは、下記サンプルを参考にアプリケーションの構築を行う

- [Use Next.js with SST](https://docs.sst.dev/start/nextjs)
- [Google Auth](https://sst.dev/examples/how-to-add-google-login-to-your-sst-apps.html)

### Config - SST

Config ライブラリを用いることで、環境変数をセキュアに管理
例えば下記コマンドで環境変数を設定することが可能

```bash
pnpm sst secrets set STRIPE_KEY sk_test_abc123
```
