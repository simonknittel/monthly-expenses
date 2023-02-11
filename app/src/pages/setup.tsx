import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import EncryptionKey from "../components/EncryptionKey";
import Logout from "../components/Logout";
import { useEncryptionKey } from "../contexts/EncryptionKey";
import { getServerAuthSession } from "../server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const Page: NextPage = () => {
  const router = useRouter();
  const { encryptionKey } = useEncryptionKey();

  if (encryptionKey) {
    router.push("/overview");
    return null;
  }

  return (
    <>
      <Head>
        <title>Overview - Monthly Expenses</title>
        <meta name="description" content="" />
      </Head>

      <main className="flex flex-col items-center justify-center gap-4">
        <Logout />

        <EncryptionKey />
      </main>
    </>
  );
};

export default Page;
