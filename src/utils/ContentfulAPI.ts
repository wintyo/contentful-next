import * as contentful from 'contentful';

import { IPost } from '../interfaces/Post';

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

class ContentfulAPI {
  /**
   * 全てのpostを取得
   */
  async getAllPosts(): Promise<Array<IPost>> {
    const entries = await client.getEntries({
      content_type: 'post',
      order: '-fields.date',
    });
    return entries.items.map((item: any) => ({
      ...item.fields,
      // SSRだとDateに変換してもシリアライズできないのでコメントアウト
      // date: new Date(item.fields.date),
    }));
  }

  /**
   * slugのpostを取得
   * @param slug
   */
  async getPostBySlug(slug: string): Promise<IPost | null> {
    const entries = await client.getEntries({
      content_type: 'post',
      limit: 1,
      'fields.slug[in]': slug,
    });

    const post = entries.items[0];
    return post != null ? (post.fields as IPost) : null;
  }

  /**
   * 最新のpostsを3つ取得
   * @param slug
   */
  async getMorePosts(slug: string): Promise<Array<IPost>> {
    const entries = await client.getEntries({
      content_type: 'post',
      limit: 3,
      order: '-fields.date',
      'fields.slug[nin]': slug,
    });
    return entries.items.map((item: any) => ({
      ...item.fields,
      // SSRだとDateに変換してもシリアライズできないのでコメントアウト
      // date: new Date(item.fields.date),
    }));
  }

  /**
   * 全てのpostのslugを取得
   */
  async getAllPostSlugs(): Promise<Array<string>> {
    const entries = await client.getEntries({
      content_type: 'post',
      select: 'fields.slug',
    });
    return entries.items.map((item: any) => item.fields.slug);
  }
}

export default new ContentfulAPI();
