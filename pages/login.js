import React from "react";
import Head from "next/dist/next-server/lib/head";

const Login = () => {
  return (
    <div className="font-quicksand">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h2>Login</h2>
    </div>
  );
};

export default Login;
