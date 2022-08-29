import type { NextPage } from 'next';
import Head from 'next/head';
import HomeBody from '@components/Pages/Home';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Pokemaniac</title>
      <meta name="description" content="All the pokemons are listed here" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <HomeBody />
  </>
);

export default Home;
