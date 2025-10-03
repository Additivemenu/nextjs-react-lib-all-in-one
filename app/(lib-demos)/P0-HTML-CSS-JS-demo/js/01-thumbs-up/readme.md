# Thumbs Up Click Effect Demo

https://mp.weixin.qq.com/s/eR4obTw_qFcu-Tng2dVhDw

## Technologies Used

- **Vanilla JavaScript**

  - Event listeners (`click`, `animationend`)
  - DOM manipulation (`createElement`, `appendChild`, `remove`)
  - DocumentFragment for efficient DOM updates
  - CSS custom properties manipulation via `style.setProperty()`

- **CSS**

  - CSS custom properties (variables) for dynamic positioning
  - CSS animations with `@keyframes`
  - CSS transforms (`translate`, `scale`, `rotate`)
  - Animation timing functions (`cubic-bezier`, `linear`)
  - Pseudo-elements (`::before`, `::after`)

- **HTML**
  - Basic structure with embedded iframe support

## Core Implementation Idea

The demo creates a **particle explosion effect** triggered by mouse clicks using a **CSS-driven animation system**:

1. **Dynamic Positioning System**

   - JavaScript captures click coordinates (`clientX`, `clientY`)
   - Passes coordinates to CSS via custom properties (`--left`, `--top`)
   - CSS uses these variables for absolute positioning

2. **Particle Generation**

   - Creates multiple emoji particles with random properties
   - Each particle gets random delay (`--d`) and horizontal movement (`--x`)
   - Uses DocumentFragment for efficient batch DOM insertion

3. **Animation Pipeline**

   - CSS handles all animations (no JavaScript animation loops)
   - Particles animate outward with rotation and gravity effect
   - Counter shows incrementing "+N" with scale animation

4. **Self-Cleanup System**
   - Elements listen for `animationend` events
   - Automatically remove themselves from DOM when animation completes
   - Prevents memory leaks and DOM bloat

**Key Technique**: Using CSS custom properties as a **communication bridge** between JavaScript (dynamic data) and CSS (animations), enabling performant hardware-accelerated animations while maintaining clean separation of concerns.
