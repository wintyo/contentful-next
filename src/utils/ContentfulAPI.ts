import * as contentful from 'contentful';

import { IPost } from '../interfaces/Post';

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

class ContentfulAPI {
  async getAllPosts(): Promise<Array<IPost>> {
    const entries = await client.getEntries({
      content_type: 'post',
      order: '-fields.date',
    });
    if (entries.items) {
      return entries.items.map((item: any) => ({
        ...item.fields,
        // SSRだとDateに変換してもシリアライズできないのでコメントアウト
        // date: new Date(item.fields.date),
      }));
    }
    return [];
  }
}

export default new ContentfulAPI();
