---
name: Instituto Tang Lang Dao
description: A mantis lives on the page and strikes, in the academy's own orange and green.
colors:
  fundo: "#F5F0E6"
  areia: "#ECE5D6"
  nevoa: "#E3E9DB"
  pessego: "#F4E4D0"
  sol: "#E9A06A"
  sol-esc: "#A5531B"
  verde: "#2F6B46"
  verde-esc: "#245238"
  tinta: "#2A332E"
  papel: "#FBF8F1"
  cinza: "#5B5F58"
  lotus: "#FE005C"
typography:
  display:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "min(19vw, 27svh)"
    fontWeight: 400
    lineHeight: 0.86
  heading:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "clamp(2.1rem, 5.4vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.04
  body:
    fontFamily: "Albert Sans, Segoe UI, Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  hanzi:
    fontFamily: "Noto Serif SC, Songti SC, serif"
    fontWeight: 700
rounded:
  nenhum: "0"
spacing:
  margem: "clamp(1.25rem, 4.5vw, 4.5rem)"
  secao: "clamp(4.5rem, 10vw, 9rem)"
components:
  button-tinta:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.nenhum}"
    padding: "13px 26px"
    height: "56px"
  button-sol:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.nenhum}"
    padding: "13px 26px"
    height: "56px"
---

# Design System: Instituto Tang Lang Dao

## Overview

The founding scene of the style happens on the page: a green mantis, standing on a plant in front of a Chinese temple, tries to catch a cicada. The temple is the pagoda from the logo. Grounds are soft so that reading never tires the eyes.

## Colors

`fundo`, `areia`, `nevoa` and `pessego` are the soft section grounds. `tinta` sets text and solid buttons; `sol` is the soft accent fill and `sol-esc` the accent for text. The saturated academy colours live only in the logo and the mantis. `lotus` appears only with As 5 Pétalas.

## Typography

Dela Gothic One is chunky and friendly, so a beginner is not scared off. Albert Sans sets running text. Hanzi use Noto Serif SC with `lang="zh"`, in characters as the institute writes them. The hero title deliberately exceeds the usual display ceiling, because the mantis reaches over it.

## Layout

Margins from `margem`, sections from `secao`. Long content runs in ruled rows and full-width colour blocks rather than cards. On phones the mantis stands between the title and the actions.

## Elevation & Depth

Flat colour. Depth belongs to the mantis: near limbs lighter, far limbs darker. The only shadow is on the floating WhatsApp button.

## Shapes

Square corners everywhere; strikes are sharp. Status marks are small diamonds.

## Components

- **Louva-Deus:** articulated in canvas with inverse kinematics. Spring-driven forelegs, chrono-trail on the strike, static frame under reduced motion.
- **Cigarra:** flies on its own, follows the pointer when there is one, and is caught when in reach.
- **Golpes:** 12 buttons with hanzi and pinyin. Each plays a gesture and draws its path in orange. The site states the gesture is an illustration.
- **Caminhos:** three rows that change the WhatsApp message to the visitor's interest.
- **Tai Chi:** a figure in canvas performs a slow form (起势, 云手, 单鞭, 收势) with a pause button and a static frame under reduced motion.
- **Grade:** class schedule table that marks today's column, plus live status in São Paulo time.
- **Árvore:** SVG built from a text list in the page, keeping the layout and routing of the institute's PDF, with its lineage colours and legend, softened to fit the page. Scrolls sideways at full size so the names stay readable.

- **Tai Chi (SiteCaio5):** the form now runs 起势, 站桩, 攬雀尾, 云手, 单鞭, 收势 (53.5 s). The same figure, with no caption or pause button, stands on the covers of Sobre Nós, Locais de Treino and Tai Chi.
- **Mantis limits:** forelegs never point more than 120° from the left horizontal, in rest and in the strike.
- **Submenus:** Modalidades and Portal do Aluno open on hover, focus or the chevron button. Phones show the sub-items indented in the menu.
- **Nome da escola (Sobre):** a red seal of 螳螂道武术协会 split into four buttons, one meaning shown at a time, auto-advancing until the visitor touches it.
- **Yin e Yang (Tai Chi):** a canvas Taijitu whose halves grow and shrink into each other, with pairs of qualities changing on both sides.
- **Ciclos:** curriculum tables in collapsible rows (Kung Fu and Tai Chi pages).
- **Templo (Lista de Alunos):** dark-red hall with roof, swinging lanterns and a lacquered name plaque; each student is a gilded ancestral tablet. Inactive students are grey, italic and struck through. Belt colours: `.faixa--1..10`.
- **Leitai (Hall da Fama):** sunset ring with a string of medals (one per medal won, swinging), the institute medal tally, athlete cards on the red platform, and a filterable results table.
- **Acesso às Aulas:** login, modality choice (an unpractised one is greyed out), grade cascade where the student's own grade and lower ones are open, curriculum drawn on canvas with the student's name as watermark, page-turn animation, 10-minute idle logout.
- **Visitas:** a small line in the footer, refreshed daily at 06h (Brasília).

## Do's and Don'ts

- Do call legend legend, and keep the institute's own caveats.
- Do keep WhatsApp reachable in every state.
- Don't add cards as page structure outside the Portal do Aluno themes, or labels above headings.
- Don't use AI illustrations or third-party images; the owner removed them.
- Don't invent prices, ranks or student counts.
