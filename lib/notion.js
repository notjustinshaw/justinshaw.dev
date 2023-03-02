import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;


export const getDatabase = async () => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
          "property": "Date",
          "direction": "descending"
      }
    ]
  });
  return response.results;
};

export const getId = async (slug) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      text: {
        equals: slug,
      },
    }
  });
  return response.results[0].id;
}

export const getPage = async (pageId) => {
  return await notion.pages.retrieve({ page_id: pageId });
};

export const getBlocks = async (blockId) => {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};
