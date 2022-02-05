import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text } from "./[slug].js";

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Justin Shaw</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-5 max-w-3xl mx-auto">
        <header className="mt-8 md:mt-18 border-b border-black/10 mb-12">
          <h1 className="font-bold text-3xl py-8">
            Justin Shaw
            <span className="font-normal text-black/30"> .eth</span>
          </h1>
        </header>
        <ol className="flex flex-col gap-6">
          {posts.map((post) => {
            const datetime = post.properties.Date.date?.start;
            const date = new Date(datetime).toLocaleString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            );
            return (
              <li key={post.id} className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h3 className="text-xl font-medium text-black/80">
                    <Link href={`/${post.properties.Slug.url}`}>
                      <a>
                        <Text text={post.properties.Name.title} />
                      </a>
                    </Link>
                  </h3>
                  <p className="text-md text-black/50">{date}</p>
                </div>
                <div className="flex flex-col justify-end">
                  <Link href={`/${post.properties.Slug.url}`}>
                    <a className="text-black/60 hover:text-black/90">Read post →</a>
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase();
  
  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
