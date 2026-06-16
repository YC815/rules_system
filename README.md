# TSchool 學生會法規系統

學生會法規的唯一真相來源。所有法規以 Markdown 檔案存放於 `content/regulations/`，合併後自動部署上線。

---

## 目錄

- [法規如何上線](#法規如何上線)
- [第一步：寫法規](#第一步寫法規)
- [第二步：上傳 PR](#第二步上傳-pr)
- [第三步：等待審核與部署](#第三步等待審核與部署)
- [檔名命名規則](#檔名命名規則)
- [Frontmatter 欄位說明](#frontmatter-欄位說明)
- [常見問題](#常見問題)

---

## 法規如何上線

```
你在 Google Docs 寫好法規
        ↓
複製貼上到 GitHub 新增檔案（本頁第二步有圖解）
        ↓
開一個 Pull Request（PR）讓學生會長或資訊部審核
        ↓
PR 合併後，Vercel 自動在 1–2 分鐘內部署上線
```

不需要會寫程式，不需要安裝任何軟體，只需要一個 GitHub 帳號。

---

## 第一步：寫法規

### 1-1 在 Google Docs 完稿

在 Google Docs 把法規內文寫完、確認用詞與條次無誤後，匯出 Markdown：

> **檔案 → 下載 → Markdown (.md)**

解壓縮後用任意文字編輯器（記事本、VS Code 均可）打開那個 `.md` 檔。

### 1-2 加上 Frontmatter

在檔案**最頂部**（第一行）貼上以下區塊，並填入對應資料：

```markdown
---
title: 學生會財務管理辦法
code: "SA-2026-004"
category: "財務規章"
status: "現行"
enacted: "2026-06-01"
lastAmended: "2026-06-01"
summary: "規範學生會年度預算編列、核銷程序及財務公告義務。"
---

（法規內文從這裡開始）
```

完整範本請參考 [`content/regulations/_template.md`](content/regulations/_template.md)。

### 1-3 法規內文格式

條文用 `**第X條**（條名）` 的格式書寫，章節用 `##` 標題：

```markdown
## 第一章　總則

**第一條**（立法目的）本辦法依學生會組織章程第九條規定訂定之。

**第二條**（適用範圍）本辦法適用於學生會一切財務收支事項。

## 第二章　預算

**第三條**（年度預算）每學年由財務部於第一學期開學兩週內完成預算草案...
```

---

## 第二步：上傳 PR

**全程在 GitHub 網頁介面操作，不需要終端機。**

### 2-1 前往法規資料夾

打開 GitHub 倉庫：[github.com/YC815/rules_system](https://github.com/YC815/rules_system)

點進去 `content` → `regulations` 資料夾。

### 2-2 新增檔案

點右上角的 **「Add file」→「Create new file」**。

### 2-3 填入檔名

在頂部的檔名欄位輸入檔名，格式為：

```
NNN-slug.md
```

- `NNN`：三位數編號，接續現有最大號碼（目前到 003，新的填 004）
- `slug`：英文小寫、用連字號分隔的法規簡稱

範例：`004-election-rules.md`、`005-club-subsidy.md`

### 2-4 貼入內容

把第一步準備好的完整文字（含 frontmatter）貼入下方的編輯器。

### 2-5 開 Pull Request

頁面拉到底，選擇：

> ⦿ **Create a new branch for this commit and start a pull request**

分支名稱系統會自動產生（例如 `YC815-patch-1`），不需要改。

點 **「Propose new file」**，再點 **「Create pull request」**。

PR 標題建議格式：`新增：XXX法規` 或 `修正：XXX第X條`。

---

## 第三步：等待審核與部署

1. 學生會長或資訊部幹部會在 PR 留言提出修改意見或直接核准。
2. 如有修改意見，在 PR 頁面直接編輯檔案後再 commit，修改會自動加入同一個 PR。
3. PR 被合併（Merge）後，Vercel 自動部署，**1–2 分鐘**內網站更新。

---

## 檔名命名規則

| 欄位 | 規則 | 範例 |
|------|------|------|
| 編號 | 三位數，接續現有最大號 | `004`、`005` |
| slug | 英文小寫、連字號分隔 | `election-rules`、`club-subsidy` |
| 副檔名 | 固定 `.md` | |

完整範例：`004-election-rules.md`

---

## Frontmatter 欄位說明

| 欄位 | 說明 | 範例值 |
|------|------|--------|
| `title` | 法規全名 | `學生會選舉辦法` |
| `code` | 法規代碼，格式 `SA-年份-流水號` | `SA-2026-004` |
| `category` | 法規類別（見下表） | `選舉規章` |
| `status` | 目前狀態（見下表） | `現行` |
| `enacted` | 制定日期，格式 `YYYY-MM-DD` | `2026-06-01` |
| `lastAmended` | 最後修正日期，若從未修正則同制定日期 | `2026-09-01` |
| `summary` | 一句話描述用途與適用範圍 | `規範選舉程序...` |

**`category` 可用值**

- `組織規章`
- `財務規章`
- `選舉規章`
- `其他`

**`status` 可用值**

- `現行`：目前有效執行中
- `草案`：尚未正式通過
- `已廢止`：已停止適用

---

## 常見問題

**Q：我沒有 GitHub 帳號怎麼辦？**  
到 [github.com](https://github.com) 免費註冊，再請倉庫管理員將你加為 Collaborator。

**Q：法規要修正某幾條，怎麼提 PR？**  
直接在 GitHub 倉庫找到該檔案，點右上角鉛筆圖示（Edit）編輯，修改後一樣走「Create a new branch → Pull request」流程。記得同步更新 `lastAmended` 欄位的日期。

**Q：PR 開了之後發現內容打錯，還能改嗎？**  
可以。在 PR 頁面點進去修改過的檔案，再按鉛筆圖示直接在同一個分支上 commit，修改會自動反映在 PR 裡。

**Q：Vercel 部署失敗怎麼辦？**  
通知資訊部，PR 的 Checks 欄位會顯示錯誤訊息，通常是 frontmatter 格式有誤（缺少引號或日期格式不對）。

**Q：想廢止一條舊法規怎麼做？**  
打開該法規的 `.md` 檔，把 `status` 改成 `已廢止`，提 PR 即可。不需要刪除檔案。
