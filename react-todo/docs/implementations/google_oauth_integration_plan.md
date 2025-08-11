# Google OAuth 연동 작업 실행 계획

## 1. 개요
- 기존의 이메일/비밀번호 기반 인증 방식에 Google OAuth를 이용한 소셜 로그인을 추가한다.
- 백엔드 서비스로는 Supabase를 활용하며, 프론트엔드에서는 Supabase 클라이언트 라이브러리를 통해 인증을 처리한다.

## 2. 선행 작업: Supabase 및 Google Cloud 설정
- **Supabase 프로젝트 설정:**
    1. Supabase 프로젝트 대시보드로 이동한다.
    2. 'Authentication' -> 'Providers' 메뉴로 이동한다.
    3. 'Google' Provider를 활성화한다.
    4. Supabase에서 제공하는 'Redirect URI'를 복사한다.
- **Google Cloud Console 설정:**
    1. Google Cloud Console에 로그인하여 새 프로젝트를 생성하거나 기존 프로젝트를 선택한다.
    2. 'API 및 서비스' -> 'OAuth 동의 화면'으로 이동하여 필요한 정보를 입력하고 저장한다.
    3. 'API 및 서비스' -> '사용자 인증 정보'로 이동한다.
    4. '+ 사용자 인증 정보 만들기' -> 'OAuth 클라이언트 ID'를 선택한다.
    5. 애플리케이션 유형으로 '웹 애플리케이션'을 선택한다.
    6. '승인된 리디렉션 URI' 섹션에 Supabase에서 복사한 Redirect URI를 추가한다.
    7. 생성된 '클라이언트 ID'와 '클라이언트 보안 비밀'을 복사한다.
- **Supabase Provider 설정 완료:**
    1. 다시 Supabase 대시보드로 돌아와 Google Provider 설정 화면을 연다.
    2. Google Cloud Console에서 복사한 '클라이언트 ID'와 '클라이언트 보안 비밀'을 붙여넣고 저장한다.

## 3. 프론트엔드 구현 계획
- **`src/pages/AuthPage.tsx` 수정:**
    1. 'Sign in with Google' 버튼을 UI에 추가한다.
    2. 버튼 클릭 시 Supabase 클라이언트를 사용하여 Google 로그인을 요청하는 함수를 구현한다.
    ```typescript
    import { supabase } from '../lib/supabaseClient';

    async function signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        console.error('Error signing in with Google:', error);
      }
    }
    ```
- **`src/lib/supabaseClient.ts` 확인:**
    1. Supabase URL과 anon key가 환경 변수(.env)를 통해 올바르게 설정되어 있는지 확인한다.
    ```typescript
    // .env.example 또는 .env 파일에 아래와 같은 형식으로 키가 존재해야 함
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
- **`src/App.tsx` 확인:**
    1. OAuth 콜백 후 세션 정보를 올바르게 감지하고, 로그인된 사용자를 `TodoPage`로 리디렉션하는 로직이 정상적으로 동작하는지 확인한다. Supabase의 `onAuthStateChange` 리스너가 이 역할을 수행할 가능성이 높다.

## 4. 테스트 및 검증 계획
1. `npm run dev` 명령어로 애플리케이션을 실행한다.
2. `AuthPage`에 새로 추가된 'Sign in with Google' 버튼을 클릭한다.
3. Google 로그인 팝업 또는 리디렉션 페이지에서 계정을 선택하고 로그인한다.
4. 인증 완료 후 애플리케이션으로 정상적으로 리디렉션되는지 확인한다.
5. 로그인된 상태로 `TodoPage`가 표시되는지 확인한다.