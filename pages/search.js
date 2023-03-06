import Landing, { getStaticProps as gsp } from "../lib/landing";
import { useRouter } from "next/router";

export const getStaticProps = gsp;

const Search = ({ posts }) => {
  const router = useRouter();

  return Landing({
    posts,
    subtitle: router.asPath.split("=")[1],
  });
};

export default Search;
