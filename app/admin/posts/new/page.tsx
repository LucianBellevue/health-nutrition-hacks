import PostEditor from '@/components/admin/PostEditor';

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Write and publish a new blog post
        </p>
      </div>
      <PostEditor />
    </div>
  );
}
