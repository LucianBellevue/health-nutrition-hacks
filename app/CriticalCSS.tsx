/**
 * Critical CSS component to be inlined in the document head
 * This eliminates render-blocking CSS for faster FCP/LCP
 * Only includes styles needed for above-the-fold content
 *
 * CRITICAL RULES TO PREVENT TAILWIND CONFLICTS:
 * ============================================
 *
 * 1. NEVER add padding, margin, border-width to element selectors here
 *    - These will override Tailwind utilities and break styling
 *    - Example: padding:0 on buttons breaks px-4, py-2, etc.
 *
 * 2. ONLY include absolutely critical styles:
 *    - CSS custom properties (--variables)
 *    - box-sizing for layout
 *    - Font inheritance settings
 *    - Basic display/flex properties
 *
 * 3. Keep this as MINIMAL as possible
 *    - More styles here = higher chance of Tailwind conflicts
 *    - Put element resets in globals.css @layer base instead
 *
 * 4. These inline styles load BEFORE Tailwind CSS
 *    - They have HIGHER specificity due to load order
 *    - Avoid element selectors that could conflict with utility classes
 */
export function CriticalCSS() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root{
        --background:#ecfdf5;
        --foreground:#18181b;
        --font-montserrat:var(--font-montserrat,system-ui)
      }
      .dark{
        --background:#09090b;
        --foreground:#fafafa
      }
      *,::before,::after{
        box-sizing:border-box
      }
      html{
        -webkit-text-size-adjust:100%;
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
        line-height:1.5;
        tab-size:4;
        font-family:var(--font-montserrat,system-ui)
      }
      body{
        background:var(--background);
        color:var(--foreground);
        font-family:inherit;
        margin:0;
        padding:0;
        min-height:100vh;
        display:flex;
        flex-direction:column;
        line-height:inherit
      }
      main{
        flex:1 1 0%;
        display:flex;
        flex-direction:column
      }
      h1,h2,h3,h4,h5,h6{
        margin:0
      }
      a{
        text-decoration:inherit
      }
      img,svg,video{
        display:block;
        vertical-align:middle;
        max-width:100%;
        height:auto
      }
      button,input,select,textarea{
        font-family:inherit;
        font-size:100%;
        line-height:inherit;
      }
      .antialiased{
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale
      }
    `}} />
  );
}
