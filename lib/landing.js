import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Command from "./command";
import { getDatabase } from "./notion";
import { Text } from "../pages/[slug].js";
import { useRouter } from "next/router";
import { track } from "@amplitude/analytics-browser";
import Cookies from "js-cookie";

const tag_colors = {
  gray: "zinc",
  brown: "stone",
  orange: "orange",
  yellow: "yellow",
  green: "green",
  blue: "blue",
  purple: "violet",
  pink: "pink",
  red: "red",
};

export default function Landing({ posts, subtitle }) {
  const router = useRouter();
  const query = router.asPath.split("=")[1] ?? "";
  const opts = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  };

  useEffect(() => {
    track("load_landing", {
      ...Cookies.get(),
      subtitle,
      num_posts: posts.length,
    });
  }, []);

  return (
    <>
      <Head>
        <title>Justin Shaw</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-3xl px-5">
        <header className="md:mt-18 border-black/10 mt-8 mb-12 border-b">
          <h1 className="py-8 text-3xl font-bold">
            Justin Shaw
            <span className="text-black/30 font-normal"> .{subtitle}</span>
          </h1>
        </header>
        <Command posts={posts} />
        <ol className="flex flex-col gap-6">
          {posts
            .filter((post) =>
              post.properties.Category.select.name
                .toLowerCase()
                .startsWith(query.toLowerCase())
            )
            .map((post) => {
              const datetime = post.properties.Date.date?.start;
              const date = new Date(datetime).toLocaleString("en-US", opts);
              const search = {
                pathname: "/search",
                query: {
                  q: post.properties.Category.select.name.toLowerCase(),
                },
              };
              return (
                <Link
                  key={post.id}
                  href={
                    post.properties.Category.select.name === "Youtube"
                      ? post.properties.URL.url
                      : `/${post.properties.Slug.url}`
                  }
                  onClick={() =>
                    track("click_article", {
                      slug: `/${post.properties.Slug.url}`,
                    })
                  }
                >
                  <li className="flex flex-row justify-between hover:cursor-pointer">
                    <div className="flex flex-col">
                      <h3 className="text-black/80 text-xl font-medium">
                        <Text text={post.properties.Name.title} />
                      </h3>
                      <p className="text-md text-black/50">
                        {datetime ? date : "Sometime"}
                        <span
                          className={`text-black/40 mx-2 rounded py-0.5 px-1.5 text-sm bg-${
                            tag_colors[post.properties.Category.select.color] ||
                            "gray"
                          }-100`}
                        >
                          <Link
                            href={search}
                            onMouseEnter={() =>
                              track("click_tag", {
                                query: post.properties.Category.select.name,
                              })
                            }
                          >
                            {post.properties.Category.select.name}
                          </Link>
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col justify-end">
                      <span className="text-black/60 hover:text-black/90">
                        {post.properties.Category.select.name === "Youtube"
                          ? "Watch video →"
                          : "Read post →"}
                      </span>
                    </div>
                  </li>
                </Link>
              );
            })}
        </ol>
      </main>
    </>
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
