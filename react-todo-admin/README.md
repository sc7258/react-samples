# React Todo Admin

이 프로젝트는 [React Todo](https://github.com/sc7258/react-samples/tree/main/react-todo) 애플리케이션의 관리자 페이지입니다. Supabase에 저장된 사용자와 사용자의 Todo 목록을 관리하는 기능을 제공합니다.

## 시작하기

프로젝트를 로컬 환경에서 실행하기 위한 절차입니다.

### 사전 준비

- [Node.js](https://nodejs.org/) (LTS 버전 권장)
- [npm](https://www.npmjs.com/)

### 설치

1.  프로젝트의 의존성을 설치합니다.
    ```bash
    npm install
    ```

2.  **환경 변수 설정**

    이 프로젝트는 Supabase와 연동하기 위해 환경 변수가 필요합니다. `.env.example` 파일을 복사하여 `.env` 파일을 생성하세요.

    ```bash
    # Windows (Command Prompt)
    copy .env.example .env

    # Windows (PowerShell)
    Copy-Item .env.example .env

    # Linux / macOS
    cp .env.example .env
    ```

    생성된 `.env` 파일을 열고, 아래의 값들을 실제 Supabase 프로젝트의 값으로 채워주세요. 해당 값들은 [Supabase 대시보드](https://app.supabase.com)의 **Project Settings > API** 메뉴에서 찾을 수 있습니다.

    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

### 개발 서버 실행

모든 설정이 완료되면, 아래 명령어로 개발 서버를 시작할 수 있습니다.

```bash
npm run dev
```

서버가 시작되면 브라우저에서 `http://localhost:5173` (또는 다른 포트) 주소로 접속할 수 있습니다.

## 주요 기술 스택

- **프레임워크:** React (with Vite)
- **언어:** TypeScript
- **백엔드/DB:** Supabase
- **UI 라이브러리:** Material-UI (MUI)
- **라우팅:** React Router
