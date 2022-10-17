import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  return (
    <>
      {status === "loading" && "Loading..."}
      {!session && (
        <Link href="/api/auth/signin">
          <a>Log in</a>
        </Link>
      )}
      {session && <pre>{JSON.stringify(session, undefined, 1)}</pre>}
    </>
  );
};

export default Home;
