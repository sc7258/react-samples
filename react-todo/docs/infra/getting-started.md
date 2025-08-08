# 인프라 시작하기 (Getting Started)

이 문서는 React Todo 애플리케이션을 실행하는 데 필요한 외부 인프라 서비스(Supabase)의 계정을 생성하고, 프로젝트를 준비하는 초기 단계를 안내합니다.

## 1. Supabase

### 1.1. Supabase란?

Supabase는 오픈 소스 Firebase 대체재를 표방하는 BaaS(Backend as a Service) 플랫폼입니다. 이 프로젝트에서는 Supabase를 통해 다음 기능을 구현합니다.

- **데이터베이스:** PostgreSQL을 기반으로 할 일(Todo) 데이터를 저장하고 관리합니다.
- **인증 (Authentication):** 이메일/비밀번호 기반의 사용자 회원가입 및 로그인 기능을 처리합니다.
- **API:** 데이터베이스 테이블에 대한 RESTful API를 자동으로 생성하여 프론트엔드와 통신합니다.

### 1.2. 계정 생성 및 프로젝트 준비

1.  **Supabase 가입:**
    - [Supabase 공식 홈페이지](https://supabase.com/)로 이동하여 `Start your project` 버튼을 클릭합니다.
    - GitHub, Google 계정을 이용하거나 이메일로 직접 가입할 수 있습니다. 가장 편리한 방법을 선택하여 계정 생성을 완료합니다.

2.  **새 프로젝트 생성:**
    - 로그인 후, Supabase 대시보드에서 `New project` 버튼을 클릭합니다.
    - 조직(Organization)을 선택하거나 새로 만듭니다.
    - **Project name**, **Database Password**, **Region**을 설정합니다.
        - **Database Password:** 안전한 비밀번호를 생성하고 반드시 따로 저장해두세요. 나중에 데이터베이스에 직접 접근할 때 필요할 수 있습니다.
        - **Region:** 사용자와 가까운 지역을 선택하는 것이 응답 속도에 유리합니다.
    - `Create new project` 버튼을 클릭하여 프로젝트 생성을 완료합니다. 생성에는 몇 분 정도 소요될 수 있습니다.

---

여기까지 완료했다면, 이제 이 프로젝트에 맞는 데이터베이스 스키마와 보안 정책을 설정할 준비가 되었습니다.

다음 단계로, 아래 문서의 안내에 따라 테이블 생성 및 RLS 정책 설정을 진행하세요.

- **다음 문서:** [Supabase 설정 및 스키마 문서](./supabase.md)
