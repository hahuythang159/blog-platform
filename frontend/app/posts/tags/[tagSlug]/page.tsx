import { TagPostsPageProps } from '@/app/types';
import PostListClient from './PostsByTagClient';
import { getPostsByTagSlug } from '@/app/lib/postService';

const TagPostsPage = async ({ params }: TagPostsPageProps) => {
    const { tagSlug } = params;

    const posts = await getPostsByTagSlug(tagSlug);

    return <PostListClient posts={posts} tagSlug={tagSlug} />;
};

export default TagPostsPage;
