import Head from "next/head";
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

function TeX() {
  return (
    <main className="h-full pb-4 mx-auto bg-black/5">
      <header className="sticky top-0 bg-white z-10 border border-b">
        <h1 className="font-semibold text-center text-4xl py-8 bg-white">
          Header
        </h1>
      </header>
      <article className="my-4 py-8 mx-auto w-[51rem] h-[70rem] shadow-md bg-white">
        <BlockMath>
          {String.raw`f(\relax{x}) = \int_{-\infty}^\infty f(\hat\xi)\,e^{2 \pi i \xi x}\,d\xi`}
        </BlockMath>
      </article>
    </main>
  ); 
}

export default TeX;