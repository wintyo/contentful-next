import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { format as formatDate } from 'date-fns';
import { NextPage, GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';

import { IPost } from '../../interfaces/Post';
// import styles from '../../styles/Blog.module.scss';
import ContentfulAPI from '../../utils/ContentfulAPI';

interface IProps {
  post: IPost | null;
  morePosts: Array<IPost>;
}

export const getStaticPaths = async () => {
  const allSlugs = await ContentfulAPI.getAllPostSlugs();
  return {
    paths: allSlugs.map((slug) => `/blog/${slug}`),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<IProps> = async ({ params }) => {
  if (params == null) {
    throw new Error('params are undefined.');
  }
  const post = await ContentfulAPI.getPostBySlug(params.slug as string);
  const morePosts = await ContentfulAPI.getMorePosts(params.slug as string);
  return {
    props: {
      post,
      morePosts,
    },
  };
};

const SlugPage: NextPage<IProps> = (props) => {
  console.log(props);

  if (!props.post) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <div>
      <Head>
        <title>{props.post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>{props.post.title}</h1>
      <div>日付：{formatDate(new Date(props.post.date), 'yyyy/MM/dd')}</div>
      <div>{documentToReactComponents(props.post.content)}</div>
    </div>
  );
};

export default SlugPage;
