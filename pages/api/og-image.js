import { withOGImage } from 'next-api-og-image'

export default withOGImage({
  template: {
    html: ({ title }) => `
      <html>
        <head>
          <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <style>
          @font-face {
            font-family: "Wotfard";
            src: local("Wotfard"), url("../public/fonts/wotfard/wotfard-semibold.woff2") format("woff2");
            font-weight: 600;
            font-style: normal;
          }
          body {
            font-family: 'Wotfard', sans-serif;
          }
        </style>
        <body class="bg-black">
          <div class="h-full flex flex-col justify-center text-center">
            <h1 class="py-8 text-7xl font-semibold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">${title}</h1>
          </div>
        </body>
      </html>
    `,
  },
  cacheControl: 'public, max-age=604800, immutable',
  dev: {
    inspectHtml: false,
  },
})