import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-bk-grayLight font-quicksand ">
      <div className="container mx-auto">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <Navbar />
      </div>
    </div>
  );
}
