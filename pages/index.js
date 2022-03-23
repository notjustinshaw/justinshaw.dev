import Landing, { getStaticProps as gsp } from "../lib/landing";

export const getStaticProps = gsp;

const Home = ({ posts }) => {
  return Landing({
    posts,
    subtitle: 'eth'
  });
}

export default Home;
