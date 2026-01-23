/**
 * Critical CSS component to be inlined in the document head
 * This eliminates render-blocking CSS for faster FCP/LCP
 * Only includes styles needed for above-the-fold content
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
        box-sizing:border-box;
        border-width:0;
        border-style:solid;
        border-color:currentColor
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
        font-size:inherit;
        font-weight:inherit;
        margin:0
      }
      a{
        color:inherit;
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
        color:inherit;
        margin:0;
        padding:0
      }
      .antialiased{
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale
      }
    `}} />
  );
}
