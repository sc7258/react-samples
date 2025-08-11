# Todo 애플리케이션 구현 계획서

이 문서는 `docs/requirements` 폴더의 요구사항을 기반으로 React와 Supabase를 사용한 Todo 애플리케이션의 단계별 구현 계획을 기술한다.

## 1. 개발 단계별 계획

### 1단계: 프로젝트 설정 및 환경 구성

- **목표:** 개발을 위한 기본 환경을 설정하고 Supabase 프로젝트를 준비한다.
- **세부 작업:**
    1. **React 프로젝트 확인:** Vite를 사용하여 생성된 현재 React 프로젝트 구조를 확인하고 필요한 초기 설정을 점검한다.
    2. **필요 라이브러리 설치:**
        - Supabase 클라이언트: `npm install @supabase/supabase-js`
        - 라우팅 라이브러리: `npm install react-router-dom`
        - (선택) 상태 관리: `zustand` 또는 `recoil` (초기에는 React Hooks로 충분)
        - (선택) 스타일링: `tailwindcss` (PRD에 명시됨)
    3. **Supabase 프로젝트 설정:**
        - Supabase 공식 홈페이지에서 신규 프로젝트를 생성한다.
        - **Authentication:** Email Provider를 활성화한다.
        - **Database:** `todos` 테이블을 생성한다.
            - **컬럼:**
                - `id`: `uuid` (Primary Key, default: `uuid_generate_v4()`)
                - `user_id`: `uuid` (Foreign Key to `auth.users.id`)
                - `task`: `text` (Not Null)
                - `is_completed`: `boolean` (Default: `false`)
                - `created_at`: `timestamp with time zone` (Default: `now()`)
        - **Row Level Security (RLS) 정책 설정:**
            - 사용자가 자신의 `todo`만 보고 조작할 수 있도록 RLS 정책을 활성화하고 규칙을 추가한다.
                - `SELECT`: `auth.uid() = user_id`
                - `INSERT`: `auth.uid() = user_id`
                - `UPDATE`: `auth.uid() = user_id`
                - `DELETE`: `auth.uid() = user_id`
    4. **환경 변수 설정:**
        - 프로젝트 루트에 `.env` 파일을 생성한다.
        - Supabase 프로젝트의 `Project URL`과 `anon key`를 환경 변수로 등록한다.
            - `VITE_SUPABASE_URL=your_supabase_project_url`
            - `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`
        - `vite.config.ts`에서 환경 변수를 사용할 수 있도록 설정한다.

### 2단계: UI 컴포넌트 구조 설계 및 개발

- **목표:** 재사용 가능하고 명확한 역할 분담을 가진 UI 컴포넌트를 설계하고 개발한다.
- **세부 작업:**
    1. **페이지 컴포넌트:**
        - `AuthPage.tsx`: 로그인/회원가입 폼을 포함하는 페이지.
        - `TodoPage.tsx`: 실제 Todo 리스트가 표시되는 메인 페이지.
    2. **공통 컴포넌트:**
        - `Layout.tsx`: 헤더, 푸터 등 공통 레이아웃 구조.
        - `Header.tsx`: 로고, 로그아웃 버튼 등을 포함.
        - `Input.tsx`, `Button.tsx`: 공통으로 사용될 입력 필드와 버튼.
    3. **기능별 컴포넌트:**
        - `AuthForm.tsx`: 이메일, 비밀번호 입력을 받아 로그인 또는 회원가입을 처리하는 폼.
        - `TodoForm.tsx`: 새로운 할 일을 입력하고 추가하는 폼.
        - `TodoList.tsx`: `TodoItem`들을 리스트 형태로 렌더링.
        - `TodoItem.tsx`: 개별 할 일 항목 (내용, 완료 체크박스, 수정/삭제 버튼).
        - `TodoFilter.tsx`: '전체', '활성', '완료' 필터링 버튼 그룹.

### 3단계: 사용자 인증 기능 구현

- **목표:** Supabase Auth를 연동하여 안전한 사용자 인증 흐름을 구현한다.
- **세부 작업:**
    1. **Supabase 클라이언트 초기화:** Supabase 클라이언트를 초기화하는 모듈(`src/lib/supabaseClient.ts`)을 생성한다.
    2. **인증 로직 구현:**
        - **회원가입:** `AuthForm`에서 입력받은 정보로 `supabase.auth.signUp()`을 호출한다.
        - **로그인:** `AuthForm`에서 입력받은 정보로 `supabase.auth.signInWithPassword()`를 호출한다.
        - **로그아웃:** `Header`의 로그아웃 버튼 클릭 시 `supabase.auth.signOut()`을 호출한다.
    3. **세션 관리 및 라우팅 제어:**
        - `App.tsx` 또는 별도의 컨텍스트(`AuthContext`)에서 `onAuthStateChange`를 구독하여 사용자 세션 상태를 전역적으로 관리한다.
        - 로그인 상태에 따라 `AuthPage`와 `TodoPage`로 리다이렉트하는 `ProtectedRoute`를 구현한다.

### 4단계: Todo CRUD 기능 구현

- **목표:** Supabase 데이터베이스와 연동하여 핵심 기능인 Todo CRUD를 구현한다.
- **세부 작업:**
    1. **데이터 서비스 함수 생성:** `todos` 테이블에 대한 CRUD 작업을 수행하는 비동기 함수들을 별도 모듈(`src/services/todoService.ts`)로 분리한다.
        - `getTodos()`
        - `addTodo(task)`
        - `updateTodo(id, new_task)`
        - `toggleTodoComplete(id, is_completed)`
        - `deleteTodo(id)`
    2. **기능 연동:**
        - **Create:** `TodoForm`에서 `addTodo`를 호출하여 새 할 일을 추가한다.
        - **Read:** `TodoPage`가 로드될 때 `getTodos`를 호출하여 목록을 가져온다.
        - **Update:** `TodoItem`에서 수정 모드 진입 후 `updateTodo`를 호출하여 내용을 변경한다. `toggleTodoComplete`를 호출하여 완료 상태를 변경한다.
        - **Delete:** `TodoItem`에서 `deleteTodo`를 호출하여 항목을 삭제한다.
    3. **상태 관리:**
        - `TodoPage`에서 `useState` 또는 `useReducer`를 사용하여 Todo 목록 상태를 관리하고, 각 CRUD 작업 후 상태를 업데이트하여 UI를 다시 렌더링한다.

### 5단계: 고급 기능 및 최종 마무리

- **목표:** 필터링 기능을 구현하고, 전체적인 스타일링과 반응형 디자인을 적용한다.
- **세부 작업:**
    1. **필터링 기능 구현:**
        - `TodoFilter` 컴포넌트에서 선택된 필터 상태(`all`, `active`, `completed`)를 관리한다.
        - `TodoList` 컴포넌트에서 현재 필터 상태에 따라 보여줄 목록을 필터링하여 렌더링한다.
    2. **스타일링:**
        - `Tailwind CSS` 또는 `CSS Modules`를 사용하여 요구사항에 맞는 디자인을 적용한다.
        - 완료된 항목은 취소선 등으로 시각적 구분을 명확히 한다.
    3. **반응형 디자인:**
        - 모바일, 태블릿, 데스크톱 화면 크기에 맞게 UI가 자연스럽게 보이도록 반응형 스타일을 적용한다.
    4. **에러 처리 및 피드백:**
        - API 요청 실패 시 사용자에게 적절한 에러 메시지를 보여준다.
        - 데이터 로딩 중에는 로딩 스피너 등을 표시한다.

### 6단계: 배포

- **목표:** Vercel을 통해 애플리케이션을 배포하고 자동 배포 파이프라인을 구축한다.
- **세부 작업:**
    1. **GitHub 저장소 연동:** 프로젝트 코드를 GitHub에 푸시한다.
    2. **Vercel 프로젝트 생성:** Vercel 대시보드에서 GitHub 저장소를 import하여 새 프로젝트를 생성한다.
    3. **환경 변수 설정:** Vercel 프로젝트 설정에서 `.env`에 저장했던 Supabase 관련 환경 변수를 동일하게 등록한다.
    4. **배포 및 테스트:** `main` 브랜치에 코드가 푸시될 때마다 자동으로 빌드 및 배포가 진행되는지 확인하고, 배포된 URL에서 최종 테스트를 수행한다.
