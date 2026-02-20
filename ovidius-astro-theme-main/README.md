# Sanginn.dev | AI & Product Management

This repository contains the source code for my personal portfolio and blog website, reflecting my journey to become an "대체 불가능한 Tech PM" (Irreplaceable Tech PM). The project is built using Astro.js and React, featuring interactive UI elements and a focus on clean, professional design.

## 🛠 작업 과정 및 달성 목표 (What's been done)

초기 작업은 기존 템플릿의 불필요한 요소를 제거하고 저만의 확고한 아이덴티티와 인터랙티브한 시각 요소들을 구축하는 데 집중했습니다.

- **브랜드 정체성 및 디자인 셋업**:
  - 전문적이고 신뢰감을 주는 비즈니스 컬러 팔레트 도입 (Jet, Ming, Timberwolf, Indigo Dye).
  - 글로벌 메타데이터 및 소셜 링크(GitHub, Instagram, LinkedIn, Gmail) 연동 완료.
  - 템플릿 출처 표기를 삭제하고 개인 저작권 표기가 적용된 깔끔한 하단 Footer 구성.
- **Hero 섹션 및 캔버스 애니메이션 구축**:
  - 메인 Hero 배너를 브라우저 전체 화면을 덮는 시네마틱 뷰로 확장.
  - React와 HTML5 Canvas API를 활용하여 마우스와 상호작용하는 유기적인 파티클 네트워크 애니메이션(`HeroAnimation.tsx`) 구현.
  - 중앙의 "Experience Bank" 글래스모피즘 박스 클릭 시 8가지의 유니크한 영문 폰트가 순환하는(Shuffle) 인터랙티브 무드 추가.
- **상단 네비게이션(Header) 개편**:
  - 모바일용 햄버거 메뉴를 제거하고 화면 상단에 항시 떠있는 알약(Pill) 형태의 고정형 네비게이션 바 도입.
  - KR/EN 언어 변환 토글 스위치 부착.
  - Contact 메뉴에 마우스 호버 시 소셜 아이콘이 스와이프되어 나타나는 스낵바(Snackbar) 애니메이션 적용.
- **블로그(Blog) 아키텍처 준비**:
  - 기존 템플릿의 더미(Dummy) 블로그 포스트 초기화.
  - 메인 화면에 최신 글을 보여줄 세련된 Huts.com 스타일의 hover/swipe 반응형 React 카드 컴포넌트(`BlogCard.tsx`) 개발.

## 🚀 이후 작업 계획 (Future Roadmap)

다음 페이즈의 핵심 목표는 **Blog 아키텍처 고도화** 및 콘텐츠 작성 환경 입히기입니다.

- [ ] **블로그 인프라 및 라우팅 정비**: 글을 읽는 상세 페이지(Slug)의 UI/UX 디자인 (가독성 높은 타이포그래피, 프로그레스 바 등 도입).
- [ ] **콘텐츠 태그 및 필터링 시스템**: AI, Product Management, 개인 에세이 등 글의 카테고리를 분류하고 필터링하는 기능 구현.
- [ ] **다국어(i18n) 블로그 지원**: 상단의 KR/EN 토글과 연동하여 한국어/영어 콘텐츠를 분리해서 렌더링하도록 구축.
- [ ] **MDX 기반 컴포넌트 추가**: 블로그 본문에 차트, 코드 블록, 인포그래픽 등을 쉽게 넣을 수 있는 MDX 렌더링 플러그인 셋업.

## 💻 Tech Stack
- **Framework**: [Astro.js](https://astro.build)
- **UI & Interactivity**: [React](https://react.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (Vanilla CSS mix)
- **Animation**: HTML5 Canvas API

---
*© 2026 Sanginn.dev | AI & Product Management - All rights reserved.*
