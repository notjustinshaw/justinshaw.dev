import { Fragment, useState, useEffect } from "react";
import { getScrollPct } from "../lib/scroll";
import Head from "next/head";
import "katex/dist/katex.min.css";
import { getDatabase, getPage, getBlocks, getId } from "../lib/notion";
import Link from "next/link";
import { BlockMath, InlineMath } from "react-katex";
import { FileSymlinkFileIcon } from "@primer/octicons-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import Gist from "react-gist";
import Cookies from "js-cookie";
import { track } from "@amplitude/analytics-browser";

export const Text = ({ text }) => {
  if (text.length == 0) {
    return <span className="select-none">&nbsp;</span>;
  }
  return text.map((value) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;
    if (value.type == "equation") {
      return <InlineMath math={value.equation.expression} />;
    } else {
      return (
        <span
          className={[
            bold ? "font-bold" : "",
            code
              ? "bg-black/5 rounded px-1.5 py-1 font-mono text-[14px] text-red-600"
              : "",
            italic ? "italic" : "",
            strikethrough ? "line-through" : "",
            underline ? "underline" : "",
          ]
            .join(" ")
            .trim()}
          style={color !== "default" ? { color } : {}}
        >
          {text.link ? (
            <a href={text.link.url}>{text.content}</a>
          ) : (
            text.content
          )}
        </span>
      );
    }
  });
};

const renderBlock = (block, i, blocks) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return value.text.length > 0 && value.text[0].type == "equation" ? (
        <BlockMath math={value.text[0].equation.expression} />
      ) : (
        <p className="pb-6 text-[19px] font-normal text-gray-800">
          <Text text={value.text} />
        </p>
      );
    case "heading_1":
      const tag = value.text[0].plain_text.toLowerCase().replace(" ", "-");
      return (
        <h1 className="text-indigo-800 my-12 block text-left text-2xl font-semibold leading-8 tracking-tight sm:text-4xl">
          <a id={tag} href={`#${tag}`}>
            <Text text={value.text} />
          </a>
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="my-8 block text-left text-xl font-semibold leading-8 tracking-tight text-gray-800 sm:text-3xl">
          <Text text={value.text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="my-6 block text-left text-xl font-medium leading-8 tracking-tight text-gray-800 sm:text-2xl">
          <Text text={value.text} />
        </h3>
      );
    case "bulleted_list_item":
      return (
        <li
          key={block.id}
          className="marker:text-indigo-500 list-disc pb-3 pl-8  text-[19px]"
        >
          <Text text={value.text} />
        </li>
      );
    case "numbered_list_item":
      if (i === 0 || blocks[i - 1].type !== "numbered_list_item") {
        const last = blocks.findIndex(
          (blk, idx) => idx > i && blk.type !== "numbered_list_item"
        );
        return (
          <ol className="list-inside">
            {blocks
              .filter((_blk, idx) => idx >= i && idx < last)
              .map((block) => {
                return (
                  <li
                    key={block.id}
                    className="marker:text-indigo-600 list-decimal pb-3 pl-8 text-[19px]"
                  >
                    <Text text={block[block.type].text} />
                  </li>
                );
              })}
          </ol>
        );
      }
      return <></>;
    case "to_do":
      return (
        <div className="pb-1 pl-8 text-[19px]">
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
            <Text text={value.text} />
          </label>
        </div>
      );
    case "toggle":
      return (
        <details>
          <summary>
            <Text text={value.text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case "child_page":
      return <p>{value.title}</p>;
    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure className="flex justify-center">
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={id} />;
    case "quote":
      return (
        <blockquote
          key={id}
          className="my-6 rounded-r-lg border-l-4 border-gray-800 bg-gray-100 p-4 text-left text-lg font-medium leading-8 tracking-tight text-gray-800 sm:text-xl"
        >
          {<Text text={value.text} />}
        </blockquote>
      );
    case "code":
      const lang = languages.java;
      const [code, _setCode] = useState(
        value.text.reduce((a, v) => {
          return a + v.plain_text;
        }, "")
      );
      return (
        <Editor
          className="editor select-none border-none"
          value={code}
          onValueChange={() => {}}
          highlight={(code) => highlight(code, lang)}
          padding={10}
          tabSize={2}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 15,
          }}
        />
      );
    case "file":
      const src_file =
        value.type === "external" ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split("/");
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const caption_file = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <div className={styles.file}>
            📎{" "}
            <Link href={src_file} passHref>
              {lastElementInArray.split("?")[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );
    case "callout":
      let bg_color = "bg-gray-100";
      let border_color = "border-gray-800";
      if (value.icon.type === "emoji") {
        if (value.icon.emoji === "✅") {
          bg_color = "bg-green-100";
          border_color = "border-green-800";
        } else if (value.icon.emoji === "❌") {
          bg_color = "bg-red-100";
          border_color = "border-red-800";
        } else if (value.icon.emoji === "⚠️") {
          bg_color = "bg-orange-100";
          border_color = "border-orange-800";
        } else if (value.icon.emoji === "🔔") {
          bg_color = "bg-yellow-100";
          border_color = "border-yellow-800";
        } else if (value.icon.emoji === "💡") {
          bg_color = "bg-blue-100";
          border_color = "border-blue-800";
        }
      }
      return (
        <div
          key={id}
          className={`relative my-6 p-4 text-left text-lg font-normal leading-8 tracking-tight text-gray-800 sm:text-xl ${bg_color} rounded-r-lg border-l-4 ${border_color}`}
        >
          {value.icon.type === "emoji" && (
            <div className="bg-white absolute -top-4 -left-5 rounded-full px-2 py-1">
              {value.icon.emoji}
            </div>
          )}
          {<Text text={value.text} />}
        </div>
      );
    case "equation":
      return (
        <div className="flex w-full justify-center py-4 text-[19px]">
          <InlineMath math={block.equation.expression} />
        </div>
      );
    case "embed":
      const url = block.embed.url ?? "";
      if (url.includes("github")) {
        const splitURL = url.split("/");
        const gistID = splitURL[splitURL.length - 1];
        return <Gist id={gistID} />;
      } else {
        return <iframe src={url + "?embed=true"} width="100%" height="600px" />;
      }
    case "link_to_page":
      return (
        <a
          id={block.slug}
          href={`/${block.slug}`}
          className="ml-6 flex no-underline hover:underline"
        >
          <FileSymlinkFileIcon aria-label="Open article" className="mr-2 h-8" />
          <p className="pb-6 text-[19px] font-normal text-gray-800">
            {block.title}
          </p>
        </a>
      );
    default:
      console.log("Unknown block type:", block.type);
      console.log(block);
      return `❌ Unsupported block (${
        type === "unsupported" ? "unsupported by Notion API" : type
      })`;
  }
};

export default function Post({ page, slug, blocks }) {
  if (!page || !blocks) {
    return <div />;
  }

  let scrollBreakpoints = [10, 50, 90];
  let maxScrollPct = 0;

  useEffect(() => {
    const handleScroll = () => {
      const newScrollPct = getScrollPct(document);
      for (let i = 0; i < scrollBreakpoints.length; i++) {
        if (newScrollPct > scrollBreakpoints[i]) {
          track("scroll_article", {
            slug,
            scroll: scrollBreakpoints[i],
          });
          maxScrollPct = Math.max(newScrollPct, maxScrollPct);
          scrollBreakpoints = scrollBreakpoints.filter((b) => b > maxScrollPct);
        }
      }
    };
    track("load_article", {
      ...Cookies.get(),
      slug,
    });
    window.addEventListener("mousewheel", handleScroll, true);
    window.addEventListener("touchmove", handleScroll, true);
  }, []);

  let title = page.properties.Name.title[0].plain_text;

  return (
    <main>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:url"
          content={`https://www.justinshaw.dev/${slug}`}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
        <meta property="og:image" content={`/api/og-image?title=${title}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@notjustinshaw" />
      </Head>

      <article className="md:mt-18 mx-auto mt-8 max-w-3xl px-5">
        <header>
          <h1 className="py-6 text-center text-4xl font-semibold sm:py-16">
            <Text text={page.properties.Name.title} />
          </h1>
        </header>
        <section className="md:mb-24">
          {blocks.map((block, i, blocks) => (
            <Fragment key={block.id}>{renderBlock(block, i, blocks)}</Fragment>
          ))}
        </section>
      </article>
    </main>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase();
  return {
    paths: database.map((page) => ({
      params: {
        slug: page.properties.Slug.url,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { slug } = context.params;
  const id = await getId(slug);
  const page = await getPage(id);
  const blocks = await getBlocks(id);

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]["children"] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }
    return block;
  });
  const blocksWithChildrenAndLinkedPages = await Promise.all(
    blocksWithChildren.map(async (block) => {
      if (block.type === "link_to_page") {
        const page = await getPage(block.link_to_page.page_id);
        block["slug"] = page.properties.Slug.url;
        block["title"] = page.properties.Name.title[0].plain_text;
      }
      return block;
    })
  );

  return {
    props: {
      page,
      slug,
      blocks: blocksWithChildrenAndLinkedPages,
    },
    revalidate: 1,
  };
};
