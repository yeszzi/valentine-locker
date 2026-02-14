# Railway 배포 가이드

## 준비 단계

### 1. package.json 수정
`package.json`의 `scripts`에 아래 내용 추가:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "start": "vite preview --host 0.0.0.0 --port $PORT"
}
```

### 2. Railway 설정 파일 생성
프로젝트 루트에 `railway.toml` 파일 생성:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start"
```

## Railway 배포 방법

### 옵션 1: GitHub 연동 (권장)

1. **GitHub에 코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Railway에서 프로젝트 생성**
   - https://railway.app 접속 후 로그인
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - 해당 repository 선택

3. **자동 배포**
   - Railway가 자동으로 빌드 및 배포 진행
   - GitHub에 푸시할 때마다 자동 재배포됨

### 옵션 2: Railway CLI 사용

1. **Railway CLI 설치**
   ```bash
   npm i -g @railway/cli
   ```

2. **로그인**
   ```bash
   railway login
   ```

3. **프로젝트 초기화**
   ```bash
   railway init
   ```

4. **배포**
   ```bash
   railway up
   ```

## 환경변수 설정

Railway 대시보드에서 환경변수 추가:
- `NODE_ENV=production`
- 기타 필요한 환경변수 (.env.local 참고)

## 도메인 설정

Railway 대시보드에서:
1. Settings → Networking
2. "Generate Domain" 클릭하여 무료 도메인 생성
3. 또는 커스텀 도메인 추가 가능

## 문제 해결

### 빌드 실패 시
- Railway 로그 확인: 대시보드 → Deployments → 해당 배포 클릭
- `package.json`의 의존성 확인
- Node.js 버전 확인 (Railway는 최신 LTS 사용)

### 404 오류 시
- SPA 라우팅 문제일 수 있음
- `_redirects` 파일 또는 서버 설정으로 모든 경로를 index.html로 리다이렉트 필요

### 포트 문제
- Railway는 `PORT` 환경변수를 자동 제공
- start 스크립트에서 `--port $PORT` 사용 필수
