import { format as formatDate } from 'date-fns';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { IPost } from '../interfaces/Post';
import styles from '../styles/Home.module.scss';
import ContentfulAPI from '../utils/ContentfulAPI';

interface IProps {
  posts: Array<IPost>;
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  const posts = await ContentfulAPI.getAllPosts();
  return {
    props: {
      posts,
    },
  };
};

const Home: NextPage<IProps> = (props) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Blog System</h1>

      <div className={styles.list}>
        {props.posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <a className={styles.card}>
              <span className={styles.card__title}>{post.title}</span>
              <span className={styles.card__date}>{formatDate(new Date(post.date), 'yyyy/MM/dd')}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
