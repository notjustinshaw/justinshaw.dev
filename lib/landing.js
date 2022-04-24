import Head from "next/head";
import Link from "next/link";
import Command from "./command";
import { getDatabase } from "./notion";
import { Text } from "../pages/[slug].js";
import { useRouter } from 'next/router';

export default function Landing({ posts, subtitle }) {
  const router = useRouter();
  const query = router.asPath.split('=')[1] ?? '';
  const opts = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: 'UTC'
  };
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
            <span className="font-normal text-black/30"> .{subtitle}</span>
          </h1>
        </header>
        <Command posts={posts}/>
        <ol className="flex flex-col gap-6">
          {posts.filter((post) => post.properties.Category.select.name.toLowerCase().startsWith(query.toLowerCase())
          ).map((post) => {
            const datetime = post.properties.Date.date?.start;
            const date = new Date(datetime).toLocaleString("en-US", opts);
            const search = {
              pathname: 'search',
              query: { 'q': post.properties.Category.select.name.toLowerCase() },
            };
            return (
              <Link key={post.id} href={`/${post.properties.Slug.url}`}>
                <li className="flex flex-row justify-between hover:cursor-pointer">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-medium text-black/80">
                      <Text text={post.properties.Name.title} />
                    </h3>
                    <p className="text-md text-black/50">
                      {datetime ? date : "Sometime"}
                      <span className={`py-0.5 px-1.5 mx-2 text-sm text-black/40 rounded bg-${post.properties.Category.select.color}-100`}>
                        <Link href={search}>
                          {post.properties.Category.select.name}
                        </Link>
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col justify-end">
                    <span className="text-black/60 hover:text-black/90">Read post →</span>
                  </div>
                </li>
              </Link>
            );
          })}
        </ol>
      </main>
    </div>
  );
}

export const getStaticProps = async (_context) => {
  const database = await getDatabase();
  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
