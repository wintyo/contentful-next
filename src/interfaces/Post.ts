import { Document } from '@contentful/rich-text-types';

export interface IPost {
  title: string;
  slug: string;
  date: string;
  content: Document;
}
