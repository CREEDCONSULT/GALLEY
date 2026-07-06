# Design Notes - ContentFlow AI

## Visual Identity
ContentFlow AI should feel **premium, authoritative, and energetic**. The interface uses a dark-themed foundation with "electric" highlights and "glassmorphic" elements.

## Color Palette
- **Primary (Midnight)**: `#0F172A` (Backgrounds, Sidebars)
- **Action (Electric)**: `#3B82F6` (Buttons, Links, Energy)
- **Success**: `#10B981` (Published states)
- **Warning**: `#F59E0B` (Pending items)
- **Critical**: `#EF4444` (Errors, Cancel)
- **Surface**: `#1E293B` (Cards, Modals)

## Typography
- **Headings/Body**: `Inter` (Sans-serif, variable weight 400-900).
- **Technical/Stats**: `JetBrains Mono` (For SEO metrics and data).

## Component Guidelines
- **Glassmorphism**: Use `backdrop-blur-md` and semi-transparent backgrounds for dashboard cards.
- **Micro-interactions**: Subtle scale on hover for calendar items.
- **Progressive Disclosure**: Onboarding should only show one question at a time to minimize cognitive load.

## Key UI Screens
1. **The Pulse (Dashboard)**: A dense but readable cockpit view.
2. **The Forge (Editor)**: A focused writing environment with a side-panel for "SEO Intel".
3. **The Map (Calendar)**: A monthly grid view representing content flow over time.
