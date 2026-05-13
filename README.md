# 가계부 (app-creativing)

영수증 기반 개인 가계부 앱 — 1단계: 지출 수동 입력 + 내역 조회

## 기술 스택
- React Native (Expo SDK 51)
- expo-sqlite (로컬 저장)
- @react-navigation/bottom-tabs

## 파일 구조
```
app-creativing/
├── App.js                       # 진입점 (탭 네비게이션 + DB 초기화)
├── app.json                     # Expo 설정
├── babel.config.js
├── package.json
├── src/
│   ├── constants/
│   │   └── categories.js        # 카테고리 정의 (식비/교통/쇼핑/기타)
│   ├── db/
│   │   └── database.js          # SQLite CRUD
│   ├── screens/
│   │   ├── InputScreen.js       # 입력 탭
│   │   └── HistoryScreen.js     # 내역 탭
│   └── utils/
│       └── format.js            # 통화/날짜 포맷
```

## 실행 방법

### 1. Node.js 설치
[https://nodejs.org](https://nodejs.org) 에서 LTS 버전(18 이상) 설치.

### 2. 의존성 설치
프로젝트 폴더에서 PowerShell을 열고:
```powershell
npm install
```

### 3. Expo 개발 서버 시작
```powershell
npx expo start
```
QR 코드가 표시됩니다.

### 4. 휴대폰에서 실행
- Android: Play 스토어에서 **Expo Go** 앱 설치 → 앱 실행 후 QR 스캔
- iPhone: App Store에서 **Expo Go** 설치 → 카메라로 QR 스캔

PC와 휴대폰이 **같은 Wi-Fi**에 연결되어 있어야 합니다.
연결이 안 되면 터미널에서 `s` 키를 눌러 `Tunnel` 모드로 전환하세요.

### 5. (선택) Android 에뮬레이터에서 실행
Android Studio 설치 후 AVD(에뮬레이터) 실행 → 터미널에서 `a` 키.

## 사용법
- **입력 탭**: 금액 입력 → 카테고리 선택 → 날짜 선택 → 메모 입력 → `저장`
- **내역 탭**: 최신순 목록 표시. 휴지통 아이콘으로 삭제. 하단에 이번 달 총 지출 합계.

## 데이터 저장 위치
앱 내부 SQLite 파일 (`budget.db`)에 저장됩니다. 앱을 삭제하면 같이 사라집니다.
