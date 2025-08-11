# 개발 환경 설정 안내서

이 문서는 React Todo 애플리케이션을 로컬 개발 환경에서 설정하고 실행하는 과정을 안내합니다.

## 1. 사전 요구사항

- [Node.js](https://nodejs.org/) (v20.x 이상 권장)
- [npm](https://www.npmjs.com/) 또는 [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 2. 프로젝트 클론 및 의존성 설치

1.  **프로젝트 클론**

    터미널을 열고 원하는 위치에 프로젝트를 클론합니다.

    ```bash
    git clone https://github.com/your-username/react-todo.git
    cd react-todo
    ```

2.  **의존성 패키지 설치**

    프로젝트에 필요한 라이브러리들을 설치합니다.

    ```bash
    npm install
    ```

## 3. Supabase 설정

이 애플리케이션은 백엔드로 Supabase를 사용합니다. 로컬에서 개발을 진행하려면 Supabase 프로젝트를 생성하고 필요한 설정을 완료해야 합니다.

**아직 Supabase 계정이 없다면, 아래 시작하기 문서를 먼저 참고하여 계정을 생성하고 프로젝트를 준비하세요.**

- **시작하기:** [인프라 시작하기 (Getting Started)](../infra/getting-started.md)

준비가 완료되면 아래 절차를 계속 진행합니다.

1.  **Supabase 프로젝트 생성**

    - [Supabase 공식 홈페이지](https://supabase.com/)에 가입하고 로그인합니다.
    - 새로운 프로젝트를 생성합니다.

2.  **데이터베이스 테이블 및 RLS 정책 설정**

    프로젝트가 정상적으로 동작하려면 `todos` 테이블과 데이터 보안을 위한 RLS(Row Level Security) 정책이 필요합니다. 아래 문서에 포함된 SQL 쿼리를 Supabase 대시보드의 **SQL Editor**에서 실행하여 설정을 완료하세요.

    - [Supabase 설정 및 스키마 문서](../infra/supabase.md)

3.  **환경 변수 파일 생성**

    - 프로젝트 루트 디렉터리에 있는 `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.

      ```bash
      cp .env.example .env
      ```

    - 생성된 `.env` 파일을 열고, Supabase 프로젝트 대시보드의 **Settings > API** 메뉴에서 확인한 **Project URL**과 **anon key** 값을 입력합니다.

      ```
      VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
      VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
      ```

## 4. 애플리케이션 실행

모든 설정이 완료되면, 아래 명령어를 사용하여 개발 서버를 시작할 수 있습니다.

```bash
npm run dev
```

서버가 성공적으로 시작되면, 터미널에 표시된 URL(기본값: `http://localhost:5173`)로 접속하여 애플리케이션을 확인할 수 있습니다.
