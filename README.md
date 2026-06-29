# 커뮤니티 게시판 프로젝트

React와 NestJS로 구현한 풀스택 커뮤니티 게시판 프로젝트입니다.  
게시글, 댓글, 좋아요, 신고, 관리자 신고 처리 기능을 포함하며 JWT 기반 인증/인가를 적용했습니다.

## 기술 스택

- Frontend: React, TypeScript, Vite
- Backend: NestJS, TypeScript, TypeORM
- Database: SQLite
- Auth: JWT, Guard 기반 권한 처리
- Test: Jest

## 주요 기능

- 회원가입 / 로그인
- 게시글 작성, 조회, 수정, 삭제
- 댓글 작성, 수정, 삭제
- 좋아요 토글
- 게시글 / 댓글 신고
- 관리자 신고 조회, 처리, 삭제
- 게시글 검색, 정렬, 페이지네이션

## 인증 / 인가

- 로그인 성공 시 JWT accessToken 발급
- 보호 API 요청 시 `Authorization: Bearer <token>` 사용
- 게시글 작성자는 JWT에서 가져온 사용자 정보로 저장
- 게시글 수정 / 삭제는 작성자 또는 관리자만 가능
- 댓글 작성자는 JWT에서 가져온 사용자 정보로 저장
- 댓글 수정 / 삭제는 작성자 또는 관리자만 가능
- 신고 생성은 로그인 사용자만 가능
- 신고 목록 조회 / 처리 / 삭제는 관리자만 가능

## 구현하면서 신경 쓴 점

- 클라이언트가 보내는 `authorId`, `authorName`, `reporterId`, `reporterName`을 신뢰하지 않고 JWT에서 사용자 정보를 가져오도록 개선했습니다
- 프론트 라우트에서만 권한을 막지 않고, 백엔드 API에서도 Guard와 서비스 권한 검사를 적용했습니다
- 게시글과 댓글의 수정 / 삭제 권한을 서비스 레이어에서 검사해 API 직접 호출에도 대응하도록 했습니다
- 신고 처리 API는 관리자 권한이 있는 계정만 접근할 수 있도록 분리했습니다

## 실행 방법

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 환경 변수

백엔드 실행 시 `backend/.env` 파일이 필요합니다.

```env
JWT_SECRET=your-jwt-secret
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## 검증

### Backend

```bash
cd backend
npm.cmd test -- --runInBand
npm.cmd run build
```

결과:

- Test Suites: 3 passed
- Tests: 11 passed
- Backend build passed

### Frontend

```bash
cd frontend
npm.cmd run build
```

결과:

- Frontend build passed

## 개선 예정

- localStorage 기반 토큰 저장을 HttpOnly Cookie 방식으로 개선
- API URL 환경 변수화
- TypeORM 관계 설정 및 Like 테이블 분리
- E2E 테스트 보강
- 배포 환경 구성
- 다음 프로젝트에서는 Java, MySQL 기반으로 확장 예정
