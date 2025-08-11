# React와 Supabase를 이용한 Todo 애플리케이션

이 프로젝트는 React, Vite, TypeScript를 사용하여 구축된 간단한 할 일 관리(Todo) 애플리케이션입니다. 백엔드 서비스로는 Supabase를 활용하여 사용자 인증과 데이터베이스를 처리합니다.

## 주요 기능

- **사용자 인증:** 이메일/비밀번호를 통한 회원가입 및 로그인
- **할 일(Todo) 관리:** 할 일 추가, 조회, 수정, 삭제 (CRUD)
- **상태 관리:** 할 일의 완료/미완료 상태 변경
- **필터링:** 전체, 활성, 완료된 할 일 목록 필터링

## 기술 스택

- **프론트엔드:**
  - React
  - Vite
  - TypeScript
  - React Router DOM
- **백엔드 (BaaS):**
  - Supabase (Database, Authentication, RLS)
- **배포:**
  - Vercel (계획)

## 시작하기

이 프로젝트를 로컬 환경에서 실행하기 위한 자세한 방법은 아래 개발 환경 설정 문서를 참고하세요.

- [개발 환경 설정 안내서](./docs/development/setup.md)

## 데이터베이스 스키마 및 정책

Supabase 데이터베이스 테이블 스키마와 RLS(Row Level Security) 정책에 대한 정보는 아래 문서에서 확인할 수 있습니다.

- [Supabase 설정 및 스키마 문서](./docs/infra/supabase.md)
