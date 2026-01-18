import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'Health Nutrition Hacks';
    const category = searchParams.get('category') || 'Health';
    const author = searchParams.get('author') || 'HNH Team';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
            padding: '60px 80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header with Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              🌿 Health Nutrition Hacks
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {/* Category Badge */}
            <div
              style={{
                display: 'inline-flex',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                fontSize: 20,
                fontWeight: '600',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                alignSelf: 'flex-start',
              }}
            >
              {category}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '90%',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                display: 'flex',
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              borderTop: '3px solid rgba(255, 255, 255, 0.3)',
              paddingTop: '24px',
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
              }}
            >
              By {author}
            </div>
            <div
              style={{
                fontSize: 20,
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
              }}
            >
              healthnutritionhacks.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error('OG Image generation failed:', e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
