### **Todo 관리자 페이지 개발 계획**

이 계획은 프로젝트 설정부터 기능 구현, 배포 전 최종 점검까지의 과정을 포함합니다.

#### **Phase 1: 프로젝트 초기 설정 및 기반 구축 (1일차)**

- [x] **React 프로젝트 생성:**
    - [x] `Vite`를 사용하여 React 프로젝트를 생성하고 초기 구조를 설정합니다.
    - [x] `npm create vite@latest react-todo-admin -- --template react-ts`
- [x] **핵심 라이브러리 설치:**
    - [x] `@supabase/supabase-js`: Supabase 연동을 위한 클라이언트 라이브러리
    - [x] `react-router-dom`: 페이지 라우팅 관리
    - [x] `@mui/material @emotion/react @emotion/styled`: **Minimal Dashboard** 템플릿의 기반이 되는 Material-UI 라이브러리
- [x] **Supabase 연동 설정:**
    - [x] Supabase 프로젝트의 URL과 `anon` 키를 `.env` 파일에 환경 변수로 저장합니다.
    - [x] Supabase 클라이언트를 초기화하고 관리하는 `src/supabaseClient.ts` 파일을 생성합니다.
- [x] **기본 레이아웃 및 라우팅 구현:**
    - [x] MUI 컴포넌트를 사용하여 사이드바, 헤더, 메인 콘텐츠 영역으로 구성된 기본 레이아웃(`Layout.tsx`)을 구현합니다.
    - [x] `react-router-dom`을 사용하여 아래 페이지 경로에 대한 기본 라우팅을 설정합니다.
        - [x] `/login`: 로그인 페이지
        - [x] `/`: 사용자 목록 대시보드
        - [x] `/users/:id`: 사용자 상세 정보 페이지

#### **Phase 2: 인증 및 권한 관리 (2일차)**

- [x] **로그인 페이지 구현:**
    - [x] 'Google 계정으로 로그인' 버튼이 포함된 로그인 UI를 생성합니다.
    - [x] 버튼 클릭 시 Supabase의 `signInWithOAuth` 함수를 호출하여 Google 인증을 처리합니다.
- [x] **관리자 권한 확인 (Authorization):**
    - [x] **Supabase Edge Function 생성:** 로그인한 사용자가 관리자인지 확인하는 Edge Function을 만듭니다. 이 함수는 사전에 정의된 관리자 이메일 목록과 로그인한 사용자의 이메일을 비교하여 결과를 반환합니다. (보안상 `service_role` 키가 필요한 작업은 반드시 Edge Function에서 처리)
    - [x] **Private Route 구현:** 관리자만 접근할 수 있는 페이지를 위한 `PrivateRoute` 컴포넌트를 구현합니다. 이 컴포넌트는 페이지 로드 시 위에서 만든 Edge Function을 호출하여 관리자 여부를 확인하고, 관리자가 아닐 경우 로그인 페이지로 리디렉션합니다.
- [x] **로그아웃 기능 구현:**
    - [x] 헤더에 로그아웃 버튼을 추가하고, 클릭 시 `signOut` 함수를 호출하여 세션을 종료시킵니다.

#### **Phase 3: 사용자 및 Todo 관리 기능 구현 (3-4일차)**

- [x] **사용자 목록 조회 및 관리:**
    - [x] **Edge Function 추가:** `service_role` 키를 사용하여 `auth.admin.listUsers()`를 호출, 모든 사용자 목록을 가져오는 Edge Function을 구현합니다.
    - [x] **UI 구현:** 사용자 목록 페이지에서 위 함수를 호출하여 MUI 데이터 테이블(`DataGrid`)에 사용자 목록(이메일, 가입일 등)을 표시합니다. 페이지네이션 기능을 추가합니다.
    - [x] **사용자 삭제 기능:** 각 사용자 행에 '삭제' 버튼을 추가합니다. 클릭 시 확인 모달을 띄우고, 확인 시 `auth.admin.deleteUser()`를 호출하는 Edge Function을 실행합니다.
- [ ] **사용자별 Todo 목록 관리:**
    - [x] **사용자 상세 페이지:** 사용자 목록에서 특정 사용자를 클릭하면 `/users/:id` 경로로 이동합니다.
    - [x] **Todo 데이터 연동:** 해당 페이지에서 `user_id`를 기준으로 `todos` 테이블을 조회하여 해당 사용자의 Todo 목록을 모두 가져와 표시합니다.
    - [x] **Todo CRUD 구현:** 관리자가 특정 사용자의 Todo를 추가, 수정, 삭제할 수 있는 UI와 Supabase 연동 로직을 구현합니다.

#### **Phase 4: 데이터베이스 설정 및 최종 점검 (5일차)**

- [x] **데이터베이스 스키마 확인:**
    - [x] Supabase SQL Editor를 통해 `todos` 테이블의 `user_id` 외래키 제약조건에 `on delete cascade` 옵션이 포함되어 있는지 확인하고, 없다면 추가합니다. 이는 사용자 삭제 시 관련 Todo 데이터가 자동으로 삭제되도록 보장합니다.
    - [x] `ALTER TABLE public.todos DROP CONSTRAINT todos_user_id_fkey, ADD CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;`
- [x] **RLS (Row Level Security) 정책 설정:**
    - [x] `todos` 테이블에 관리자 권한을 위한 RLS 정책을 추가합니다. "admin" 역할을 가진 사용자는 모든 `todos` 데이터에 대해 `SELECT`, `INSERT`, `UPDATE`, `DELETE` 작업을 수행할 수 있도록 허용합니다.
- [x] **테스트 및 디버깅:**
    - [x] 구현된 모든 기능(로그인, 사용자 관리, Todo 관리)이 요구사항 명세서대로 동작하는지 테스트합니다.
    - [x] 다양한 시나리오(권한 없는 접근, 데이터 삭제 등)에 대한 예외 처리를 확인합니다.
