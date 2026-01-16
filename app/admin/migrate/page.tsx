'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Database } from 'lucide-react';

export default function MigrateImagesPage() {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    totalPosts?: number;
    updatedCount?: number;
    updatedPosts?: string[];
    error?: string;
  } | null>(null);

  const runMigration = async () => {
    setMigrating(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/migrate-images', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, ...data });
      } else {
        setResult({ success: false, message: data.error || 'Migration failed', error: data.details });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to run migration',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Database Migration</h1>
        <p className="text-emerald-400 mt-1">
          Fix PostImage components with Cloudinary URLs
        </p>
      </div>

      <div className="bg-black rounded-xl p-6 shadow-sm border border-emerald-500/30">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-white">Image Component Migration</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-900 rounded-lg p-4 border border-emerald-500/20">
            <p className="text-sm text-white mb-2">
              <strong className="text-emerald-400">What this does:</strong>
            </p>
            <ul className="text-sm text-emerald-400 space-y-1 ml-4 list-disc">
              <li>Scans all posts in the database</li>
              <li>Finds PostImage components using Cloudinary URLs</li>
              <li>Converts them to standard Next.js Image components</li>
              <li>Updates the posts automatically</li>
            </ul>
          </div>

          <button
            onClick={runMigration}
            disabled={migrating}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Database className="h-5 w-5" />
            {migrating ? 'Running Migration...' : 'Run Migration'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div
            className={`mt-6 p-4 rounded-lg border ${
              result.success
                ? 'bg-emerald-900/20 border-emerald-500/30'
                : 'bg-red-900/20 border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold mb-2 ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.message}
                </p>
                
                {result.success && result.totalPosts !== undefined && (
                  <div className="text-sm text-white space-y-1">
                    <p>Total posts checked: <strong className="text-emerald-400">{result.totalPosts}</strong></p>
                    <p>Posts updated: <strong className="text-emerald-400">{result.updatedCount}</strong></p>
                    
                    {result.updatedPosts && result.updatedPosts.length > 0 && (
                      <div className="mt-3">
                        <p className="font-semibold text-emerald-400 mb-2">Updated posts:</p>
                        <ul className="ml-4 space-y-1 list-disc text-emerald-400">
                          {result.updatedPosts.map((post, idx) => (
                            <li key={idx}>{post}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {result.error && (
                  <p className="text-sm text-red-400 mt-2">
                    Error details: {result.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
