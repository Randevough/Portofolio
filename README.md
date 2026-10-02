# Muhamad Rafi Fernanda / Portfolio

The personal website and engineering portfolio of Muhamad Rafi Fernanda ([@randevough](https://github.com/randevough)), a full-stack developer based in Jakarta.

Live site: [rafifernanda.site](https://rafifernanda.site)

## Overview

This repository houses the source code for my portfolio. I built it to showcase full-stack projects, client work, and internal tools with a focus on speed, typography, and clean interaction design.

## Featured Work

- **CodeQuest**: Developer challenge board built for campus coding clubs with Next.js, Prisma, and NextAuth.
- **AksaraNetra**: Automated WCAG accessibility audit engine running headless Chromium on a VPS.
- **UKM Coding**: Community platform and Sanity CMS for Cyber University's developer collective.
- **Andalasia Creative**: Commercial production and event management agency website.

## Engineering Choices

- **Astro 5 (Static)**: Pre-rendered static pages with zero client-side hydration waterfalls.
- **Vanilla CSS**: Custom design system in `src/styles/global.css` using fluid `clamp()` tokens, custom scrollbars, and tactile texture layers.
- **Web Audio Engine**: Native Web Audio API synthesizer in `src/scripts/audio.ts` providing tactile analog feedback for buttons, stack tools, and page transitions without external audio files.
- **CSS-Driven Reveals**: Text animations rely on `IntersectionObserver` toggling `.is-in`, keeping content visible even if JavaScript engines fail.
- **Strict TypeScript**: Verified with `astro check` across all layouts, components, and data modules.
